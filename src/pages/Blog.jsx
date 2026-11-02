import './Blog.css';
import React,{useEffect,useMemo,useRef,useState} from 'react';
import {Link,useParams} from 'react-router-dom';
import {motion,AnimatePresence,useScroll,useSpring} from 'motion/react';
import {posts,categories,getPost} from '../BlogData.js';
import Ads from '../components/Ads.jsx';

const prettyDate=date=>new Date(`${date}T00:00:00`).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
function ArticleTile({post}){return <Link className="v9-article-tile" to={`/blog/${post.slug}`}><div className="v9-tile-image">{post.cover?<img src={post.cover} alt="" loading="lazy"/>:<span className="v9-tile-fallback">{post.category}<b>↗</b></span>}</div><div className="v9-tile-meta"><span>{post.category}</span><time dateTime={post.date}>{prettyDate(post.date)}</time></div><h3>{post.title}</h3><p>{post.excerpt}</p><div className="v9-tile-foot"><span>{post.readTime}</span><span className="v9-read-arrow">Read article ↗</span></div></Link>}
export function Blog(){
 const [category,setCategory]=useState('All'),[search,setSearch]=useState('');
 const shown=useMemo(()=>posts.filter(p=>(category==='All'||p.category===category)&&`${p.title} ${p.excerpt} ${p.tags.join(' ')}`.toLowerCase().includes(search.trim().toLowerCase())),[category,search]);
 const listing=shown;
 return <div className="v9-blog"><div className="frame v9-journal-heading"><div className="v9-journal-eyebrow"><span>Himal Neupane</span><span>Independent blog</span></div><h1>Notes on <em>the things<br/>that matter.</em></h1><p>Technology, privacy, travel and ideas from beyond the screen. Written to be read, not skimmed.</p></div>
 <div className="frame"><Ads type="leaderboard" className="v9-banner-ad"/></div>
 <section className="frame v9-blog-directory" aria-label="Articles">
 <div className="v9-blog-bar"><div><span className="v9-mini-label">Explore the archive</span><h2>All articles <small>({shown.length})</small></h2></div><label className="v9-blog-search"><span aria-hidden="true">⌕</span><input aria-label="Search articles" placeholder="Search topics or titles" value={search} onChange={e=>setSearch(e.target.value)}/></label></div>
 <div className="v9-blog-categories" role="group" aria-label="Filter articles">{categories.map(c=><button key={c} type="button" aria-pressed={category===c} className={category===c?'active':''} onClick={()=>setCategory(c)}>{c}</button>)}</div>
 <div className="v9-article-grid">{listing.map((post,i)=><React.Fragment key={post.slug}><motion.div layout initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.35}}><ArticleTile post={post}/></motion.div>{i===3&&<div className="v9-infeed-row"><Ads type="infeed"/></div>}</React.Fragment>)}</div>
 {listing.length===0&&<div className="v9-no-articles"><h3>No articles match.</h3><p>Try a different phrase or topic.</p><button onClick={()=>{setSearch('');setCategory('All')}}>Show all articles</button></div>}
 </section></div>;
}
export function BlogPost(){
 const {slug}=useParams(),post=getPost(slug),ref=useRef(null),[copied,setCopied]=useState(false);
 const {scrollYProgress}=useScroll({target:ref,offset:['start start','end end']}),progress=useSpring(scrollYProgress,{stiffness:150,damping:30});
 useEffect(()=>setCopied(false),[post,slug]);
 if(!post)return <section className="frame section-space"><h1>Article not found.</h1><Link to="/blog">Back to blog</Link></section>;
 const next=posts[(posts.indexOf(post)+1)%posts.length],Article=post.Component;
 async function share(){try{await navigator.clipboard.writeText(window.location.href);setCopied(true);setTimeout(()=>setCopied(false),2000)}catch{setCopied(false)}}
 return <div className="post-layout v9-post" ref={ref}><motion.div className="reading-progress" style={{scaleX:progress}} aria-hidden="true"/>
 <header className="frame v9-post-header"><Link to="/blog" className="back-link">← Blog</Link><div className="v9-post-category">{post.category}<span/> {prettyDate(post.date)} <span/> {post.readTime}</div><h1>{post.title}</h1><p>{post.excerpt}</p><div className="post-head-foot"><div className="post-author"><span className="author-avatar">HN</span><span>By <b>Himal Neupane</b></span></div><button type="button" onClick={share} className="share-button">{copied?'Copied to clipboard':'Copy link'} <span>{copied?'✓':'↗'}</span></button></div></header>
 {post.cover&&<figure className="v9-post-cover"><img src={post.cover} alt={`Cover illustration for ${post.title}`}/></figure>}
 <div className="frame"><Ads type="leaderboard"/></div>
 <div className="frame post-reading-grid v9-reading-layout"><aside className="post-toc v9-reading-toc"><div>In this article</div>{post.toc?.map(([id,label])=><button type="button" key={id} onClick={()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'})}>{label}</button>)}<Link to="/blog">← All articles</Link></aside>
 <div className="v9-article-content"><article className="post-body"><Article/><div className="post-endmark">Thanks for reading.</div><div className="post-tags">{post.tags.map(tag=><span key={tag}>{tag}</span>)}</div></article><Ads type="infeed" className="v9-end-ad"/></div>
 <aside className="v9-ad-sidebar" aria-label="Sponsored placement"><Ads type="rectangle"/><div className="v9-sidebar-note"><span>Himal / Blog</span><p>Independent writing about the tools, systems and ideas shaping our world.</p><Link to="/blog">Browse more essays ↗</Link></div></aside></div>
 <Link to={`/blog/${next.slug}`} className="next-post"><div className="frame"><span>Continue reading</span><h2>{next.title} <span>↗</span></h2></div></Link></div>;
}
