/**
 * SEO-aware static route publisher for GitHub Pages & Cloudflare Pages.
 * Run after `vite build`. Every page gets its own real /route/index.html,
 * unique metadata, JSON-LD, crawler-readable HTML and canonical URL.
 * Blog posts are discovered from `src/posts/*.jsx` automatically.
 */
import {readFile,writeFile,mkdir,readdir,rm} from 'node:fs/promises';
import {resolve,join,dirname} from 'node:path';
import {runInNewContext} from 'node:vm';
import {pathToFileURL} from 'node:url';
import {build as esbuild} from 'esbuild';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {profile,projects,timeline} from '../src/SiteData.js';
import {readdir as listLegacy} from 'node:fs/promises';

const root=resolve(import.meta.dirname,'..');
const dist=join(root,'dist');
const originOverride=(process.env.SITE_URL||process.env.VITE_SITE_URL||profile.website).trim().replace(/\/$/,'');
const base=(process.env.VITE_BASE_PATH||'/').replace(/^([^/])/, '/$1').replace(/\/*$/, '/');
const absoluteBase=new URL(originOverride+'/');
if(absoluteBase.pathname==='/' && base!=='/') absoluteBase.pathname=base;
const siteUrl=absoluteBase.href.replace(/\/$/,'');
const urlFor=route=>siteUrl+(route==='/'?'/':route.replace(/\/$/,'')+'/');
const fileUrl=file=>siteUrl+'/'+file.replace(/^\/+/, '');
const localFor=route=>base+(route==='/'?'':route.replace(/^\/|\/$/g,'')+'/');
const esc=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const authorId=urlFor('/about')+'#himal-neupane';
const socialProfiles=[profile.github,profile.instagram,profile.x,profile.linkedin];
const defaultKeywords='Himal Neupane, HimalNpne, Himal NPNE, Neupane Himal, Nepal, React developer, web developer, software projects';
const mainLinks=[['/','Home'],['/work','Projects'],['/about','About'],['/blog','Blog'],['/faq','FAQ'],['/contact','Contact'],['/support','Support'],['/privacy','Privacy']];

function findMetaObject(source){
 const start=source.search(/export\s+const\s+meta\s*=/);
 if(start<0)throw new Error('Post is missing exported meta');
 const open=source.indexOf('{',start);if(open<0)throw new Error('Post meta must be an object');
 let depth=0,quote=null,escape=false;
 for(let i=open;i<source.length;i++){
  const c=source[i];
  if(quote){if(escape){escape=false;continue;}if(c==='\\'){escape=true;continue;}if(c===quote)quote=null;continue;}
  if(c==='"'||c==="'"||c==='`'){quote=c;continue;}
  if(c==='{')depth++;if(c==='}')depth--;
  if(depth===0){
   const data=runInNewContext('('+source.slice(open,i+1)+')',Object.create(null),{timeout:100});
   if(!data?.slug||!data?.title||!data?.date||!/^[a-z0-9-]+$/.test(data.slug))throw new Error('Invalid blog metadata. Use a unique slug, title and ISO date.');
   return JSON.parse(JSON.stringify(data));
  }
 }
 throw new Error('Unterminated post metadata');
}

const postFiles=(await readdir(join(root,'src/posts'))).filter(name=>name.endsWith('.jsx'));
const posts=[];
for(const file of postFiles){
 const source=await readFile(join(root,'src/posts',file),'utf8');
 const meta=findMetaObject(source);
 if(posts.find(p=>p.slug===meta.slug)) throw new Error('Duplicate blog slug: '+meta.slug);
 posts.push({...meta,source,file,route:'/blog/'+meta.slug});
}

// Imported archive posts are regular JS data modules, not React/JSX entries.
// Keep their exact editorial content and render full text for search crawlers.
const legacyPaths=(await listLegacy(join(root,'src/legacyPosts'))).filter(name=>name.endsWith('.js'));
for(const file of legacyPaths){
 const module=await import(pathToFileURL(join(root,'src/legacyPosts',file)).href);
 const original=module.default;
 if(posts.some(p=>p.slug===original.slug))throw new Error('Duplicate blog slug: '+original.slug);
 const category=original.slug.includes('nepal-travel')?'Travel':original.slug.includes('adventure')||original.slug.includes('vehicles')?'Mobility':'Technology';
 posts.push({slug:original.slug,title:original.title,date:original.date,author:original.author,excerpt:original.excerpt,tags:original.tags||[],category,cover:original.featuredImage,route:'/blog/'+original.slug,legacy:true,blocks:original.content||[]});
}
posts.sort((a,b)=>b.date.localeCompare(a.date));

// Optional static article rendering: use the actual React post JSX in the build
// so crawlers see headings and paragraphs without executing client-side JS.
// If a particular custom article requires a browser, fall back to its metadata.
function richText(s){return esc(s).replace(/&lt;(strong|b|em|i|code)&gt;/gi,'<$1>').replace(/&lt;\/(strong|b|em|i|code)&gt;/gi,'</$1>');}
function renderLegacyBlocks(blocks){
 return (blocks||[]).map(block=>{
  if(block.type==='paragraph')return `<p>${richText(block.text||'')}</p>`;
  if(block.type==='header'){const n=block.level===3?3:2;return `<h${n}>${esc(block.text||'')}</h${n}>`;}
  if(block.type==='list')return '<ul>'+(block.items||[]).map(item=>`<li>${richText(typeof item==='string'?item:(item.text||''))}</li>`).join('')+'</ul>';
  if(block.type==='quote')return `<blockquote><p>${esc(block.text||'')}</p>${block.author?'<cite>'+esc(block.author)+'</cite>':''}</blockquote>`;
  if(block.type==='table')return '<div class="seo-table"><table><thead><tr>'+(block.headers||[]).map(h=>`<th>${esc(h)}</th>`).join('')+'</tr></thead><tbody>'+(block.rows||[]).map(row=>'<tr>'+(Array.isArray(row)?row:row.data||[]).map(c=>`<td>${esc(c)}</td>`).join('')+'</tr>').join('')+'</tbody></table></div>';
  if(block.type==='hero')return `<h2>${esc(block.title||'')}</h2><p>${esc(block.subtitle||'')}</p>`;
  return '';
 }).join('');
}
async function articleBody(post){
 if(post.legacy)return renderLegacyBlocks(post.blocks);

 const tempDir=join(root,'.seo-tmp');
 await mkdir(tempDir,{recursive:true});
 try{
  const out=join(tempDir,post.slug+'.mjs');
  await esbuild({entryPoints:[join(root,'src/posts',post.file)],outfile:out,bundle:true,platform:'node',format:'esm',jsx:'automatic',packages:'external',logLevel:'silent'});
  const mod=await import(pathToFileURL(out).href);
  if(typeof mod.default!=='function')throw new Error('No default article component');
  return renderToStaticMarkup(React.createElement(mod.default));
 }catch(error){
  console.warn(`Static content fallback for ${post.slug}: ${error.message}`);
  return `<p>${esc(post.excerpt||'An article by Himal Neupane.')}</p>`+(post.toc||[]).map(([,heading])=>`<h2>${esc(heading)}</h2>`).join('');
 }
}

const pageData=[
 {route:'/',title:'Himal Neupane (HimalNpne) — Creative Developer & Portfolio',description:'Official portfolio of Himal Neupane, also known as HimalNpne and Himal NPNE. Explore React development, UI/UX design, full-stack projects and articles.',heading:'Himal Neupane — thoughtful digital work',type:'WebPage',keywords:defaultKeywords},
 {route:'/work',title:'Projects & Case Studies | Himal Neupane',description:'Software projects, React interfaces, full-stack applications and creative development case studies by Himal Neupane (himalnpne).',heading:'Projects and case studies by Himal Neupane',type:'CollectionPage',keywords:defaultKeywords+', full-stack projects, UI design'},
 {route:'/about',title:'About Himal Neupane | Developer in Nepal',description:'Meet Himal Neupane (HimalNpne), a Nepal-based developer creating refined React interfaces, full-stack applications and practical digital products.',heading:'About Himal Neupane',type:'ProfilePage',keywords:defaultKeywords+', Neupane Himal'},
 {route:'/blog',title:'Blog & Articles | Himal Neupane',description:'Blog articles on React, interface design, accessible animations and modern web development written by Himal Neupane (himalnpne).',heading:'Blog by Himal Neupane',type:'Blog',keywords:defaultKeywords+', blog, articles'},
 {route:'/faq',title:'Frequently Asked Questions | Himal Neupane',description:'Answers about working with Himal Neupane, React development, freelance collaboration, design services and publishing blog posts.',heading:'Frequently asked questions',type:'FAQPage',keywords:defaultKeywords+', FAQ, services'},
 {route:'/contact',title:'Contact Himal Neupane | Web Development & Collaboration',description:'Contact Himal Neupane (HimalNpne) about website development, React, product design, UI/UX and full-stack collaborations.',heading:'Contact Himal Neupane',type:'ContactPage',keywords:defaultKeywords+', contact'},
 {route:'/support',title:'Support My Work | Himal Neupane',description:'Support Himal Neupane and free tutorials, guides, software projects and independent articles.',heading:'Support my work',type:'WebPage',keywords:defaultKeywords+', support'},
 {route:'/privacy',title:'Privacy Policy | Himal Neupane',description:'Information about contact forms, Google Forms, storage preferences, advertising and hosting of this portfolio.',heading:'Privacy policy',type:'WebPage',keywords:defaultKeywords+', privacy'},
];
for(const p of projects)pageData.push({route:'/work/'+p.id,title:`${p.name} — Project by Himal Neupane`,description:p.description,heading:p.name,type:'CreativeWork',project:p,keywords:defaultKeywords+', '+p.stack.join(', ')});
for(const p of posts)pageData.push({route:p.route,title:`${p.title} | Himal Neupane`,description:p.excerpt||`Read ${p.title}, an article by Himal Neupane.`,heading:p.title,type:'BlogPosting',post:p,keywords:defaultKeywords+', '+(p.tags||[]).join(', ')});

function crumbs(page){
 const parts=page.route.split('/').filter(Boolean),result=[{name:'Home',item:urlFor('/')}];
 let path='';for(const part of parts){path+='/'+part;const match=pageData.find(p=>p.route===path);result.push({name:match?.heading||part,item:urlFor(path)});}
 return {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:result.map((p,i)=>({'@type':'ListItem',position:i+1,name:p.name,item:p.item}))};
}
function schemas(page){
 const website={'@context':'https://schema.org','@type':'WebSite','@id':urlFor('/')+'#website',name:'Himal Neupane | HimalNpne',url:urlFor('/'),description:pageData[0].description,inLanguage:'en',publisher:{'@id':authorId}};
 const person={'@context':'https://schema.org','@type':'Person','@id':authorId,name:'Himal Neupane',givenName:'Himal',familyName:'Neupane',alternateName:['HimalNpne','Himal NPNE','Neupane Himal','himalnpne'],url:urlFor('/'),sameAs:socialProfiles,jobTitle:'Creative Developer & Digital Builder',homeLocation:{'@type':'Country',name:'Nepal'},knowsAbout:['React','JavaScript','User interface design','Full-stack development','Python']};
 let document={'@context':'https://schema.org','@type':page.type,'@id':urlFor(page.route)+'#webpage',url:urlFor(page.route),name:page.heading,headline:page.title,description:page.description,inLanguage:'en',isPartOf:{'@id':website['@id']},author:{'@id':authorId},image:urlFor('/').replace(/\/$/,'')+'/social-preview.jpg'};
 if(page.post){document={...document,'@type':'BlogPosting',headline:page.post.title,datePublished:page.post.date,keywords:(page.post.tags||[]).join(', '),articleSection:page.post.category||'Blog',mainEntityOfPage:urlFor(page.route)};}
 if(page.project){document={...document,'@type':'CreativeWork',name:page.project.name,about:page.project.description,keywords:page.project.stack.join(', '),dateCreated:page.project.year};}
 if(page.route==='/about'){document.mainEntity={'@id':authorId};}
 if(page.route==='/blog'){document.blogPost=posts.map(post=>({'@type':'BlogPosting',headline:post.title,url:urlFor(post.route),datePublished:post.date,author:{'@id':authorId}}));}
 if(page.route==='/faq'){document.mainEntity=faqItems.map(([,q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}));}
 return [website,person,document,crumbs(page)];
}

// Keep the FAQ in one source; parse its literal content to avoid SEO mismatch.
const faqSource=await readFile(join(root,'src/pages/FAQ.jsx'),'utf8');
const faqArray=faqSource.match(/const questions\s*=\s*(\[[\s\S]*?\n\]);/);
let faqItems=[];
if(faqArray){faqItems=JSON.parse(JSON.stringify(runInNewContext(faqArray[1],Object.create(null),{timeout:100})));}

function routeLinks(){return `<nav aria-label="Pages">${mainLinks.map(([route,label])=>`<a href="${esc(localFor(route))}">${esc(label)}</a>`).join('')}</nav>`;}
function pageBody(page){
 const wrap=(html)=>`<div class="seo-prerender"><header><a href="${esc(localFor('/'))}"><img src="${esc(base+'logo.svg')}" alt="Himal Neupane logo" width="45" height="45"></a>${routeLinks()}</header><main id="seo-main"><p class="seo-kicker">Himal Neupane / HimalNpne</p><h1>${esc(page.heading)}</h1><p>${esc(page.description)}</p>${html}</main><footer>${routeLinks()}<p>Himal Neupane · Nepal · <a href="${esc(profile.github)}">GitHub</a> · <a href="${esc(profile.instagram)}">Instagram</a> · <a href="${esc(profile.x)}">X</a> · <a href="${esc(profile.linkedin)}">LinkedIn</a></p></footer></div>`;
 if(page.route==='/')return wrap(`<section><h2>Design, develop and deploy — featured projects</h2>${projects.slice(0,4).map(p=>`<h3><a href="${esc(localFor('/work/'+p.id))}">${esc(p.name)}</a></h3><p>${esc(p.description)}</p>`).join('')}</section><section><h2>Latest articles</h2>${posts.slice(0,3).map(p=>`<p><a href="${esc(localFor(p.route))}">${esc(p.title)}</a></p>`).join('')}</section>`);
 if(page.route==='/work')return wrap(`<section><h2>React and full-stack case studies</h2>${projects.map(p=>`<article><h3><a href="${esc(localFor('/work/'+p.id))}">${esc(p.name)}</a></h3><p>${esc(p.description)}</p><p>${esc(p.stack.join(' · '))}</p></article>`).join('')}</section>`);
 if(page.route==='/about')return wrap(`<section><h2>Creative developer from Nepal</h2><p>${esc(profile.about)}</p><p>Himal Neupane, known online as HimalNpne, Himal NPNE and Neupane Himal, builds digital experiences with React, JavaScript, Python, and modern web tools.</p>${timeline.map(t=>`<h3>${esc(t.title)} — ${esc(t.org)}</h3><p>${esc(t.detail)}</p>`).join('')}</section>`);
 if(page.route==='/blog')return wrap(`<section><h2>Articles and notes</h2>${posts.map(p=>`<article><h3><a href="${esc(localFor(p.route))}">${esc(p.title)}</a></h3><time datetime="${esc(p.date)}">${esc(p.date)}</time><p>${esc(p.excerpt)}</p></article>`).join('')}</section>`);
 if(page.route==='/faq')return wrap(`<section>${faqItems.map(([,q,a])=>`<h2>${esc(q)}</h2><p>${esc(a)}</p>`).join('')}</section>`);
 if(page.route==='/support')return wrap(`<section><h2>Support independent projects</h2><p>Contribute using the Payoneer payment link or contact me to arrange a suitable method. Your support helps maintain free tutorials, writing and open projects.</p><a href="https://link.payoneer.com/Token?t=F582E1BA6E154DA2A8802E884260FE94&amp;src=pl">Payoneer payment link</a></section>`);
 if(page.route==='/privacy')return wrap(`<section><h2>How this site handles information</h2><p>This portfolio uses browser storage for saved theme and motion preferences. The contact form forwards user-submitted name, message and contact methods to Google Forms. GitHub or Cloudflare hosting may process technical request data. Advertising is optional and disabled until configured. External links have separate privacy practices.</p><p>To request information about a contact submission, use the contact page.</p></section>`);
 if(page.route==='/contact')return wrap(`<section><h2>Work with Himal Neupane</h2><p>Available for select frontend, UI/UX, and web development collaborations. Connect on social platforms below.</p><a href="${esc(profile.github)}">GitHub</a> · <a href="${esc(profile.linkedin)}">LinkedIn</a> · <a href="${esc(profile.instagram)}">Instagram</a> · <a href="${esc(profile.x)}">X</a></section>`);
 if(page.project){const p=page.project;return wrap(`<article><h2>${esc(p.subtitle)}</h2><p>${esc(p.description)}</p><h2>The challenge</h2><p>${esc(p.challenge)}</p><h2>The approach</h2><p>${esc(p.solution)}</p><p>Technologies: ${esc(p.stack.join(', '))}</p></article>`);}
 return wrap('');
}
const baseHtml=await readFile(join(dist,'index.html'),'utf8');
const cleanRouteMetadata=html=>html
 .replace(/<title>[\s\S]*?<\/title>/i,'')
 .replace(/<meta\b(?=[^>]*\b(?:name|property)=["'](?:description|author|robots|keywords|og:[^"']+|twitter:[^"']+|article:[^"']+)["'])[^>]*>/gi,'')
 .replace(/<link\b(?=[^>]*\brel=["'](?:canonical|alternate)["'])[^>]*>/gi,'')
 .replace(/<script\b(?=[^>]*type=["']application\/ld\+json["'])[\s\S]*?<\/script>/gi,'');
const ogImage=siteUrl+'/social-preview.jpg';
const style=`<style>.seo-prerender{color:#343434;background:#f8f8f5;min-height:100vh;font:16px/1.8 system-ui,sans-serif;padding:26px max(25px,calc((100vw - 1100px)/2))}.seo-prerender header,.seo-prerender footer{border-bottom:1px solid #deded8;padding:15px 0}.seo-prerender header{display:flex;align-items:center;gap:30px;flex-wrap:wrap}.seo-prerender nav{display:flex;gap:17px;flex-wrap:wrap}.seo-prerender a{color:#880d1e;text-decoration:none}.seo-prerender main{max-width:870px;margin:70px 0}.seo-prerender h1{font-size:clamp(34px,6vw,70px);line-height:1.1;letter-spacing:-.04em}.seo-prerender h2{font-size:25px;line-height:1.4;margin-top:55px}.seo-prerender h3{font-size:20px}.seo-kicker{text-transform:uppercase;font-size:11px;letter-spacing:.08em}.seo-prerender footer{border-top:1px solid #deded8;border-bottom:0}.seo-prerender article{margin:30px 0 40px}</style>`;
const staticPostMemo=new Map();
for(const page of pageData){
 const canonical=urlFor(page.route),isArticle=!!page.post;
 const cardImage=page.post?.cover?new URL((base+page.post.cover.replace(/^\//,'')),siteUrl+'/').href:ogImage;
 const tags=[
  `<title>${esc(page.title)}</title>`,
  `<meta name="description" content="${esc(page.description)}">`,
  `<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">`,
  `<meta name="author" content="Himal Neupane">`,
  `<meta name="keywords" content="${esc(page.keywords)}">`,
  `<link rel="canonical" href="${esc(canonical)}">`,
  `<link rel="alternate" type="application/rss+xml" title="Himal Neupane Blog" href="${esc(siteUrl+'/feed.xml')}">`,
  `<meta property="og:type" content="${isArticle?'article':'website'}">`,
  `<meta property="og:site_name" content="Himal Neupane | HimalNpne">`,
  `<meta property="og:locale" content="en_US">`,
  `<meta property="og:title" content="${esc(page.title)}">`,
  `<meta property="og:description" content="${esc(page.description)}">`,
  `<meta property="og:url" content="${esc(canonical)}">`,
  `<meta property="og:image" content="${esc(cardImage)}">`,
  `<meta property="og:image:width" content="1200">`,
  `<meta property="og:image:height" content="630">`,
  `<meta property="og:image:alt" content="Himal Neupane — Creative developer and digital portfolio">`,
  `<meta name="twitter:card" content="summary_large_image">`,
  `<meta name="twitter:creator" content="@himalnpne">`,
  `<meta name="twitter:title" content="${esc(page.title)}">`,
  `<meta name="twitter:description" content="${esc(page.description)}">`,
  `<meta name="twitter:image" content="${esc(cardImage)}">`,
 ];
 if(isArticle){tags.push(`<meta property="article:published_time" content="${esc(page.post.date)}">`);tags.push(`<meta property="article:author" content="${esc(urlFor('/about'))}">`);}
 for(const json of schemas(page))tags.push(`<script type="application/ld+json" data-site-seo>${JSON.stringify(json).replaceAll('<','\\u003c')}</script>`);
 let html=cleanRouteMetadata(baseHtml)
  .replace('</head>', tags.join('\n')+style+'\n</head>');
 let main=pageBody(page);
 if(page.post){
  let article=staticPostMemo.get(page.post.slug);
  if(!article){article=await articleBody(page.post);staticPostMemo.set(page.post.slug,article);}
  main=main.replace('</main>',`<article>${article}</article></main>`);
 }
 html=html.replace('<div id="root"></div>',`<div id="root">${main}</div>`);
 const output=page.route==='/'?join(dist,'index.html'):join(dist,page.route.slice(1),'index.html');
 await mkdir(dirname(output),{recursive:true});
 await writeFile(output,html);
}
await rm(join(root,'.seo-tmp'),{recursive:true,force:true});
const sitemap='<?xml version="1.0" encoding="UTF-8"?>'+`\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`+pageData.map(p=>`<url><loc>${esc(urlFor(p.route))}</loc>${p.post?`<lastmod>${esc(p.post.date)}</lastmod>`:''}</url>`).join('\n')+'\n</urlset>\n';
await writeFile(join(dist,'sitemap.xml'),sitemap);
await writeFile(join(dist,'robots.txt'),`User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
await writeFile(join(dist,'feed.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Himal Neupane — Blog</title><link>${esc(urlFor('/blog'))}</link><description>Articles by Himal Neupane</description><language>en</language>${posts.map(p=>`<item><title>${esc(p.title)}</title><link>${esc(urlFor(p.route))}</link><guid>${esc(urlFor(p.route))}</guid><pubDate>${new Date(p.date+'T12:00:00Z').toUTCString()}</pubDate><description>${esc(p.excerpt)}</description></item>`).join('')}</channel></rss>`);
const keyPages=[
 ['Home','/',pageData[0].description],
 ['Projects','/work','Selected development and interface design projects.'],
 ['About','/about',profile.about],
 ['Blog','/blog','Articles on technology, privacy, travel, development and design.'],
 ['FAQ','/faq','Answers about services, collaboration, development and this website.'],
 ['Contact','/contact','Contact Himal Neupane about a project or collaboration.']
];
const llmsText=[
 `# ${profile.name}`,
 '',
 `> ${profile.role} based in ${profile.location}. ${profile.about}`,
 '',
 'This file links to the main public pages of the portfolio. Use the page URLs for current details.',
 '',
 '## Main pages',
 ...keyPages.map(([name,route,description])=>`- [${name}](${urlFor(route)}): ${description}`),
 '',
 '## Projects',
 ...projects.map(p=>`- [${p.name}](${urlFor('/work/'+p.id)}): ${p.description}`),
 '',
 '## Blog articles',
 ...posts.map(p=>`- [${p.title}](${urlFor(p.route)}): ${p.excerpt||'Article by Himal Neupane.'}`),
 '',
 '## Other resources',
 `- [HTML guide for AI systems](${fileUrl('llm.html')})`,
 `- [XML sitemap](${fileUrl('sitemap.xml')})`,
 `- [RSS feed](${fileUrl('feed.xml')})`,
 ''
].join('\n');
await writeFile(join(dist,'llms.txt'),llmsText);
const llmPage=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><link rel="canonical" href="${esc(fileUrl('llm.html'))}"><title>AI Guide | ${esc(profile.name)}</title><meta name="description" content="A concise, machine-readable guide to ${esc(profile.name)}'s portfolio, projects and blog."></head><body><main><h1>${esc(profile.name)} — AI and crawler guide</h1><p>${esc(profile.role)} based in ${esc(profile.location)}. ${esc(profile.about)}</p><p>For the compact Markdown index, see <a href="${esc(base)}llms.txt">llms.txt</a>. The complete public page list is in <a href="${esc(base)}sitemap.xml">sitemap.xml</a>.</p><h2>Main pages</h2><ul>${keyPages.map(([name,route,description])=>`<li><a href="${esc(urlFor(route))}">${esc(name)}</a> — ${esc(description)}</li>`).join('')}</ul><h2>Projects</h2><ul>${projects.map(p=>`<li><a href="${esc(urlFor('/work/'+p.id))}">${esc(p.name)}</a> — ${esc(p.description)}</li>`).join('')}</ul><h2>Blog articles</h2><ul>${posts.map(p=>`<li><a href="${esc(urlFor(p.route))}">${esc(p.title)}</a> — ${esc(p.excerpt||'Article by Himal Neupane.')}</li>`).join('')}</ul></main></body></html>`;
await writeFile(join(dist,'llm.html'),llmPage);
const llmsFull=[
 `# ${profile.name} — Portfolio and public content`,
 '',
 `## About`,
 `${profile.about} ${profile.role} based in ${profile.location}.`,
 '',
 '## Projects',
 ...projects.flatMap(p=>[`### ${p.name}`,`${p.description}`,`Challenge: ${p.challenge}`,`Approach: ${p.solution}`,`Project page: ${urlFor('/work/'+p.id)}`,'']),
 '## Blog articles',
 ...posts.flatMap(p=>[`### ${p.title}`,`${p.excerpt||''}`,`Article page: ${urlFor(p.route)}`,'']),
 `## Contact`,
 `Contact page: ${urlFor('/contact')}`,
 ''
].join('\n');
await writeFile(join(dist,'llms-full.txt'),llmsFull);
await writeFile(join(dist,'site.webmanifest'),JSON.stringify({name:'Himal Neupane — Creative Portfolio',short_name:'HimalNpne',description:pageData[0].description,start_url:base,scope:base,display:'standalone',background_color:'#f8f8f5',theme_color:'#343434',icons:[{src:base+'logo.svg',type:'image/svg+xml',sizes:'any'}]},null,2));
// GitHub Pages serves non-existent routes as 404; actual routes above return 200.
// Keep a search-safe 404 with noindex, and provide a user-visible return link.
const notFound=cleanRouteMetadata(baseHtml)
  .replace('</head>',`<title>Page not found | Himal Neupane</title><meta name="robots" content="noindex,follow">${style}</head>`)
  .replace('<div id="root"></div>',`<div id="root"><div class="seo-prerender"><main><h1>Page not found.</h1><p>The page you requested does not exist.</p><a href="${esc(localFor('/'))}">Return to homepage →</a></main></div></div>`);
await writeFile(join(dist,'404.html'),notFound);
console.log(`SEO: generated ${pageData.length} real HTML pages, sitemap.xml, robots.txt, llms.txt, llms-full.txt, llm.html, feed.xml and 404.html for ${siteUrl}`);
