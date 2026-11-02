import './Skills.css';
import React from 'react';
import useTicker from '../hooks/useTicker.js';
import {SiReact,SiPhp,SiPython,SiDocker,SiCloudflare,SiDjango,SiWordpress,SiFigma,SiPostgresql,SiLinux,SiJavascript,SiTypescript,SiGithub,SiVite} from 'react-icons/si';
import {FaJava} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import {ArrowUpRight} from 'lucide-react';

const tech=[
 {name:'React',Icon:SiReact,color:'#61DAFB'},
 {name:'PHP',Icon:SiPhp,color:'#777BB4'},
 {name:'Python',Icon:SiPython,color:'#3776AB'},
 {name:'Docker',Icon:SiDocker,color:'#2496ED'},
 {name:'Cloudflare',Icon:SiCloudflare,color:'#F38020'},
 {name:'Django',Icon:SiDjango,color:'#1c8060'},
 {name:'WordPress',Icon:SiWordpress,color:'#21759B'},
 {name:'Adobe Creative Suite',letters:'Adobe',color:'#eb4034'},
 {name:'Figma',Icon:SiFigma,color:'#a259ff'},
 {name:'PostgreSQL',Icon:SiPostgresql,color:'#4169E1'},
 {name:'Java',Icon:FaJava,color:'#5382A1'},
 {name:'Linux',Icon:SiLinux,color:'#FCC624'},
 {name:'JavaScript',Icon:SiJavascript,color:'#e4b600'},
 {name:'TypeScript',Icon:SiTypescript,color:'#3178C6'},
 {name:'GitHub',Icon:SiGithub,color:'#60666c'},
 {name:'Vite',Icon:SiVite,color:'#8e73df'}
];
function Tile({item}){return <div className="v10-tech-tile" title={item.name}><span className="v10-tech-icon" style={{'--brand':item.color}}>{item.Icon?<item.Icon aria-hidden="true"/>:<b className="v10-adobe-mark">A</b>}</span><span>{item.name}</span></div>}
export default function Skills(){
 const {viewportRef,groupRef,bindings,paused,setPaused}=useTicker({count:tech.length});
 return <section className="v10-tech-section" aria-labelledby="tools-title"><div className="frame v10-tech-head"><div><p className="micro-label">The tools / The craft</p><h2 id="tools-title">An adaptable stack.<br/><em>One thoughtful approach.</em></h2></div><Link to="/work" className="v10-tech-link">Explore my work <ArrowUpRight size={17}/></Link></div>
  <div className="v10-tech-window" ref={viewportRef} {...bindings} aria-label="Technologies I work with"><div className="v10-tech-moving" data-carousel-track>
   {[0,1,2].map((segment)=><div className="v10-tech-group" data-carousel-group ref={segment===0?groupRef:undefined} key={segment} aria-hidden={segment>0?true:undefined}>{tech.map(t=><Tile key={t.name} item={t}/>)}</div>)}
  </div></div>
  <div className="frame v10-tech-caption"><span>Design / Frontend / Backend / Infrastructure</span><span>Always moving · Drag to explore</span><button type="button" className="v10-tech-toggle" aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?'Play carousel':'Pause carousel'}</button></div>
 </section>
}
