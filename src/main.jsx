import './Styles.css';
import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';

// Local font files are copied from /static to /public/static by vite.config.js.
// No remote font requests; missing files simply fall back to installed fonts.
const base = import.meta.env.BASE_URL;
const sheet = document.createElement('style');
sheet.dataset.fonts = 'local-geologica-tektur';

const geologicaFamilies = [
  ['Geologica', 'Geologica'],
  ['Geologica Auto', 'Geologica_Auto'],
  ['Geologica Cursive', 'Geologica_Cursive'],
];
const geologicaWeights = [
  ['Thin', 100], ['ExtraLight', 200], ['Light', 300],
  ['Regular', 400], ['Medium', 500], ['SemiBold', 600],
  ['Bold', 700], ['ExtraBold', 800], ['Black', 900],
];
const tekturFamilies = [
  ['Tektur', 'Tektur'],
  ['Tektur Condensed', 'Tektur_Condensed'],
  ['Tektur SemiCondensed', 'Tektur_SemiCondensed'],
];
const tekturWeights = [
  ['Regular', 400], ['Medium', 500], ['SemiBold', 600],
  ['Bold', 700], ['ExtraBold', 800], ['Black', 900],
];

const face = (family, stem, weight, value) =>
  `@font-face{font-family:"${family}";src:url("${base}static/${stem}-${weight}.ttf") format("truetype");font-style:normal;font-weight:${value};font-display:swap;}`;

sheet.textContent = [
  ...geologicaFamilies.flatMap(([family, stem]) =>
    geologicaWeights.map(([weight, value]) => face(family, stem, weight, value))
  ),
  ...tekturFamilies.flatMap(([family, stem]) =>
    tekturWeights.map(([weight, value]) => face(family, stem, weight, value))
  ),
].join('\n');
document.head.appendChild(sheet);

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
