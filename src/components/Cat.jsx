import './Cat.css';
import React,{useEffect,useMemo,useState} from 'react';
import {Mascot} from 'page-mascot';
import {Link,useLocation} from 'react-router-dom';
import {AnimatePresence,motion,useReducedMotion} from 'motion/react';
import {ArrowUpRight,Heart,MessageCircle,Minus,X} from 'lucide-react';

const greetings=[
 'Purr… that was a nice hello.',
 'You found my favorite little corner.',
 'I follow the pointer. The work follows the idea.',
 'Another pat? I could get used to this.',
 'There is more to explore below.'
];
const byPath=[
 {matches:/^\/work/,note:'There are real projects behind these previews.',action:'Explore the blog',to:'/blog'},
 {matches:/^\/blog/,note:'Find a new rabbit hole on the blog.',action:'See the projects',to:'/work'},
 {matches:/^\/faq/,note:'Still have a question? You can say hello.',action:'Get in touch',to:'/contact'},
 {matches:/^\/contact/,note:'A thoughtful message is always welcome.',action:'See the work',to:'/work'},
 {matches:/^\/$/,note:'Curious about the things we can build?',action:'Explore projects',to:'/work'}
];

/** Keep the actual page-mascot API intact: it tracks the cursor and handles its own click reaction.
 * The dock adds ambient feedback, navigation and optional conversation without faking sprite animations.
 */
export default function Cat(){
 const location=useLocation();
 const reduced=useReducedMotion();
 const [hidden,setHidden]=useState(()=>{try{return sessionStorage.getItem('himal-cat-hidden')==='1'}catch{return false}});
 const [expanded,setExpanded]=useState(false),[pets,setPets]=useState(0),[hover,setHover]=useState(false),[hello,setHello]=useState(false);
 const context=useMemo(()=>byPath.find(x=>x.matches.test(location.pathname))||byPath[4],[location.pathname]);
 useEffect(()=>{setExpanded(false);setHello(false)},[location.pathname]);
 useEffect(()=>{try{sessionStorage.setItem('himal-cat-hidden',hidden?'1':'0')}catch{}},[hidden]);
 useEffect(()=>{
  if(hidden||reduced)return;
  let timer;
  try{if(sessionStorage.getItem('himal-cat-greeted')==='1')return;}catch{}
  timer=window.setTimeout(()=>{
   if(document.hidden)return;
   setHello(true);
   try{sessionStorage.setItem('himal-cat-greeted','1')}catch{}
  },10500);
  return()=>window.clearTimeout(timer);
 },[hidden,reduced]);
 useEffect(()=>{
  if(!hello||expanded)return;
  const timer=window.setTimeout(()=>setHello(false),5300);
  return()=>window.clearTimeout(timer);
 },[hello,expanded]);
 const onPet=()=>{setPets(p=>p+1);setExpanded(true);setHello(false)};
 const close=()=>{setExpanded(false);setHello(false)};
 if(hidden)return <button type="button" className="v11-cat-restore" onClick={()=>setHidden(false)} aria-label="Show Miso the cat mascot" title="Bring Miso back"><span aria-hidden="true">◕ᴥ◕</span></button>;
 return <aside className="v10-mascot-dock v11-mascot-dock" aria-label="Miso the interactive cat">
  <AnimatePresence mode="wait">
   {(expanded||hello)&&<motion.div key={expanded?'conversation':'greeting'} className="v10-mascot-note v11-mascot-note" initial={{opacity:0,y:13,scale:.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:9,scale:.98}} transition={{duration:reduced?0:.28}}>
    <div className="v11-cat-note-top"><span><span className="v11-cat-status"/> Miso <span className="v11-cat-note-detail">· your tiny guide</span></span><button type="button" onClick={close} aria-label="Close Miso message"><X size={15}/></button></div>
    <p aria-live="polite">{expanded?(pets?greetings[(pets-1)%greetings.length]:context.note):'Psst. Have a look around. I’m keeping an eye on things.'}</p>
    {expanded&&<div className="v11-cat-links"><Link to={context.to} onClick={close}>{context.action} <ArrowUpRight size={13}/></Link><Link to="/contact" onClick={close}>Say hello <ArrowUpRight size={13}/></Link></div>}
    {pets>0&&expanded&&<small>{pets} {pets===1?'pat':'pats'} · thanks for visiting <Heart size={11} fill="currentColor"/></small>}
   </motion.div>}
  </AnimatePresence>
  <div className={`v10-mascot-actions v11-mascot-actions ${hover?'is-hovered':''}`}>
   <button type="button" className="v11-cat-talk" onClick={()=>{setExpanded(v=>!v);setHello(false)}} aria-expanded={expanded} aria-label={expanded?'Close cat conversation':'Chat with Miso'} title="Chat with Miso"><MessageCircle size={17}/></button>
   <motion.div className="v10-mascot-character v11-mascot-character" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onClick={onPet} animate={reduced?undefined:{y:hover?-5:0,rotate:hover?-3:0}} transition={{type:'spring',stiffness:190,damping:19}} title="Pet Miso — her eyes follow your pointer">
    <Mascot directions={`${import.meta.env.BASE_URL}mascots/cat-directions.webp`} reactions={`${import.meta.env.BASE_URL}mascots/cat-reactions.webp`} size={112} label="Pet Miso the cat"/>
    <AnimatePresence>{pets>0&&<motion.span key={pets} className="v11-cat-heart" initial={{opacity:0,y:10,scale:.6}} animate={{opacity:[0,1,0],y:[10,-20,-45],scale:[.6,1.1,.9]}} exit={{opacity:0,y:-45}} transition={{duration:reduced?0:1.15}} aria-hidden="true"><Heart size={19} fill="currentColor"/></motion.span>}</AnimatePresence>
   </motion.div>
   <button type="button" className="v11-cat-minimize" onClick={()=>setHidden(true)} aria-label="Hide cat mascot for this visit" title="Hide Miso"><Minus size={16}/></button>
  </div>
 </aside>;
}
