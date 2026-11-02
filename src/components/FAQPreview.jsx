import './FAQPreview.css';
import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import {AnimatePresence,motion,useReducedMotion} from 'motion/react';
import {Plus,ArrowUpRight} from 'lucide-react';
const faqs=[
 ['Can you design and build a complete website?','Yes. I can help from information architecture and interface design to React development, deployment and performance optimization.'],
 ['Do you also work on backends and APIs?','Yes. Depending on the project I use Python, Django, Flask, PostgreSQL and serverless platforms including Cloudflare.'],
 ['Can you redesign an existing product?','Absolutely. I can audit the existing experience, identify friction, propose a visual direction and implement the changes responsively.'],
 ['How do we begin collaborating?','Send a short brief with the problem, target audience, expected scope and timeline. We can turn it into a practical plan.'],
];
export default function FAQPreview(){
 const [selected,setSelected]=useState(0),reduce=useReducedMotion();
 return <section className="v10-home-faq section-space" aria-labelledby="home-faq-heading"><div className="frame v10-faq-grid"><div className="v10-faq-intro"><span className="micro-label">Before we begin</span><h2 id="home-faq-heading">Good questions.<br/><em>Clear answers.</em></h2><p>The short version of how I work and what we can make together.</p><Link to="/faq">All frequently asked questions <ArrowUpRight size={17}/></Link></div><div className="v10-faq-items">{faqs.map(([q,a],i)=><article key={q} className={`v10-faq-item ${selected===i?'open':''}`}><h3><button type="button" aria-expanded={selected===i} aria-controls={`v10-faq-answer-${i}`} onClick={()=>setSelected(v=>v===i?-1:i)}><span>{String(i+1).padStart(2,'0')}</span>{q}<Plus size={21} className="v10-faq-plus"/></button></h3><AnimatePresence initial={false}>{selected===i&&<motion.div id={`v10-faq-answer-${i}`} initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:reduce?0:.26}} className="v10-faq-answer"><p>{a}</p></motion.div>}</AnimatePresence></article>)}</div></div></section>
}
