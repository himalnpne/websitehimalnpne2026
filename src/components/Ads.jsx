import './Ads.css';
import React,{useEffect,useRef} from 'react';

// Set your own AdSense client and slot IDs in .env. No advertising is loaded
// without an explicitly configured publisher account. Development uses placeholders
// so you can visually check spacing and ad placement.
const client=import.meta.env.VITE_ADSENSE_CLIENT?.trim();
const slots={leaderboard:import.meta.env.VITE_AD_SLOT_LEADERBOARD,rectangle:import.meta.env.VITE_AD_SLOT_RECTANGLE,infeed:import.meta.env.VITE_AD_SLOT_INFEED};
let scriptPromise;
function loadAds(){
 if(!scriptPromise){scriptPromise=new Promise((resolve,reject)=>{
  const existing=document.querySelector('script[data-hn-adsense]');
  if(existing){resolve();return;}
  const s=document.createElement('script');s.async=true;s.crossOrigin='anonymous';
  s.src=`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
  s.dataset.hnAdsense='true';s.onload=resolve;s.onerror=reject;document.head.appendChild(s);
 });}
 return scriptPromise;
}
export default function Ads({type='rectangle',className=''}){
 const ref=useRef(null);
 const slot=slots[type];
 const active=!!(import.meta.env.PROD&&client&&slot);
 useEffect(()=>{
  if(!active||!ref.current)return;
  let cancelled=false;
  loadAds().then(()=>{if(!cancelled && ref.current && !ref.current.dataset.initialized){
   ref.current.dataset.initialized='true';(window.adsbygoogle=window.adsbygoogle||[]).push({});
  }}).catch(()=>{});
  return()=>{cancelled=true;};
 },[active,slot]);
 if(import.meta.env.PROD&&!active)return null;
 return <aside className={`ad-placement ad-${type} ${className}`} aria-label="Advertisement"><span className="ad-caption">Advertisement</span>
  {active?<ins ref={ref} key={slot} className="adsbygoogle" style={{display:'block',width:'100%',minHeight:type==='rectangle'?250:type==='infeed'?200:100}} data-ad-client={client} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true"/>:<div className="ad-placeholder" aria-hidden="true"><span>{type==='leaderboard'?'Responsive banner · 728 × 90':type==='infeed'?'In-feed · responsive':'Sidebar · 300 × 250'}</span></div>}
 </aside>;
}
