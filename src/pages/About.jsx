import './About.css';
import React from 'react';
import {Link} from 'react-router-dom';
import {timeline,profile} from '../SiteData.js';
import {PageIntro} from '../components/PageIntro.jsx';
import {SectionHeading} from '../components/SectionHeading.jsx';
import {Reveal} from '../components/Animations.jsx';
const skills=[['Frontend development','React, JavaScript, CSS, Motion, accessibility'],['Backend & data','Python, Flask, Django, PostgreSQL, APIs'],['Product thinking','Interface design, prototyping, design systems'],['Exploration','Machine learning, Cloudflare, serverless systems']];
export default function About(){return <>
 <PageIntro eyebrow="About / The person behind the work" title={<>A little about<br/><em>how I think.</em></>} description="I'm Himal, an independent developer based in Nepal. I'm interested in the space between thoughtful design and practical engineering."/>
 <section className="frame about-portrait-grid"><Reveal className="about-poster"><div className="about-poster-top"><span>HN — 2026</span><span>Based in Nepal</span></div><div className="about-poster-orbit"><span>H</span><span>N</span></div><p>Always learning.<br/>Always making.</p></Reveal><Reveal className="about-long-copy"><p className="eyebrow">Hello, I'm Himal</p><h2>Simple ideas,<br/>well executed.</h2><p className="about-handle">Online as <a href={profile.github} target="_blank" rel="noopener noreferrer">@himalnpne</a> · Himal NPNE · Neupane Himal</p><p>I have a background in computer applications, and I enjoy turning ideas into products people can actually use. My work spans accessible interfaces, full-stack applications and experiments with data.</p><p>Whether it's a landing page or a more involved platform, I believe good work comes from a clear purpose, honest decisions and a willingness to refine the details.</p><Link className="button-primary" to="/contact">Get in touch <span>↗</span></Link></Reveal></section>
 <section className="frame section-space about-skills"><SectionHeading label="What I work with" right="Skills & tools"/><Reveal><h2 className="section-headline">A practical toolkit.</h2></Reveal><div className="about-tools">{skills.map(([title,tools],i)=><Reveal key={title} delay={i*.05}><div className="about-tool-row"><span>0{i+1}</span><h3>{title}</h3><p>{tools}</p></div></Reveal>)}</div></section>
 <section className="journey-section"><div className="frame"><SectionHeading label="Experience" right="Along the way"/><Reveal><h2 className="section-headline">The journey so far.</h2></Reveal><div className="journey-list">{timeline.map((t,i)=><Reveal key={i}><div className="journey-row"><span>{t.period}</span><div><h3>{t.title}</h3><strong>{t.org}</strong><p>{t.detail}</p></div></div></Reveal>)}</div></div></section>
 </>}
