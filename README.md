# Simple file names

Edit the JSX to change content and behavior, and the matching CSS to change its appearance.

| What you want to edit | File |
| --- | --- |
| Home page and section order | `src/pages/Home.jsx` |
| Header and mobile menu | `src/components/Header.jsx` + `Header.css` |
| Footer | `src/components/Footer.jsx` + `Footer.css` |
| Skills / tools ticker | `src/components/Skills.jsx` + `Skills.css` |
| Development methodology | `src/components/DevelopmentMethodology.jsx` + `DevelopmentMethodology.css` |
| Home project ticker | `src/components/MyWorkPreview.jsx` + `MyWorkPreview.css` |
| Full projects page and project details | `src/pages/MyWork.jsx` + `MyWork.css` |
| Testimonials ticker | `src/components/Testimonials.jsx` + `Testimonials.css` |
| Home blog ticker | `src/components/BlogPreview.jsx` + `BlogPreview.css` |
| Home FAQ preview | `src/components/FAQPreview.jsx` + `FAQPreview.css` |
| Full FAQ page | `src/pages/FAQ.jsx` + `FAQ.css` |
| Contact page and form | `src/pages/Contact.jsx` + `Contact.css` |
| About page | `src/pages/About.jsx` + `About.css` |
| Blog page and article reader | `src/pages/Blog.jsx` + `Blog.css` |
| Cat assistant | `src/components/Cat.jsx` + `Cat.css` |
| Top home animation | `src/components/HomeAnimation.jsx` + `HomeAnimation.css` |
| Personal details, projects and experience data | `src/SiteData.js` |
| Header and footer links | `src/Navigation.js` |
| Blog discovery and categories | `src/BlogData.js` |
| Shared site styles, colors and fonts | `src/Styles.css` |
| Continuous ticker controller | `src/hooks/useTicker.js` + `useTicker.css` |
| Page metadata | `src/components/SEO.jsx` |
| Routes, theme and site settings | `src/App.jsx` |

Article files also use descriptive names such as `ReactBlog.jsx`, `InterfaceMotion.jsx`,
`DigitalPrivacy.js`, `FreeVPNs.js`, and `NepalTravel.js`. Existing public page URLs stay the same.
Standard build/configuration files and font/image assets retain their required or descriptive names.

---

# Portfolio — carousel fixes

Technology, selected work and testimonials use the shared ticker hook. Blog
posts on the homepage use a separate single-row carousel with touch scrolling,
previous/next controls and automatic movement. Hovering or focusing the blog
carousel pauses it; the Pause/Play control is also available on touch devices.

Use this entire project rather than copying only the component files: the shared
hook and CSS are required. Components keep their individual JSX and CSS files.

```sh
npm ci
npm run dev
```

For deployment, run `npm run build` and upload `dist/`.
See [`SEO_SETUP.md`](SEO_SETUP.md) for the sitemap, crawler files, and Cloudflare Pages settings, including the few values you may need to change.
External contact delivery and advertising require their configured services.

---

## Editing styles

Styles now live beside the JSX they belong to. Each styled component imports its own CSS. For example, edit `src/components/Cat.jsx` for mascot behavior and `src/components/Cat.css` for its appearance. Page styles follow the same pattern: `src/pages/Home.jsx` and `src/pages/Home.css`.

- `src/Styles.css`: shared theme variables, typography, buttons, layout utilities and global accessibility rules.
- `src/App.css`: application-wide progress and missing-page styling.
- `src/components/*.css`: individual component styles, including responsive rules and animations.
- `src/pages/*.css`: page-specific styles.

Dynamic motion values, positions and data-driven CSS variables remain in JSX because they depend on runtime state. SEO-only and unstyled helper components do not need a CSS file. CSS remains ordinary global CSS, so keep the existing class prefixes when adding styles.

Run `npm install`, then `npm run dev` to edit locally. Run `npm run build` to create the production output. The ZIP includes source, lockfile and assets; dependencies and generated build output are excluded.

Validation for this CSS refactor: production build passed and all original selector declarations, responsive conditions and keyframes were retained. Older validation notes below describe earlier releases.

# Himal Portfolio — Blog Carousel & Continuous Motion

React 19 + Motion, static deployment on GitHub Pages / Cloudflare Pages, local Geologica and Tektur fonts, file-based blog, individual SEO routes, contact form, FAQ, Work, About, Support and Privacy.

## Changes in V13

### Homepage Blog: single-row carousel

The homepage heading is **“Curiosity, in writing.”** and the posts appear in one horizontal row. Three cards fit across desktop, two at tablet widths and one on mobile. The recent posts move automatically, with arrow buttons, touch scrolling and a Pause/Play button.

- The carousel pauses while hovered or focused, so readers can follow links and controls comfortably.
- Covers use `object-fit: contain` to avoid cropping text baked into the supplied article artwork. The three JSX essays that do not have covers get neutral category thumbnails.
- Posts are automatically discovered from `src/posts/` and `src/legacyPosts/` via `src/BlogData.js`; no manual carousel list is required.

Edit `src/components/BlogPreview.jsx` to change the `slice(0, 11)` limit or CSS animation speed (currently about 7.5 seconds per card). Styling lives in `src/components/BlogPreview.css`.

The `/blog` archive lists all matching articles directly and no longer separates an editor's pick from the archive. Project listings also include a gym site, travel site, notes mobile app design pitch and futsal booking concept.

