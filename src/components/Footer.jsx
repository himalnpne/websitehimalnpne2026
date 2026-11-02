import './Footer.css';
import React from 'react';
import {Link} from 'react-router-dom';
import {ArrowUp} from 'lucide-react';
import {siteLinks,socialLinks} from '../Navigation.js';

export function Footer(){return <footer className="site-footer v7-footer"><div className="frame">
  <div className="footer-main"><div><p className="eyebrow">Have something in mind?</p><h2>Let's make it<br/>something good.</h2><Link to="/contact" className="footer-action">Start a conversation <span>↗</span></Link></div><p>I design and develop thoughtful digital experiences, with a focus on clarity, details and a bit of curiosity.</p></div>
  <div className="v7-footer-directory">
    <div className="v7-directory-brand"><Link to="/" aria-label="Himal Neupane home"><img src={`${import.meta.env.BASE_URL}logo.svg`} width="42" height="42" alt="Himal Neupane logo"/></Link><p>Himal Neupane<br/><span>Creative developer · Nepal</span></p></div>
    <nav aria-label="Footer pages"><strong>Explore</strong>{siteLinks.map(([path,label])=><Link key={path} to={path}>{label}</Link>)}</nav>
    <nav aria-label="Social profiles"><strong>Elsewhere</strong>{socialLinks.map(([label,url])=><a key={label} href={url} target="_blank" rel="noopener noreferrer">{label} ↗</a>)}</nav>
  </div>
  <div className="footer-bottom v7-footer-bottom"><span>© {new Date().getFullYear()} Himal Neupane · HimalNpne</span><span>Designed & built with intention.</span><button type="button" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>Back to top <ArrowUp size={14}/></button></div>
</div></footer>}
