import './ProjectCard.css';
import React, {useRef} from 'react';
import ProjectPreview from './ProjectPreview.jsx';

/** Light tracks the pointer without rerendering the entire project card. */
export default function ProjectCard({project}) {
  const ref = useRef(null);
  const onMove = event => {
    if (event.pointerType !== 'mouse' || !ref.current) return;
    const bounds = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--shine-x', `${(event.clientX - bounds.left) / bounds.width * 100}%`);
    ref.current.style.setProperty('--shine-y', `${(event.clientY - bounds.top) / bounds.height * 100}%`);
  };
  return <div className="project-hover-surface" ref={ref} onPointerMove={onMove}>
    <ProjectPreview project={project}/>
  </div>;
}
