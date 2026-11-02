import './Home.css';
import React,{useRef} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight,ArrowDown} from 'lucide-react';
import {Reveal} from '../components/Animations.jsx';
import {SectionHeading} from '../components/SectionHeading.jsx';
import HomeAnimation,{chapters} from '../components/HomeAnimation.jsx';
import Testimonials from '../components/Testimonials.jsx';
import DevelopmentMethodology from '../components/DevelopmentMethodology.jsx';
import MyApproach from '../components/MyApproach.jsx';
import Skills from '../components/Skills.jsx';
import MyWorkPreview from '../components/MyWorkPreview.jsx';
import FAQPreview from '../components/FAQPreview.jsx';
import BlogPreview from '../components/BlogPreview.jsx';

export default function Home(){
 const journey=useRef(null);
 return <>
  <section className="experience-field v10-experience" ref={journey} aria-label="Design, develop, deploy interactive experience">
   <div className="frame experience-grid v12-experience-grid">
    <div className="experience-intro v12-experience-intro"><Reveal><span className="micro-label">Himal Neupane / Independent creative developer</span><h1>Ideas deserve<br/><em>to become real.</em></h1></Reveal><Reveal delay={.11}><p>Design-led development for useful, expressive, human digital experiences. From the first question to the final interaction.</p><div className="hero-actions"><Link className="button-primary v10-magnetic-link" to="/work">Explore my work <ArrowUpRight size={18}/></Link><Link className="button-quiet" to="/contact">Let's collaborate <ArrowUpRight size={17}/></Link></div></Reveal><a href="#journey-0" className="experience-scroll-cue">The process, in motion <span className="v10-scroll-circle"><ArrowDown size={18}/></span></a></div>
    <HomeAnimation targetRef={journey}/>
    <div className="experience-story v12-experience-steps">
     {chapters.map((step,i)=><div id={'journey-'+i} className="experience-step" key={step.word}><span className="experience-step-index">{step.label}</span><Reveal><h2>{step.line}</h2><p>{step.detail}</p></Reveal><span className="experience-step-tag">{step.word} / 0{i+1}</span></div>)}
    </div>
   </div>
  </section>
  <DevelopmentMethodology/>
  <MyApproach/>
  <Skills/>
  <MyWorkPreview/>
  <Testimonials/>
  <FAQPreview/>
  <section className="journal-teaser v13-journal-section section-space" aria-labelledby="home-journal-title">
   <div className="frame"><SectionHeading label="From the blog" right="Essays / Guides / Observations"/>
    <div className="section-heading-row"><Reveal as="h2" className="section-headline" id="home-journal-title">Curiosity,<br/><em>in writing.</em></Reveal><Reveal className="section-sidecopy"><p>What I've learned, what I'm exploring, and the occasional detour. Notes on code, privacy, travel and the details in between.</p></Reveal></div>
   </div>
   <BlogPreview/>
  </section>
 </>;
}
