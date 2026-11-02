import './App.css';
import React,{useEffect,useState} from 'react';
import {BrowserRouter,Routes,Route,useLocation,Link} from 'react-router-dom';
import {AnimatePresence,motion,MotionConfig,useScroll,useSpring} from 'motion/react';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import FAQ from './pages/FAQ.jsx';
import {MyWork,ProjectDetails} from './pages/MyWork.jsx';
import {Blog,BlogPost} from './pages/Blog.jsx';
import Support from './pages/Support.jsx';
import Privacy from './pages/Privacy.jsx';
import {Header} from './components/Header.jsx';
import {Footer} from './components/Footer.jsx';
import Cat from './components/Cat.jsx';
import PageTransition from './components/PageTransition.jsx';
import {SEO} from './components/SEO.jsx';
function ScrollReset(){const {pathname}=useLocation();useEffect(()=>{window.scrollTo({top:0,behavior:'instant'});},[pathname]);return null}
function Layout(){const location=useLocation();const [theme,setTheme]=useState(()=>{try{return localStorage.getItem('hn-theme')||'light'}catch{return 'light'}}),[motionOn,setMotionOn]=useState(()=>{try{return localStorage.getItem('hn-motion')!=='off'}catch{return true}});const {scrollYProgress}=useScroll(),scaleX=useSpring(scrollYProgress,{stiffness:160,damping:30});
 useEffect(()=>{document.documentElement.dataset.theme=theme;try{localStorage.setItem('hn-theme',theme)}catch{}},[theme]);
 useEffect(()=>{document.documentElement.classList.toggle('motion-off',!motionOn);try{localStorage.setItem('hn-motion',motionOn?'on':'off')}catch{}},[motionOn]);
 return <MotionConfig reducedMotion={motionOn?'user':'always'}><ScrollReset/><SEO/><PageTransition enabled={motionOn}/><motion.div className="global-progress" style={{scaleX}} aria-hidden="true"/><Header theme={theme} setTheme={setTheme} motionOn={motionOn} setMotionOn={setMotionOn}/><main id="main" tabIndex={-1}><AnimatePresence mode="wait" initial={false}><motion.div key={location.pathname} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:motionOn?.22:0}}><Routes location={location}><Route path="/" element={<Home/>}/><Route path="/work" element={<MyWork/>}/><Route path="/work/:id" element={<ProjectDetails/>}/><Route path="/about" element={<About/>}/><Route path="/blog" element={<Blog/>}/><Route path="/blog/:slug" element={<BlogPost/>}/><Route path="/faq" element={<FAQ/>}/><Route path="/contact" element={<Contact/>}/><Route path="/support" element={<Support/>}/><Route path="/privacy" element={<Privacy/>}/><Route path="*" element={<section className="frame missing-page"><h1>Page not found.</h1><Link to="/">Go home →</Link></section>}/></Routes></motion.div></AnimatePresence></main><Footer/><Cat/><a className="skip-link" href="#main">Skip to content</a></MotionConfig>
}
export default function App(){return <BrowserRouter basename={import.meta.env.BASE_URL}><Layout/></BrowserRouter>}
