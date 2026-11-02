import './DevelopmentMethodology.css';
import React,{useState,useRef} from 'react';
import {AnimatePresence,motion,useReducedMotion,useInView} from 'motion/react';
import {ArrowUpRight,ArrowRight,RotateCcw} from 'lucide-react';

const steps=[
 {id:'01',name:'Understand',verb:'Listen first.',detail:'Clarify the people, the problem, and what success looks like.',metric:'Discovery · Strategy',chip:'01 / Input'},
 {id:'02',name:'Design',verb:'Shape the experience.',detail:'Explore the direction, map the journey, and test the important interactions.',metric:'UI / UX · Prototypes',chip:'02 / Direction'},
 {id:'03',name:'Develop',verb:'Build with care.',detail:'Turn ideas into resilient interfaces, APIs, and thoughtful motion.',metric:'React · Backend · APIs',chip:'03 / Execution'},
 {id:'04',name:'Refine',verb:'Make every detail count.',detail:'Tune accessibility, performance, responsiveness and the little things.',metric:'Quality · Motion · Testing',chip:'04 / Iteration'},
 {id:'05',name:'Deploy',verb:'Go live. Keep learning.',detail:'Ship reliably, monitor what matters, and improve from feedback.',metric:'Cloudflare · GitHub · SEO',chip:'05 / Delivery'},
];

export default function DevelopmentMethodology(){
 const [active,setActive]=useState(1);
 const [cycle,setCycle]=useState(0);
 const wrap=useRef(null),seen=useInView(wrap,{once:true,amount:.25}),reduce=useReducedMotion();
 const next=()=>setActive(v=>(v+1)%steps.length);
 return <section className="v10-process section-space" aria-labelledby="workflow-title" ref={wrap}>
   <div className="frame">
    <div className="v10-section-top"><span className="micro-label">An evolving process</span><span className="micro-label">Explore the workflow / 01—05</span></div>
    <div className="v10-process-intro"><h2 id="workflow-title">Not a straight line.<br/><em>A better loop.</em></h2><p>A useful product moves between asking, making and learning. Tap a node to follow the thinking behind the work.</p></div>
    <div className="v10-process-board">
      <div className="v10-flow-topline"><span>IDEA <span className="v10-pulse-dot"/></span><span>THE WORKFLOW</span><span>LAUNCH <ArrowUpRight size={15}/></span></div>
      <div className="v10-flow-rail" role="group" aria-label="Select a workflow stage">
        <div className="v10-flow-connector" aria-hidden="true"><svg preserveAspectRatio="none" viewBox="0 0 1000 80"><path d="M60 40H935" stroke="currentColor" strokeWidth="1.4" fill="none"/><path d="m923 30 14 10-14 10" stroke="currentColor" strokeWidth="1.4" fill="none"/>{seen&&!reduce&&<motion.path d="M60 40H935" stroke="var(--red)" strokeWidth="2.2" fill="none" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:2.1,delay:.1}}/>}</svg></div>
        {steps.map((s,i)=><button key={s.id} className={`v10-flow-node ${i===active?'is-selected':''}`} onClick={()=>setActive(i)} type="button" aria-pressed={i===active} aria-label={`Show ${s.name} phase`}>
            <span className="v10-flow-glyph"><span className="v10-flow-glyph-inner">{i===active?<span className="v10-flow-live"/>:s.id}</span></span>
            <span className="v10-flow-name">{s.name}</span><span className="v10-flow-label">{s.chip}</span>
          </button>)}
      </div>
      <div className="v10-flow-loop"><svg viewBox="0 0 800 80" preserveAspectRatio="none" aria-hidden="true"><path d="M744 3V32Q744 57 716 57H80Q48 57 48 30V14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeDasharray="5 7"/><path d="m39 24 9-12 9 12" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg><span>ITERATE ↺</span></div>
      <div className="v10-flow-details" aria-live="polite"><AnimatePresence mode="wait" initial={false}><motion.div key={active} initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:reduce?0:.34}} className="v10-flow-copy"><span className="v10-flow-meta">{steps[active].metric}</span><h3>{steps[active].verb}</h3><p>{steps[active].detail}</p></motion.div></AnimatePresence><button type="button" className="v10-flow-next" onClick={next} aria-label="Next workflow stage"><ArrowRight size={21}/></button></div>
    </div>
    <div className="v10-process-bottom"><span>Every launch is a new starting point.</span><button type="button" onClick={()=>{setActive(0);setCycle(v=>v+1)}}><RotateCcw size={15}/> Start again</button></div>
   </div>
 </section>
}
