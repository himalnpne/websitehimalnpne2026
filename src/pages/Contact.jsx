import './Contact.css';
import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import {profile} from '../SiteData.js';
import {PageIntro} from '../components/PageIntro.jsx';

// Taken from the contact form provided with this portfolio update.
// Google Forms uses a no-cors response: the browser cannot verify acceptance.
const FORM_ENDPOINT='https://docs.google.com/forms/d/e/1FAIpQLSeudTJfppkkRYXqlgaw50zONswJtng-7IGDhEBjt2_l0KMK1A/formResponse';
const entries={name:'entry.2005620554',email:'entry.89055849',username:'entry.1795697902',platform:'entry.818374615',message:'entry.839337160'};
const initial={name:'',email:'',username:'',platform:'',message:'',website:''};
const validEmail=s=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
export default function Contact(){
 const [form,setForm]=useState(initial),[errors,setErrors]=useState({}),[status,setStatus]=useState('idle');
 const set=(field,value)=>{setForm(previous=>({...previous,[field]:value}));setErrors(previous=>({...previous,[field]:null,contact:null}));};
 function validate(){const out={};if(!form.name.trim())out.name='Please enter your name.';if(!form.email.trim()&&!form.username.trim())out.contact='Provide an email address or social username.';if(form.email&& !validEmail(form.email))out.email='Please enter a valid email address.';if(form.username&&form.username.trim().length<3)out.username='At least 3 characters are needed.';if(form.username&&!form.platform)out.platform='Choose the platform where I can reach you.';if(!form.message.trim())out.message='Please enter a message.';return out;}
 function emailDraft(){const body=`Name: ${form.name}\nEmail: ${form.email}\nUsername: ${form.username}\nPlatform: ${form.platform}\n\n${form.message}`;return `mailto:${profile.email}?subject=${encodeURIComponent('Portfolio message from '+form.name)}&body=${encodeURIComponent(body)}`;}
 async function send(event){event.preventDefault();if(form.website)return;const issues=validate();setErrors(issues);if(Object.keys(issues).length)return;setStatus('sending');try{const data=new FormData();for(const [field,entry] of Object.entries(entries))data.append(entry,form[field]);await fetch(FORM_ENDPOINT,{method:'POST',mode:'no-cors',body:data});setStatus('sent-unverified');}catch{setStatus('error');}}
 return <>
   <PageIntro eyebrow="Contact / Get in touch" title={<>Let's make<br/><em>something work.</em></>} description="A new idea, a collaboration or a question—tell me a little about it and how to reach you."/>
   <section className="frame v8-contact-section"><div className="v8-contact-intro"><p className="micro-label">A direct conversation</p><h2>Every good project<br/>starts somewhere.</h2><p>Share your idea in your own words. Email or a social username is enough to get started.</p><div className="v8-contact-link"><span>Prefer writing directly?</span><a href={`mailto:${profile.email}`}>{profile.email} ↗</a></div><div className="v8-contact-social"><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href={profile.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href={profile.x} target="_blank" rel="noopener noreferrer">X ↗</a><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="https://t.me/himalnpne" target="_blank" rel="noopener noreferrer">Telegram ↗</a></div></div>
    <div className="v8-form-panel"><div className="v8-form-heading"><span>Message form</span><span>01 — 05</span></div><form id="message-form" className="v8-contact-form" onSubmit={send} noValidate>
      <div className="v8-form-field"><label htmlFor="contact-name">Your name <span>*</span></label><input id="contact-name" autoComplete="name" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="What should I call you?" aria-invalid={!!errors.name} aria-describedby={errors.name?'err-name':undefined}/>{errors.name&&<small id="err-name" role="alert">{errors.name}</small>}</div>
      <div className="v8-form-field"><label htmlFor="contact-email">Email address</label><input id="contact-email" autoComplete="email" inputMode="email" type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="you@example.com" aria-invalid={!!errors.email}/>{errors.email&&<small role="alert">{errors.email}</small>}</div>
      <div className="v8-form-separator"><span>or reach me by username</span></div>
      <div className="v8-form-row"><div className="v8-form-field"><label htmlFor="contact-username">Social username</label><input id="contact-username" value={form.username} onChange={e=>set('username',e.target.value)} placeholder="@username" aria-invalid={!!errors.username}/>{errors.username&&<small role="alert">{errors.username}</small>}</div><div className="v8-form-field"><label htmlFor="contact-platform">Platform {form.username&&<span>*</span>}</label><select id="contact-platform" value={form.platform} onChange={e=>set('platform',e.target.value)} aria-invalid={!!errors.platform}><option value="">Choose a platform</option>{['Instagram','LinkedIn','Signal','Snapchat','Telegram','X','Discord'].map(p=><option key={p}>{p}</option>)}</select>{errors.platform&&<small role="alert">{errors.platform}</small>}</div></div>{errors.contact&&<p className="v8-form-error" role="alert">{errors.contact}</p>}
      <div className="v8-form-field"><label htmlFor="contact-message">Your message <span>*</span></label><textarea id="contact-message" rows={6} value={form.message} onChange={e=>set('message',e.target.value)} placeholder="Tell me about your idea, your timeline, or what you have in mind…" aria-invalid={!!errors.message}/>{errors.message&&<small role="alert">{errors.message}</small>}</div>
      <div className="v8-honeypot" aria-hidden="true"><label htmlFor="contact-website">Leave this empty</label><input id="contact-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={e=>set('website',e.target.value)}/></div>
      <p className="v12-consent-note">By sending this message, you acknowledge that you have read the <Link to="/privacy">Privacy Policy</Link>. Your information will be sent to Google Forms for the purpose of responding to your inquiry.</p>
      <button className="v8-send" disabled={status==='sending'} type="submit">{status==='sending'?'Sending…':'Send message'} <span aria-hidden="true">↗</span></button>
      {status==='sent-unverified'&&<div className="v8-form-feedback" role="status"><strong>Submission request sent.</strong><p>Google Forms does not provide a readable confirmation to this website, so delivery cannot be verified here. You can also <a href={emailDraft()}>send an email directly</a>.</p><button type="button" onClick={()=>{setStatus('idle');setForm(initial);}}>Write another message</button></div>}
      {status==='error'&&<p className="v8-form-error" role="alert">The form could not submit. <a href={emailDraft()}>Open a message in your email app instead.</a></p>}
      <p className="v8-form-privacy">Please do not include passwords, financial details or sensitive personal information. <Link to="/privacy">How your data is handled ↗</Link></p>
    </form></div>
   </section>
 </>;
}
