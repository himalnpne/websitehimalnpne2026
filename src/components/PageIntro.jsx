import './PageIntro.css';
import React from 'react';
export function PageIntro({index,eyebrow,title,description,children}){return <section className="page-intro frame"><p className="eyebrow">{eyebrow}</p><div className="page-intro-grid"><div><h1>{title}</h1><p>{description}</p></div></div>{children}</section>}

