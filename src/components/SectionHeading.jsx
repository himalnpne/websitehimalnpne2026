import './SectionHeading.css';
import React from 'react';
export function SectionHeading({number,label,right}){return <div className="section-mark"><span>{label}</span>{right&&<span>{right}</span>}</div>}
