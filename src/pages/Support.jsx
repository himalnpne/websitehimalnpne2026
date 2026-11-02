import './Support.css';
import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight,Copy,Check,Heart} from 'lucide-react';
import {Reveal} from '../components/Animations.jsx';
const paymentLink='https://link.payoneer.com/Token?t=F582E1BA6E154DA2A8802E884260FE94&src=pl';
const signalLink='https://signal.me/#eu/TXMDKP0cwDqAYa4TemME17dk_qORav7Z24ZxCcUAioUtERRn7s9Ii563ZlWt6mLs';
export default function Support(){
 const [copied,setCopied]=useState(false);
 const copy=async()=>{try{await navigator.clipboard.writeText(paymentLink);setCopied(true);setTimeout(()=>setCopied(false),2400)}catch{window.prompt('Copy this link:',paymentLink)}};
 return <div className="v9-support-page frame"><Reveal><div className="v9-support-heading"><span className="micro-label">Community / Open knowledge</span><h1>Support the work.<br/><em>Keep it independent.</em></h1><p>Your support helps me keep publishing guides, building projects and sharing useful resources.</p></div></Reveal>
 <div className="v9-support-layout"><Reveal><section className="v9-support-main"><div className="v9-support-card-top"><div><span className="micro-label">An easy way to contribute</span><h2>Payoneer</h2></div><Heart size={23} strokeWidth={1.4} aria-hidden="true"/></div><div className="v9-qr-wrap"><img src={`${import.meta.env.BASE_URL}payoneer-qr.png`} alt="Payoneer payment QR code" width="320" height="320"/><p>Scan with a compatible payment app</p></div><div className="v9-payment-actions"><a href={paymentLink} target="_blank" rel="noopener noreferrer" className="button-primary">Open payment link <ArrowUpRight size={17}/></a><button type="button" onClick={copy} className="v9-copy-payment">{copied?<Check size={16}/>:<Copy size={16}/>} {copied?'Copied':'Copy link'}</button></div><p className="v9-payment-disclaimer">Payments are processed by the payment provider. Verify the recipient and amount before sending; no transaction details are collected on this website.</p></section></Reveal>
 <aside className="v9-support-aside"><h2>Other ways to help</h2><p>You can also share an article, reference a project, or recommend this work to someone who might benefit.</p><div className="v9-support-options"><div><strong>Share the blog</strong><Link to="/blog">Browse articles ↗</Link></div><div><strong>Support from Nepal</strong><Link to="/contact">Ask about eSewa or Khalti ↗</Link></div><div><strong>Contact privately</strong><a href={signalLink} target="_blank" rel="noopener noreferrer">Message on Signal ↗</a></div></div><span className="micro-label">Thank you for being here.</span></aside></div></div>;
}
