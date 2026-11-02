import './PageTransition.css';
import React from 'react';
import {motion,useReducedMotion} from 'motion/react';
import {useLocation} from 'react-router-dom';

// Original branded wipe inspired by motion-led editorial sites. No copied art.
export default function PageTransition({enabled=true}){
 const {pathname}=useLocation();
 const reduced=useReducedMotion();
 if(reduced||!enabled)return null;
 return <motion.div key={pathname} aria-hidden="true" className="v12-route-curtain" initial={{clipPath:'inset(0 100% 0 0)'}} animate={{clipPath:['inset(0 100% 0 0)','inset(0 0% 0 0)','inset(0 0 0 100%)']}} transition={{duration:1.06,times:[0,.44,1],ease:[.76,0,.24,1]}}>
  <div className="v12-curtain-brand"><img src={`${import.meta.env.BASE_URL}logo.svg`} alt=""/><span>HIMAL / NPNE</span></div>
  <span className="v12-curtain-index">DESIGN · DEVELOP · DEPLOY</span>
 </motion.div>;
}
