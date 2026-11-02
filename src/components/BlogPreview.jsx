import './BlogPreview.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from 'lucide-react';
import { posts } from '../BlogData.js';

const displayDate = (date) => new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
  month: 'short', day: 'numeric', year: 'numeric'
});

export default function BlogPreview() {
  const featuredPosts = posts.slice(0, 11);
  const viewportRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const move = useCallback((direction) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const first = viewport.querySelector('.home-journal-item');
    if (!first) return;
    const style = getComputedStyle(viewport);
    const gap = parseFloat(style.columnGap || style.gap) || 0;
    const amount = first.getBoundingClientRect().width + gap;
    const atEnd = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 4;
    if (direction > 0 && atEnd) viewport.scrollTo({ left: 0, behavior: 'smooth' });
    else if (direction < 0 && viewport.scrollLeft <= 4) viewport.scrollTo({ left: viewport.scrollWidth, behavior: 'smooth' });
    else viewport.scrollBy({ left: amount * direction, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (paused || hovered || focused || featuredPosts.length < 2) return undefined;
    const timer = window.setInterval(() => move(1), 5000);
    return () => window.clearInterval(timer);
  }, [paused, hovered, focused, featuredPosts.length, move]);

  return (
    <div className="home-journal">
      <div className="frame home-journal-toolbar">
        <p>{String(featuredPosts.length).padStart(2, '0')} stories to explore.</p>
        <div className="home-journal-controls" aria-label="Blog carousel controls">
          <button type="button" onClick={() => move(-1)} aria-label="Previous blog post"><ArrowLeft size={18} /></button>
          <button type="button" onClick={() => move(1)} aria-label="Next blog post"><ArrowRight size={18} /></button>
          <button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? 'Play blog carousel' : 'Pause blog carousel'} aria-pressed={paused}>{paused ? <Play size={16} /> : <Pause size={16} />}</button>
        </div>
      </div>

      <div
        className="frame home-journal-grid"
        ref={viewportRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
        aria-label="Recent blog posts"
      >
        {featuredPosts.map((post, index) => (
          <article className="home-journal-item" key={post.slug}>
            <Link to={`/blog/${post.slug}`} className="home-journal-card">
              <div className={`home-journal-cover${post.cover ? ' has-cover' : ''}`}>
                {post.cover
                  ? <img src={post.cover} alt="" loading="lazy" decoding="async" />
                  : <div className="home-journal-cover-fallback"><span>HN / BLOG</span><strong>{post.category}</strong><span>{String(index + 1).padStart(2, '0')} — NOTES</span></div>}
                <span className="home-journal-image-arrow" aria-hidden="true"><ArrowUpRight size={18} strokeWidth={1.8} /></span>
              </div>
              <div className="home-journal-meta"><span>{post.category}</span><time dateTime={post.date}>{displayDate(post.date)}</time></div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <div className="home-journal-bottom"><span>{post.readTime}</span><span>Read story <ArrowUpRight size={15} strokeWidth={1.6} /></span></div>
            </Link>
          </article>
        ))}
      </div>

      <div className="frame home-journal-footer">
        <span>Privacy / Development / Nepal / Design</span>
        <Link to="/blog">Explore the blog <ArrowUpRight size={17} /></Link>
      </div>
    </div>
  );
}
