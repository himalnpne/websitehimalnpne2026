import {useEffect, useRef, useState} from 'react';
import './useTicker.css';

// A compositor-driven ticker: the repeated track moves; scrollLeft is never used.
// Tickers start on every mount, independently of decorative site motion settings.
export default function useTicker({speed=60,count=1}={}) {
 const viewportRef=useRef(null),groupRef=useRef(null),animationRef=useRef(null);
 const drag=useRef(null),suppressClick=useRef(false),resumeTimer=useRef(null);
 const [paused,setPaused]=useState(false),[index,setIndex]=useState(0);
 const pausedRef=useRef(paused);
 pausedRef.current=paused;
 useEffect(()=>{
  const viewport=viewportRef.current,group=groupRef.current;
  const track=viewport?.querySelector('[data-carousel-track]');
  if(!viewport||!group||!track)return;
  let duration=0;
  const measure=()=>{
   const width=group.getBoundingClientRect().width;
   if(!width)return;
   const old=animationRef.current;
   const progress=old&&duration ? Number(old.currentTime||0)%duration/duration : 0;
   const nextDuration=width/speed*1000;
   if(old&&Math.abs(nextDuration-duration)<1)return;
   old?.cancel();
   duration=nextDuration;
   const animation=track.animate([
    {transform:'translate3d(0,0,0)'},
    {transform:`translate3d(${-width}px,0,0)`}
   ],{duration,iterations:Infinity,easing:'linear'});
   animation.currentTime=progress*duration;
   animationRef.current=animation;
   if(pausedRef.current||drag.current)animation.pause();
  };
  measure();
  const observer=new ResizeObserver(measure);
  observer.observe(group);
  const counter=window.setInterval(()=>{
   const animation=animationRef.current;
   if(animation&&duration)setIndex(Math.floor((Number(animation.currentTime||0)%duration)/duration*Math.max(count,1)));
  },250);
  const release=()=>{
   if(!drag.current)return;
   drag.current=null;
   clearTimeout(resumeTimer.current);
   resumeTimer.current=window.setTimeout(()=>{
    if(!pausedRef.current)animationRef.current?.play();
   },400);
  };
  window.addEventListener('pointerup',release);
  window.addEventListener('pointercancel',release);
  window.addEventListener('blur',release);
  return()=>{
   observer.disconnect();clearInterval(counter);clearTimeout(resumeTimer.current);
   animationRef.current?.cancel();animationRef.current=null;drag.current=null;
   window.removeEventListener('pointerup',release);
   window.removeEventListener('pointercancel',release);
   window.removeEventListener('blur',release);
  };
 },[speed,count]);
 useEffect(()=>{
  const animation=animationRef.current;
  if(paused)animation?.pause();else if(!drag.current)animation?.play();
 },[paused]);
 const seek=position=>{
  const animation=animationRef.current;
  const duration=Number(animation?.effect?.getTiming().duration);
  if(animation&&duration>0)animation.currentTime=((position%duration)+duration)%duration;
 };
 const nudge=direction=>{
  const animation=animationRef.current;
  const duration=Number(animation?.effect?.getTiming().duration);
  if(animation&&duration>0)seek(Number(animation.currentTime||0)+direction*duration/Math.max(count,1));
 };
 const bindings={
  'data-carousel':true,tabIndex:0,role:'region',
  onPointerDown:event=>{
   if(event.button!==0)return;
   clearTimeout(resumeTimer.current);suppressClick.current=false;
   drag.current={id:event.pointerId,start:event.clientX,time:Number(animationRef.current?.currentTime||0)};
   animationRef.current?.pause();
  },
  onPointerMove:event=>{
   const current=drag.current;
   if(!current||current.id!==event.pointerId||Math.abs(event.clientX-current.start)<6)return;
   suppressClick.current=true;
   event.currentTarget.setPointerCapture(event.pointerId);
   seek(current.time+(current.start-event.clientX)/speed*1000);
  },
  onDragStart:event=>event.preventDefault(),
  onClickCapture:event=>{
   if(suppressClick.current){event.preventDefault();event.stopPropagation();suppressClick.current=false;}
  },
  onKeyDown:event=>{
   if(event.key==='ArrowRight'||event.key==='ArrowLeft'){
    event.preventDefault();nudge(event.key==='ArrowRight'?1:-1);
   }
  }
 };
 return {viewportRef,groupRef,bindings,paused,setPaused,nudge,index};
}
