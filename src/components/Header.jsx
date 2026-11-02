import './Header.css';
import React,{useEffect,useRef,useState} from 'react';
import {Link,NavLink,useLocation} from 'react-router-dom';
import {AnimatePresence,motion} from 'motion/react';
import {Sun,Moon,ArrowUpRight,Menu,X} from 'lucide-react';
import {siteLinks,headerLinks,socialLinks} from '../Navigation.js';

export function Header({theme,setTheme,motionOn,setMotionOn}) {
  const [open,setOpen]=useState(false);
  const [brandArrived,setBrandArrived]=useState(false);
  const location=useLocation();
  const menuRef=useRef(null);
  const toggleRef=useRef(null);
  useEffect(()=>setOpen(false),[location.pathname]);
  useEffect(()=>{
    let timer;
    const arrive=()=>{setBrandArrived(false);requestAnimationFrame(()=>{setBrandArrived(true);timer=setTimeout(()=>setBrandArrived(false),2100);});};
    window.addEventListener('himal:mark-arrived',arrive);
    return()=>{window.removeEventListener('himal:mark-arrived',arrive);clearTimeout(timer)};
  },[]);
  useEffect(()=>{
    if(!open)return;
    const previous=document.activeElement;
    const first=menuRef.current?.querySelector('a,button');
    first?.focus();
    function handleKey(e){
      if(e.key==='Escape'){setOpen(false);return;}
      if(e.key!=='Tab'||!menuRef.current)return;
      const nodes=[...menuRef.current.querySelectorAll('a[href],button:not([disabled])')];
      if(!nodes.length)return;
      if(e.shiftKey&&document.activeElement===nodes[0]){e.preventDefault();nodes.at(-1).focus();}
      else if(!e.shiftKey&&document.activeElement===nodes.at(-1)){e.preventDefault();nodes[0].focus();}
    }
    document.addEventListener('keydown',handleKey);
    document.body.classList.add('drawer-open');
    return ()=>{document.removeEventListener('keydown',handleKey);document.body.classList.remove('drawer-open');if(previous instanceof HTMLElement) previous.focus();};
  },[open]);
  return <>
    <header className="site-header v7-header">
      <div className="frame header-inner v7-header-inner">
        <Link className={`brand ${brandArrived?'brand-arrived':''}`} to="/" aria-label="Himal Neupane, go to homepage"><img src={`${import.meta.env.BASE_URL}logo.svg`} width="64" height="64" alt="Himal Neupane logo"/></Link>
        <nav className="desktop-nav v7-nav" aria-label="Main navigation">
          {headerLinks.filter(([path])=>path!=='/contact').map(([path,label])=><NavLink key={path} end={path==='/'} to={path} className={({isActive})=>isActive?'active':''}>{label}</NavLink>)}
        </nav>
        <div className="header-actions v7-header-actions">
          <button className="theme-icon-button theme-control v7-theme-toggle" type="button" onClick={()=>setTheme(theme==='light'?'dark':'light')} aria-label={`Switch to ${theme==='light'?'dark':'light'} theme`} title={`Switch to ${theme==='light'?'dark':'light'} theme`}>{theme==='light'?<Moon size={18} strokeWidth={1.7}/>:<Sun size={18} strokeWidth={1.7}/>}</button>
          <Link to="/contact" className="header-contact v7-contact">Get in touch <ArrowUpRight size={15} strokeWidth={1.7}/></Link>
          <button ref={toggleRef} type="button" className={`v7-menu-toggle ${open?'is-open':''}`} aria-label={open?'Close navigation menu':'Open navigation menu'} aria-expanded={open} aria-controls="mobile-site-navigation" onClick={()=>setOpen(x=>!x)}>{open?<X size={22}/>:<Menu size={22}/>}</button>
        </div>
      </div>
    </header>
    <AnimatePresence>
      {open&&<>
        <motion.button type="button" className="v7-menu-backdrop" aria-label="Close navigation" onClick={()=>setOpen(false)} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.2}}/>
        <motion.nav ref={menuRef} id="mobile-site-navigation" aria-label="Mobile navigation" className="v7-mobile-drawer" initial={{x:'105%'}} animate={{x:0}} exit={{x:'105%'}} transition={{type:'spring',stiffness:320,damping:35}}>
          <div className="v7-drawer-head"><span>Navigate</span><button type="button" aria-label="Close navigation" onClick={()=>setOpen(false)}><X size={19}/></button></div>
          <div className="v7-drawer-links">{siteLinks.map(([path,label],i)=><NavLink key={path} end={path==='/'} to={path} onClick={()=>setOpen(false)}><span className="v7-drawer-index">0{i+1}</span>{label}<ArrowUpRight size={16} strokeWidth={1.6}/></NavLink>)}</div>
          <div className="v7-drawer-bottom">
            <div className="v7-drawer-controls"><button type="button" onClick={()=>setTheme(theme==='light'?'dark':'light')}>{theme==='light'?<Moon size={16}/>:<Sun size={16}/>} Theme</button><button type="button" onClick={()=>setMotionOn(!motionOn)}>{motionOn?'Reduce motion':'Enable motion'}</button></div>
            <div className="v7-drawer-socials">{socialLinks.map(([title,href])=><a key={title} href={href} target="_blank" rel="noopener noreferrer">{title}</a>)}</div>
          </div>
        </motion.nav>
      </>}
    </AnimatePresence>
  </>;
}

