import './MyWorkPreview.css';
import React from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight,ArrowLeft,ArrowUpRight,Pause,Play} from 'lucide-react';
import useTicker from '../hooks/useTicker.js';
import {projects} from '../SiteData.js';
import ProjectCard from './ProjectCard.jsx';
import {Reveal} from './Animations.jsx';

export default function MyWorkPreview(){
 const {viewportRef,groupRef:firstGroupRef,bindings,paused,setPaused,index,nudge}=useTicker({speed:46,count:projects.length});
 const group=(copy=false)=><div className="v11-featured-group" data-carousel-group ref={copy?undefined:firstGroupRef} aria-hidden={copy?'true':undefined}>
  {projects.map((project,i)=><article className="v10-featured-card" key={`${copy?'repeat':'main'}-${project.id}`}><Link tabIndex={copy?-1:undefined} to={`/work/${project.id}`}><ProjectCard project={project}/><div className="v10-featured-card-foot"><div><span className="project-index">{String(i+1).padStart(2,'0')} / {project.category}</span><h3>{project.name}</h3><p>{project.subtitle}</p></div><ArrowUpRight size={22}/></div></Link></article>)}
 </div>;
 return <section className="v10-featured v11-featured v12-featured section-space" aria-labelledby="featured-title">
  <div className="frame"><div className="v10-section-top"><span className="micro-label">Selected glimpses</span><span className="micro-label">Explore the projects →</span></div>
   <div className="v10-featured-heading"><Reveal><h2 id="featured-title">Better work is<br/><em>built together.</em></h2></Reveal><div className="v10-featured-tools v11-featured-tools"><span>{String(index+1).padStart(2,'0')} <span>/ {String(projects.length).padStart(2,'0')}</span></span><button type="button" onClick={()=>nudge(-1)} aria-label="Previous project"><ArrowLeft size={20}/></button><button type="button" onClick={()=>nudge(1)} aria-label="Next project"><ArrowRight size={20}/></button><button className="v11-play-control" type="button" onClick={()=>setPaused(!paused)} aria-label={paused?'Resume automatic project carousel':'Pause automatic project carousel'} aria-pressed={paused}>{paused?<Play size={17}/>:<Pause size={17}/>}</button></div></div>
  </div>
  <div className="v10-featured-mask v12-featured-mask" ref={viewportRef} {...bindings} aria-label="Projects. Drag, swipe or use arrow keys to explore."><div className="v10-featured-track v11-featured-track v12-featured-track" data-carousel-track>
   {group()}{group(true)}{group(true)}
  </div></div>
  <div className="frame v10-featured-footer"><p>Projects move automatically. Pause anytime, or drag to explore at your own pace.</p><Link to="/work" className="button-primary">View the full archive <ArrowUpRight size={18}/></Link></div>
 </section>;
}
