import './Article.css';
import React from 'react';
import Ads from './Ads.jsx';

// This renderer is for trusted articles authored locally in src/legacyPosts/.
// It intentionally accepts the inline markup found in those source articles.
// Do not use it to render untrusted external HTML or form submissions.
export function ArticleBlock({block,index}){
 const key=index;
 if(block.type==='header'){
  const Tag=block.level===3?'h3':'h2';
  const id=String(block.text||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  return <Tag id={id} key={key}>{block.text}</Tag>;
 }
 if(block.type==='paragraph')return <p key={key} dangerouslySetInnerHTML={{__html:block.text||''}}/>;
 if(block.type==='list')return <ul key={key}>{(block.items||[]).map((item,i)=><li key={i} dangerouslySetInnerHTML={{__html:typeof item==='string'?item:(item.text||'')}}/>)}</ul>;
 if(block.type==='quote')return <blockquote key={key}><p>{block.text}</p>{block.author&&<cite>— {block.author}</cite>}</blockquote>;
 if(block.type==='table')return <div key={key} className="article-table-scroll" tabIndex={0} role="region" aria-label="Scrollable comparison table"><table><thead><tr>{(block.headers||[]).map((h,i)=><th key={i} scope="col">{h}</th>)}</tr></thead><tbody>{(block.rows||[]).map((row,i)=><tr key={i}>{(Array.isArray(row)?row:row.data||[]).map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>;
 if(block.type==='hero')return <div key={key} className="article-callout"><h2>{block.title}</h2><p>{block.subtitle}</p>{block.stats&&<div className="article-stat-grid">{block.stats.map((s,i)=><div key={i}><strong>{s.value}</strong><span>{s.label}</span></div>)}</div>}</div>;
 return null;
}
export default function Article({article}){
 return <div className="legacy-article">{(article.content||[]).map((block,i)=><React.Fragment key={i}><ArticleBlock block={block} index={i}/>{(i===8||i===24)&&<Ads type="infeed" className="v9-inline-ad"/>}</React.Fragment>)}</div>;
}