## Previous V12 changes

### 1. Project carousel that actually moves

The homepage **“Better work is built together.”** rail now drives the `x` motion value of a `motion.div` with `useAnimationFrame`. It uses two equal-width sets of cards, measures the first group with `ResizeObserver`, and loops the position without a scrollLeft reset or native scroll snapping. That eliminates the original reason the strip could look frozen.

- Starts moving by default at **46 CSS pixels per second**, even when the pointer hovers over a card.
- The arrow buttons advance by a card and motion resumes shortly afterward.
- Drag left/right with touch or mouse; movement resumes after a short interaction delay.
- Pause/play button controls the autoplay explicitly.
- Honors operating-system reduced motion and the site's own motion-off setting; these deliberately disable autoplay.
- Duplicate cards are removed from keyboard tab order and the accessibility tree.

Source: `src/components/MyWorkPreview.jsx`. Adjust `SPEED=46` to tune speed.

### 2. Testimonials also autoplay

The homepage **“Good people. Better outcomes.”** testimonial strip now uses a seamless 42-second CSS marquee. Hovering no longer pauses playback. Use the pause/play button to pause it; keyboard focus and reduced-motion settings also pause it. The quotes are **layout examples only**, not verified client reviews—replace them before representing them as real testimonials.

Styles: `.v12-quote-track`, `@keyframes v12-testimonial-drift` in `src/components/Testimonials.css`.

### 3. More intentional transitions

- A brief diagonal **oxblood page curtain** plays when navigating between pages, with the HN mark centered; the original layout and SEO routes stay unchanged.
- A separate homepage **scroll reveal** reveals “Every detail has a purpose.” with a moving band and masked headline, while preserving readable text in the DOM.
- Both respect reduced-motion preferences.

Sources: `src/components/PageTransition.jsx`, `src/components/MyApproach.jsx`.

### 4. Mobile hero cube now has its own space

The homepage DOM has been restructured so the headline, 3D cube, and Design/Develop/Deploy text blocks are distinct items. On phones and tablets the cube lives in a dedicated bordered visual stage between the intro and process steps. At 650px and below the cube is reduced significantly and **no longer sticks over the text**. On desktop it remains sticky in the separate right-hand column. Mobile cube stage controls change the active shape in place.

Source: `src/pages/Home.jsx`, `src/pages/Home.css` and `src/components/MyApproach.css`.

### 5. Contact and privacy links

A notice immediately before **Send message** says that submitting acknowledges reading the **Privacy Policy**, with an internal `/privacy` link, and discloses that messages go to Google Forms. The existing privacy note remains linked. The privacy policy links back to the contact form. This is a readable disclosure, not a claim that the Google Forms endpoint confirms delivery.

Source: `src/pages/Contact.jsx`, `src/pages/Privacy.jsx`.

### 6. Header

The logo is enlarged again: approximately 73px on desktop and 64px on mobile, while the header height and responsive menu spacing were updated.

## Run on Windows

Extract the ZIP into `D:\Brave\himal-portfolio-v12`, then open PowerShell:

```powershell
cd D:\Brave\himal-portfolio-v12
Copy-Item "D:\Brave\static\Geologica*.ttf" ".\static\" -Force
Copy-Item "D:\Brave\static\Tektur*.ttf" ".\static\" -Force
npm install
npm run dev
```

If your font files already exist inside the extracted project's `static/` folder you can skip the copies. **Font files are not included in the downloadable package.** The included `public/logo.svg` is a placeholder to replace with your real HN logo.

Run the production build before publishing:

```powershell
npm run build
npm run preview
```

## Deploy on Cloudflare Pages

| Field | Value |
|---|---|
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output | `dist` |
| Environment `VITE_BASE_PATH` | `/` |
| Environment `SITE_URL` | `https://neupanehimal.com.np` (update if different) |

Cloudflare Pages can connect directly to a GitHub repository. The build creates individual crawlable HTML files for the Work, FAQ, Contact, blog article, Privacy, Support, and other routes. GitHub Pages has a deployment workflow at `.github/workflows/deploy.yml` with base-path handling.

## Other publishing checks

- Verify that a test contact message appears in the linked Google Form's responses. The form uses `mode: 'no-cors'`, so a browser cannot confirm Google actually stored the message.
- Replace the sample testimonials with genuine, permissioned reviews.
- Check `src/SiteData.js` for the right email, project links and social URLs.
- The `page-mascot` reactions sheet is still the placeholder copy from V10/V11; replace `public/mascots/cat-reactions.webp` with the matching genuine reaction atlas if you want distinct facial reactions.
- AdSense remains disabled until valid publisher and slot IDs are configured.
- The carousel won't animate when reduced motion is requested by the OS or disabled in site settings. This is intentional.

## Testing performed here

The 42 JS/JSX/build scripts were parsed using the TypeScript parser; PostCSS parsed the stylesheet; local import references and GitHub workflow YAML were checked. A browser **CSS layout smoke test** at 390px, 768px and 1440px found no horizontal page overflow. The testimonial strip's CSS transform changed over time while hovered, confirming its autoplay in that test. The full React project build and live interaction tests could not be run because registry DNS access blocked installing npm packages; run `npm install`, `npm run build`, and check interactions locally before publishing.
