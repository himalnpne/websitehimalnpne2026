import './MyWork.css';
import React,{useState} from 'react';
import {Link,useParams} from 'react-router-dom';
import {AnimatePresence,motion} from 'motion/react';
import {projects} from '../SiteData.js';
import {PageIntro} from '../components/PageIntro.jsx';
import ProjectPreview from '../components/ProjectPreview.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import {Tilt} from '../components/Animations.jsx';
export function MyWork(){
 const [filter,setFilter]=useState('All');const filters=['All',...new Set(projects.map(p=>p.category))];const shown=filter==='All'?projects:projects.filter(p=>p.category===filter);
 return <><PageIntro eyebrow="Selected work / 2025—2026" title={<>Work worth<br/><em>a closer look.</em></>} description="A collection of interfaces, products and experiments. Different problems, one approach: keep it useful, clear and considered."/><section className="frame work-page-list"><div className="work-filter"><div role="group" aria-label="Filter projects">{filters.map(c=><button key={c} onClick={()=>setFilter(c)} className={filter===c?'selected':''} aria-pressed={filter===c}>{c}</button>)}</div><span>{shown.length} projects</span></div><motion.div layout className="work-grid full-work-grid"><AnimatePresence mode="popLayout">{shown.map(project=><motion.div layout key={project.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}} transition={{duration:.25}}><Link className="work-card" to={`/work/${project.id}`}><Tilt className="work-card-tilt" max={2.4}><ProjectCard project={project}/></Tilt><div className="work-card-info"><div><span className="project-index">{project.category} <span>· {project.year}</span></span><h3>{project.name}</h3><p>{project.subtitle}</p></div><span className="work-arrow">↗</span></div></Link></motion.div>)}</AnimatePresence></motion.div></section></>;
}
export function ProjectDetails(){
 const {id}=useParams();const p=projects.find(p=>p.id===id);if(!p)return <section className="frame section-space"><h1>Project not found.</h1><Link to="/work">Back to projects</Link></section>;
 const next=projects[(projects.indexOf(p)+1)%projects.length];
 return <><section className="frame detail-hero"><Link to="/work" className="back-link">← All projects</Link><div className="detail-title"><span>{p.category} · {p.year}</span><h1>{p.name}</h1><p>{p.description}</p></div><ProjectPreview project={p} large/></section><section className="frame detail-content"><div className="detail-meta"><div><span>Discipline</span><strong>{p.category}</strong></div><div><span>Year</span><strong>{p.year}</strong></div><div><span>Built with</span><strong>{p.stack.join(' · ')}</strong></div></div><div className="detail-body"><aside>Behind the project</aside><article><section><h2>The challenge</h2><p>{p.challenge}</p></section><section><h2>The approach</h2><p>{p.solution}</p></section><div className="detail-links">{p.live&&<a href={p.live} target="_blank" rel="noopener noreferrer">View live website ↗</a>}{p.repo&&<a href={p.repo} target="_blank" rel="noopener noreferrer">View source code ↗</a>}{!p.live&&!p.repo&&<span>No public demo available for this project yet.</span>}</div></article></div></section><Link className="next-project" to={`/work/${next.id}`}><div className="frame"><span>Next project</span><h2>{next.name} <span>↗</span></h2></div></Link></>;
}
