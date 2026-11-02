import './Testimonials.css';
import React from 'react';
import {Pause,Play} from 'lucide-react';
import useTicker from '../hooks/useTicker.js';
import {Reveal} from './Animations.jsx';
import {SectionHeading} from './SectionHeading.jsx';

// Illustrative copy only; replace with permissioned reviews, names and roles.
export const testimonials=[
 {quote:'The experience felt thoughtful from the first interaction to the final detail.',type:'UI/UX Designer · Hemant Dasl'},
 {quote:'Clear communication, a clean result and an interface that makes sense.',type:'Network Engineer · Ayush Silwal'},
 {quote:'A practical approach to turning a rough idea into something people can use.',type:'Business Owner · Niran Basnetl'}
];
export default function Testimonials(){
 const {viewportRef,groupRef,bindings,paused,setPaused}=useTicker({speed:35,count:testimonials.length});
 const still=paused;
 return <section className="testimonials v11-testimonials section-space" aria-labelledby="testimonials-title">
  <div className="frame"><SectionHeading label="In good company" right="The people behind the work"/><div className="testimonial-heading"><Reveal as="h2" id="testimonials-title">Good people.<br/><em>Better outcomes.</em></Reveal><div className="v11-quote-intro"><p>A place for feedback from collaborators. Example copy is clearly marked until real reviews are added.</p><button className="v11-quote-play" type="button" onClick={()=>setPaused(!paused)} aria-label={paused?'Resume testimonial carousel':'Pause testimonial carousel'} aria-pressed={paused}>{still?<Play size={16}/>:<Pause size={16}/>} <span>{still?'Play carousel':'Pause carousel'}</span></button></div></div></div>
  <div className={`testimonial-viewport v11-quote-viewport v12-quote-viewport ${still?'is-paused':''}`} ref={viewportRef} {...bindings} aria-label="Testimonial examples. Moves automatically; use Pause carousel to stop.">
   <div className="testimonial-track v11-quote-track v12-quote-track" data-carousel-track>{[0,1,2,3].map(copy=><div className="testimonial-group" data-carousel-group ref={copy===0?groupRef:undefined} key={copy} aria-hidden={copy>0?true:undefined}>{testimonials.map((item,i)=><article className="testimonial-card v11-quote-card" key={i}><span className="testimonial-number">{String(i+1).padStart(2,'0')} / 03</span><blockquote>“{item.quote}”</blockquote><p>{item.type}</p></article>)}</div>)}</div>
  </div>
 </section>;
}
