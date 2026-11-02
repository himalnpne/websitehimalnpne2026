# SEO and Cloudflare Pages setup

The site generates its search files during `npm run build`. Deploy the contents
of `dist/`; do not upload the project root.

## Files generated at the site root

- `sitemap.xml` lists the home page, each project, and each blog article.
- `robots.txt` allows crawling and points crawlers to the sitemap.
- `llms.txt` is a compact Markdown index of the site for AI systems that choose
  to read it. It is an optional convention, not a search-engine ranking switch.
- `llms-full.txt` provides project and article summaries in one text file.
- `llm.html` provides the same guide as a simple HTML page.
- `feed.xml` is the RSS feed; `404.html` is the not-found page.
- `_headers` sets basic response headers and cache rules on Cloudflare Pages.
- `_redirects` sends the former `/projects` path to `/work`.

The sitemap and all SEO page metadata use `SITE_URL`, which defaults to
`https://neupanehimal.com.np`. Change it in `.env.local` for a local override or
in the Cloudflare Pages production build environment if the domain changes.

## Cloudflare Pages

1. In **Workers & Pages → your Pages project → Settings → Builds & deployments**,
   set the build command to `npm run build` and the build output directory to
   `dist`.
2. Set `SITE_URL` to the canonical HTTPS domain, without a trailing slash, and
   `VITE_BASE_PATH` to `/` for the custom domain. For GitHub Pages at a project
   path, use `/repository-name/` instead.
3. In `wrangler.jsonc`, change `name` if it does not match the existing Pages
   project name. The file declares the same `dist` output for Wrangler deploys.
   For a direct CLI deployment after creating or selecting the Pages project,
   run `npm ci`, `npm run build`, then `npx wrangler pages deploy dist`.
4. Add or confirm `neupanehimal.com.np` under **Custom domains**. Configure any
   `www` to apex redirect in Cloudflare if you want both hostnames to resolve to
   one canonical domain; the `_redirects` file cannot redirect between hosts.
5. After deployment, open `/sitemap.xml`, `/robots.txt`, `/llms.txt`, and
   `/llm.html` on the live domain. In Google Search Console, add the domain
   property and submit `https://neupanehimal.com.np/sitemap.xml`.

## Details to personalize

- Update the `profile` object in `src/SiteData.js` if your name, role, location,
  contact links, or website changes.
- Replace `public/social-preview.jpg` with the final 1200 × 630 social sharing
  image if you want a different preview.
- Add redirects to `public/_redirects` for any other old paths you need to keep.
- Advertising is loaded only when the AdSense client and slot IDs in the
  Cloudflare build environment are configured. The old inline AdSense script is
  intentionally not copied from the supplied index file because the current app
  loads it once, only when those values exist.

The React build already renders real HTML for every route and adds per-page
canonical, Open Graph, X/Twitter and JSON-LD metadata. Keep project and blog
content in their existing data files so the sitemap, RSS feed, and AI index stay
in sync with the actual routes.
