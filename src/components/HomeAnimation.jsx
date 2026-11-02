import './HomeAnimation.css';
import React,{useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {motion,AnimatePresence,useMotionValue,useMotionValueEvent,useReducedMotion,useScroll,useSpring,useTransform} from 'motion/react';
import {ArrowUpRight} from 'lucide-react';

export const chapters=[
 {word:'Design',label:'01 / Discover',line:'Give ideas a shape.',detail:'Understand the problem, discover the opportunity and shape a clear visual direction.'},
 {word:'Develop',label:'02 / Make',line:'Make the details work.',detail:'Build responsive experiences that connect design with reliable engineering.'},
 {word:'Deploy',label:'03 / Launch',line:'Bring the idea to life.',detail:'Ship, learn, refine and keep the experience feeling effortless.'}
];
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const smootherstep=t=>t*t*t*(t*(t*6-15)+10);

export default function HomeAnimation({targetRef}){
 const reduced=useReducedMotion();
 const [phase,setPhase]=useState(0),[flight,setFlight]=useState(null);
 const fired=useRef(false),cubeRef=useRef(null);
 const mouseX=useMotionValue(0),mouseY=useMotionValue(0);
 const mx=useSpring(mouseX,{stiffness:65,damping:23}),my=useSpring(mouseY,{stiffness:65,damping:23});
 const {scrollYProgress}=useScroll({target:targetRef,offset:['start start','end end']});
 // A slower spring, spread over more scroll distance, removes the previous abrupt 'shoot'.
 const smooth=useSpring(scrollYProgress,{stiffness:48,damping:26,mass:1.5});
 const rotation=useTransform(smooth,[0,.33,.66,.86,1],[0,83,185,285,360]);
 const rise=useTransform(smooth,[0,.25,.58,.7,1],[0,-12,12,0,-12]);
 const fade=useTransform(smooth,[0,.66,.74,.86],[1,1,.5,0]);
 useMotionValueEvent(smooth,'change',value=>{
  const next=value<.34?0:value<.68?1:2;
  setPhase(old=>old===next?old:next);
  if(reduced||document.documentElement.classList.contains('motion-off')){setFlight(null);return;}
  if(value<.66){setFlight(null);fired.current=false;return;}
  const cube=cubeRef.current?.getBoundingClientRect();
  const brand=document.querySelector('.site-header .brand img')?.getBoundingClientRect();
  if(!cube||!brand)return;
  const t=clamp((value-.66)/.34,0,1);
  const ease=smootherstep(t);
  const startX=cube.left+cube.width/2,startY=cube.top+cube.height/2;
  const endX=brand.left+brand.width/2,endY=brand.top+brand.height/2;
  // An understated curved arc: ease-in and settle with no 720° spin.
  const x=lerp(startX,endX,ease);
  const y=lerp(startY,endY,ease)-Math.sin(Math.PI*ease)*36;
  const opacity=clamp((t-.015)/.13,0,1)*clamp((1-t)/.075,0,1);
  setFlight({x,y,scale:lerp(1,.18,ease),rotate:420*ease,opacity});
  if(t>=.975&&!fired.current){fired.current=true;window.dispatchEvent(new CustomEvent('himal:mark-arrived'));}
  if(t<.84)fired.current=false;
 });
 const pointerMove=e=>{
  if(reduced||e.pointerType==='touch')return;
  const rect=e.currentTarget.getBoundingClientRect();
  mouseX.set(((e.clientX-rect.left)/rect.width-.5)*17);
  mouseY.set((.5-(e.clientY-rect.top)/rect.height)*17);
 };
 const stage=chapters[phase];
 return <>
  <div className="orb-sticky v9-orb v10-orb v11-orb" onPointerMove={pointerMove} onPointerLeave={()=>{mouseX.set(0);mouseY.set(0)}}>
   <div className="v9-cube-stage" aria-label={`Interactive 3D process model: ${stage.word}`}>
    <div className="v9-cube-aura" aria-hidden="true"/>
    <motion.div className="v9-cube-position" ref={cubeRef} style={reduced?undefined:{y:rise,opacity:fade}}>
     <motion.div className={`v9-cube-orbit phase-${phase}`} style={reduced?undefined:{rotateY:rotation,rotateX:my,rotateZ:mx}} animate={reduced?undefined:{scale:phase===1?.96:phase===2?1.035:1}} transition={{type:'spring',stiffness:62,damping:25,mass:1.2}}>
      <div className="v9-cube-core">{['front','back','right','left','top','bottom'].map(side=><span className={`v9-cube-face face-${side}`} key={side}><span className="v9-face-outline"/></span>)}<span className="v9-cube-axis"/></div>
      <span className="v9-cube-ring ring-one"/><span className="v9-cube-ring ring-two"/>
     </motion.div>
    </motion.div>
    <div className="v9-cube-annotation" aria-hidden="true"><span>FORM / 01</span><i/><span>SHAPE / 03</span></div>
   </div>
   <div className="v9-stage-display" aria-live="polite" aria-atomic="true">
    <div className="v9-stage-top"><span>THE CREATIVE LOOP</span><span>{String(phase+1).padStart(2,'0')} — 03</span></div>
    <div className="v9-stage-mask"><AnimatePresence mode="wait" initial={false}><motion.div key={stage.word} className="v9-stage-word" initial={{y:'105%',opacity:.25,filter:'blur(8px)'}} animate={{y:0,opacity:1,filter:'blur(0px)'}} exit={{y:'-105%',opacity:.25,filter:'blur(8px)'}} transition={{duration:reduced?0:.63,ease:[.22,1,.36,1]}}>{stage.word}<span className="v9-stage-period">.</span></motion.div></AnimatePresence></div>
    <div className="v9-stage-track" aria-label="Jump to process stage">{chapters.map((item,i)=><button type="button" key={item.word} className={phase===i?'active':''} aria-label={`View ${item.word}`} aria-current={phase===i?'step':undefined} onClick={()=>{if(window.matchMedia('(max-width: 650px)').matches){setPhase(i);}else{document.getElementById('journey-'+i)?.scrollIntoView({behavior:reduced?'instant':'smooth',block:'center'});}}}><span/></button>)}</div>
    <span className="v10-stage-side-note">A shape in motion <ArrowUpRight size={13}/></span>
   </div>
  </div>
  {!reduced&&flight&&typeof document!=='undefined'&&createPortal(<div className="v10-flight-layer v11-flight-layer" aria-hidden="true"><div className="v10-flight-object v11-flight-object" style={{left:flight.x,top:flight.y,opacity:flight.opacity,transform:`translate(-50%,-50%) rotate(${flight.rotate}deg) scale(${flight.scale})`}}><div className="v10-flight-core"/><span className="v10-flight-ring ring-a"/><span className="v10-flight-ring ring-b"/></div></div>,document.body)}
 </>;
}
