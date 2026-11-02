// Vite automatically discovers all *.jsx modules in src/posts/ at build time.
// Every file exports `meta` and a default React article component.
// No hand-maintained list, API, CMS or backend is required.
const files = import.meta.glob('./posts/*.jsx', { eager: true });
import React from 'react';
import Article from './components/Article.jsx';
const legacyFiles = import.meta.glob('./legacyPosts/*.js', { eager: true });
const slugs = new Set();
export const posts = Object.entries(files).map(([path, module]) => {
  const meta = module.meta;
  if (!meta || !meta.slug || !meta.title || !meta.date || typeof module.default !== 'function') {
    throw new Error(`Invalid blog post: ${path}. Export meta {slug, title, date} and a default component.`);
  }
  if (slugs.has(meta.slug)) throw new Error(`Duplicate post slug: ${meta.slug}`);
  slugs.add(meta.slug);
  return { ...meta, category: meta.category || 'Blog', excerpt: meta.excerpt || '', readTime: meta.readTime || '5 min', tags: meta.tags || [], Component: module.default };
}).concat(Object.values(legacyFiles).map(module => {
  const post = module.default;
  if (!post?.slug || !post?.title || !post?.date) throw new Error('Invalid legacy blog post');
  if (slugs.has(post.slug)) throw new Error('Duplicate post slug: ' + post.slug);
  slugs.add(post.slug);
  const category = post.slug.includes('nepal-travel') ? 'Travel' : post.slug.includes('adventure') || post.slug.includes('vehicles') ? 'Mobility' : 'Technology';
  return { slug:post.slug, title:post.title, date:post.date, author:post.author, excerpt:post.excerpt, tags:post.tags||[], category, cover: `${import.meta.env.BASE_URL}${String(post.featuredImage||'').replace(/^\//,'')}`, readTime:Math.max(3,Math.ceil(JSON.stringify(post.content||[]).length/1200))+' min read', Component:() => React.createElement(Article,{article:post}) };
})).sort((a,b) => new Date(b.date) - new Date(a.date));
export const getPost = slug => posts.find(post => post.slug === slug);
export const categories = ['All', ...new Set(posts.map(post => post.category))];
