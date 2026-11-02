import './MyApproach.css';
import React,{useRef} from 'react';
import {motion,useReducedMotion,useScroll,useTransform} from 'motion/react';

// A single scroll-driven editorial reveal: the content remains actual HTML text
// while the diagonal band and typography reveal through the viewport.
export default function MyApproach(){
 const ref=useRef(null);
 const reduced=useReducedMotion();
 const {scrollYProgress}=useScroll({target:ref,offset:['start 94%','end 18%']});
 const clip=useTransform(scrollYProgress,[0,.2,.65,1],['inset(0 100% 0 0)','inset(0 20% 0 0)','inset(0 0% 0 0)','inset(0 0% 0 0)']);
 const move=useTransform(scrollYProgress,[0,1],['-24%','18%']);
 const fade=useTransform(scrollYProgress,[0,.2,.8,1],[.2,1,1,.7]);
 return <section className="v12-scroll-reel" ref={ref} aria-label="A note on how I build">
   <div className="frame v12-reel-inner">
    <span className="v12-reel-index">THE WORK BEHIND THE WORK · 01 / 01</span>
    <motion.div className="v12-reel-accent" style={reduced?undefined:{x:move,opacity:fade}} aria-hidden="true"/>
    <motion.h2 style={reduced?undefined:{clipPath:clip}}>Every detail<br/><em>has a purpose.</em></motion.h2>
    <p>Not just how it looks. How it feels, works and makes the next step easier.</p>
   </div>
 </section>;
}
