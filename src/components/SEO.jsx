import {useEffect,useRef} from 'react';
import {useLocation} from 'react-router-dom';
import {projects,profile} from '../SiteData.js';
import {getPost} from '../BlogData.js';

// Per-page metadata is embedded at build time in real route HTML documents.
// This updates the same metadata for in-app navigation without page reloads.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const configured = new URL(__SEO_SITE_URL__);
const origin = configured.origin + (configured.pathname === '/' ? base : configured.pathname.replace(/\/$/, ''));
const absolute = path => `${origin}${path === '/' ? '/' : path.replace(/\/$/, '') + '/'}`;
const routeData = {
  '/': ['Himal Neupane (HimalNpne) — Creative Developer & Portfolio', 'Official portfolio of Himal Neupane, also known as HimalNpne and Himal NPNE. React development, UI/UX design, full-stack projects and articles.'],
  '/work': ['Projects & Case Studies | Himal Neupane', 'Explore software projects, React interfaces, and full-stack case studies by Himal Neupane (himalnpne).'],
  '/about': ['About Himal Neupane | Developer in Nepal', 'Meet Himal Neupane (HimalNpne), a Nepal-based developer creating refined React interfaces and practical full-stack applications.'],
  '/blog': ['Blog & Articles | Himal Neupane', 'Thoughts, tutorials and articles on React, web design, development and thoughtful interaction from Himal Neupane.'],
  '/faq': ['Frequently Asked Questions | Himal Neupane', 'Answers about working with Himal Neupane, frontend development, website design, React and freelance collaboration.'],
  '/contact': ['Contact Himal Neupane | Web Development & Collaboration', 'Contact Himal Neupane (himalnpne) to discuss website development, React, UI/UX or a full-stack project.'],
  '/support': ['Support My Work | Himal Neupane', 'Support Himal Neupane with Payoneer or share free developer resources, guides and portfolio projects.'],
  '/privacy': ['Privacy Policy | Himal Neupane', 'Learn about website contact forms, local preferences, optional ads and hosting privacy practices.']
};
function upsertMeta(key,value,attribute='name') {
  let tag=document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!tag) {tag=document.createElement('meta');tag.setAttribute(attribute,key);document.head.appendChild(tag);}
  tag.setAttribute('content',value);
}
function refreshSchema(route,title,description,project,post){
  document.querySelectorAll('script[type="application/ld+json"][data-site-seo]').forEach(el=>el.remove());
  const personId=absolute('/about')+'#himal-neupane';
  const pageType=post?'BlogPosting':project?'CreativeWork':route==='/about'?'ProfilePage':'WebPage';
  const documentSchema={
    '@context':'https://schema.org','@type':pageType,'@id':absolute(route)+'#webpage',
    url:absolute(route),name:title,headline:post?.title||project?.name||title,
    description,inLanguage:'en',author:{'@id':personId},
    ...(post?{datePublished:post.date,mainEntityOfPage:absolute(route)}:{}),
    ...(project?{keywords:project.stack.join(', ')}:{}),
    ...(route==='/about'?{mainEntity:{'@id':personId}}:{})
  };
  const person={'@context':'https://schema.org','@type':'Person','@id':personId,name:'Himal Neupane',alternateName:['HimalNpne','Himal NPNE','Neupane Himal'],url:absolute('/'),sameAs:[profile.github,profile.instagram,profile.x,profile.linkedin]};
  const segments=route.split('/').filter(Boolean);
  let partial='';
  const crumbs=[{name:'Home',item:absolute('/')}];
  for(const part of segments){partial+='/'+part;crumbs.push({name:part,item:absolute(partial)});}
  const breadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:crumbs.map((c,index)=>({'@type':'ListItem',position:index+1,name:c.name,item:c.item}))};
  for(const schema of [person,documentSchema,breadcrumb]){
    const el=document.createElement('script');el.type='application/ld+json';el.dataset.siteSeo='';el.textContent=JSON.stringify(schema).replaceAll('<','\\u003c');document.head.appendChild(el);
  }
}
export function SEO(){
 const {pathname}=useLocation();
 const firstRoute=useRef(null);
 useEffect(()=>{
   const route=pathname.replace(/\/$/,'')||'/';
   const project=route.startsWith('/work/')?projects.find(p=>p.id===route.split('/')[2]):null;
   const post=route.startsWith('/blog/')?getPost(route.split('/')[2]):null;
   const info=routeData[route]||(project?[`${project.name} — Project by Himal Neupane`,project.description]:null)||(post?[`${post.title} | Himal Neupane`,post.excerpt]:null);
   const known=!!info;
   const [title,description]=info||['Page not found | Himal Neupane','This page does not exist.'];
   const url=absolute(route);
   document.title=title;
   upsertMeta('description',description);
   upsertMeta('robots',known?'index,follow,max-image-preview:large':'noindex,follow');
   upsertMeta('og:type',post?'article':'website','property');
   upsertMeta('og:title',title,'property');upsertMeta('og:description',description,'property');
   upsertMeta('og:url',url,'property');upsertMeta('twitter:title',title);upsertMeta('twitter:description',description);
   const image=post?.cover?new URL(post.cover,configured.origin+base+'/').href:configured.origin+base+'/social-preview.jpg';
   upsertMeta('og:image',image,'property');upsertMeta('twitter:image',image);
   const previousDate=document.head.querySelector('meta[property="article:published_time"]');
   if(post)upsertMeta('article:published_time',post.date,'property');else previousDate?.remove();
   let canonical=document.head.querySelector('link[rel="canonical"]');
   if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.appendChild(canonical);}
   canonical.href=url;
   if(firstRoute.current===null)firstRoute.current=route;
   else if(known)refreshSchema(route,title,description,project,post);
   else document.querySelectorAll('script[type="application/ld+json"][data-site-seo]').forEach(el=>el.remove());
 },[pathname]);
 return null;
}
