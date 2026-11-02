import './FAQ.css';
import React,{useMemo,useState} from 'react';
import {Link} from 'react-router-dom';
import {motion,AnimatePresence} from 'motion/react';
import {PageIntro} from '../components/PageIntro.jsx';
const questions=[
 ['Collaboration','Are you available for freelance projects?','I am open to interesting collaborations and freelance conversations. Send a note about the goal, timeline and scope through the contact page.'],
 ['Collaboration','What kinds of projects do you work on?','Frontend development, interactive React interfaces, UI/UX implementation, small full-stack products and prototypes.'],
 ['Collaboration','How does a new project usually begin?','First we clarify the problem, audience and desired outcome. Then we agree on scope, main interactions, milestones and implementation priorities.'],
 ['Process','Do you handle both design and development?','Yes. I like working from structure and visual hierarchy through to implementation. I can also build from an existing Figma design.'],
 ['Process','Can you improve an existing website?','Yes. Responsive redesigns, accessibility improvements, frontend performance, content structure and component systems can all be part of an overhaul.'],
 ['Process','Do you build backend systems?','Depending on the project, I use Python, Flask, Django, PostgreSQL and serverless APIs.'],
 ['Technology','Why React and Motion?','React keeps interfaces modular, and Motion handles small, expressive transitions. I try to keep animation restrained and respect reduced-motion preferences.'],
 ['Technology','Does the website work on mobile?','Yes. It adapts to smaller screens and touch devices. Animations are simplified and hover-only interactions are not required on mobile.'],
 ['Technology','Can I host React on GitHub Pages?','Yes. This site generates real HTML entry pages for its routes during the build, including GitHub Pages and Cloudflare Pages deployments.'],
 ['Technology','How do you publish blog posts?','Create a JSX component inside src/posts, or a structured JS article inside src/legacyPosts. New posts are discovered when the static site is rebuilt—no backend or CMS needed.'],
 ['General','Where are you based?','I am based in Nepal, and I work with people and web technologies across time zones.'],
 ['General','Can we talk about a project idea?','Absolutely. Tell me about the idea and what you want it to do. We can start from there.'],
];
const groups=['All',...new Set(questions.map(([c])=>c))];
export default function FAQ(){
 const [group,setGroup]=useState('All'),[search,setSearch]=useState(''),[open,setOpen]=useState(null);
 const filtered=useMemo(()=>questions.map(([category,q,a],id)=>({category,q,a,id})).filter(item=>(group==='All'||item.category===group)&&`${item.q} ${item.a}`.toLowerCase().includes(search.toLowerCase().trim())),[group,search]);
 return <><PageIntro eyebrow="FAQ / Good to know" title={<>A few common<br/><em>questions.</em></>} description="A little clarity about how I work, what I build and what happens next."/><section className="faq-section frame"><aside className="faq-side"><p className="eyebrow">Still wondering?</p><h2>Let's talk<br/>about it.</h2><p>If your question isn't here, I'd be happy to hear what you have in mind.</p><Link to="/contact">Get in touch ↗</Link></aside><div className="faq-main"><label className="faq-search"><input type="search" placeholder="Search questions…" value={search} onChange={e=>{setSearch(e.target.value);setOpen(null)}} aria-label="Search questions"/><span>⌕</span></label><div className="faq-cats" role="group" aria-label="FAQ categories">{groups.map(c=><button key={c} className={group===c?'active':''} aria-pressed={group===c} onClick={()=>{setGroup(c);setOpen(null)}}>{c}</button>)}</div><div className="faq-list">{filtered.map(item=><div className={`faq-item ${open===item.id?'open':''}`} key={item.id}><h3><button aria-controls={`answer-${item.id}`} aria-expanded={open===item.id} onClick={()=>setOpen(open===item.id?null:item.id)}><span>{item.q}</span><span className="faq-indicator">{open===item.id?'−':'+'}</span></button></h3><AnimatePresence initial={false}>{open===item.id&&<motion.div id={`answer-${item.id}`} className="faq-answer" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.22}}><p>{item.a}</p></motion.div>}</AnimatePresence></div>)}</div>{!filtered.length&&<div className="empty-results"><h3>No matching questions.</h3><button onClick={()=>{setSearch('');setGroup('All')}}>Reset search</button></div>}</div></section></>;
}
