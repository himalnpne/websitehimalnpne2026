import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

export const easing = [0.22, 1, 0.36, 1];
export function Reveal({ children, delay=0, className='', as='div', ...props }) {
  const Element = motion[as] || motion.div;
  return <Element className={className} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount: .13 }} transition={{ duration:.55, delay, ease:easing }} {...props}>{children}</Element>;
}
export function TextRise({ text, className='' }) {
  const words = text.split(' ');
  return <span className={className} aria-label={text}>{words.map((word,i)=><span key={i} className="word-window" aria-hidden="true"><motion.span initial={{y:'115%'}} whileInView={{y:0}} viewport={{once:true}} transition={{duration:.9, delay:i*.055, ease:easing}}>{word}{i<words.length-1?'\u00a0':''}</motion.span></span>)}</span>;
}
export function Magnetic({children, className='', ...rest}) {
  const ref=useRef(null);const x=useMotionValue(0); const y=useMotionValue(0);
  const sx=useSpring(x,{stiffness:220,damping:20});const sy=useSpring(y,{stiffness:220,damping:20});
  const reduced=useReducedMotion();
  return <motion.span ref={ref} className={`magnetic ${className}`} style={reduced?undefined:{x:sx,y:sy}} onPointerMove={event=>{if(event.pointerType!=='mouse'||reduced)return;const b=ref.current.getBoundingClientRect();x.set((event.clientX-b.left-b.width/2)*.13);y.set((event.clientY-b.top-b.height/2)*.13)}} onPointerLeave={()=>{x.set(0);y.set(0)}} {...rest}>{children}</motion.span>;
}
export function Tilt({children,className='',max=8,style,...props}) {
  const ref=useRef(null);const rx=useMotionValue(0),ry=useMotionValue(0);
  const sx=useSpring(rx,{stiffness:180,damping:24});const sy=useSpring(ry,{stiffness:180,damping:24});
  const reduced=useReducedMotion();
  return <motion.div ref={ref} className={className} style={{...style,transformPerspective:1100,rotateX:sx,rotateY:sy}} onPointerMove={e=>{if(e.pointerType!=='mouse'||reduced)return;let b=ref.current.getBoundingClientRect();rx.set((.5-(e.clientY-b.y)/b.height)*max);ry.set(((e.clientX-b.x)/b.width-.5)*max)}} onPointerLeave={()=>{rx.set(0);ry.set(0)}} {...props}>{children}</motion.div>;
}
export function ActionLink({to,children,alt=false}){
  return <span className={`action-link ${alt?'inverse':''}`}>{children}<ArrowUpRight size={17} strokeWidth={1.8}/></span>;
}
export function CursorFollower(){
  const x=useMotionValue(-200),y=useMotionValue(-200),scale=useMotionValue(.6);
  const sx=useSpring(x,{stiffness:420,damping:34,mass:.5}),sy=useSpring(y,{stiffness:420,damping:34,mass:.5}),ss=useSpring(scale,{stiffness:290,damping:24});
  const reduced=useReducedMotion();
  useEffect(()=>{
    if(reduced || !matchMedia('(hover:hover) and (pointer:fine)').matches)return;
    const move=e=>{x.set(e.clientX);y.set(e.clientY);scale.set(e.target.closest('a,button,[data-cursor]')?2.5:1)};
    const hide=()=>scale.set(0);const show=()=>scale.set(1);
    window.addEventListener('pointermove',move,{passive:true});document.addEventListener('mouseleave',hide);document.addEventListener('mouseenter',show);
    return()=>{window.removeEventListener('pointermove',move);document.removeEventListener('mouseleave',hide);document.removeEventListener('mouseenter',show)};
  },[reduced,x,y,scale]);
  if(reduced)return null;
  return <motion.div className="cursor-follow" aria-hidden="true" style={{x:sx,y:sy,scale:ss}}/>;
}
