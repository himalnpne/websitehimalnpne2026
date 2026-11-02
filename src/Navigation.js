import {profile} from './SiteData.js';
export const siteLinks = [
  ['/', 'Home'], ['/work', 'Projects'], ['/about', 'About'],
  ['/blog', 'Blog'], ['/faq', 'FAQ'], ['/contact', 'Contact'], ['/support', 'Support'], ['/privacy', 'Privacy']
];
export const headerLinks=siteLinks.filter(([url])=>url!=='/privacy'&&url!=='/support');
export const socialLinks = [
  ['GitHub', profile.github], ['Instagram', profile.instagram],
  ['X / Twitter', profile.x], ['LinkedIn', profile.linkedin]
];
