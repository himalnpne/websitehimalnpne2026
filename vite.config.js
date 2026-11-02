import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

// User-supplied fonts live at project-root/static/ (next to package.json).
// Mirror those TTF assets to public/static/ before Vite copies public/ to dist/.
// The files themselves are never required to build; a local fallback is provided.
const source = resolve('static');
const target = resolve('public/static');
if (existsSync(source)) {
  mkdirSync(target, { recursive: true });
  for (const name of readdirSync(source)) {
    if (/^(?:Geologica(?:_Auto|_Cursive)?-(?:Thin|ExtraLight|Light|Regular|Medium|SemiBold|Bold|ExtraBold|Black)|Tektur(?:_Condensed|_SemiCondensed)?-(?:Regular|Medium|SemiBold|Bold|ExtraBold|Black))\.ttf$/i.test(name)) {
      copyFileSync(join(source, name), join(target, name));
    }
  }
}

// GitHub Pages: served from /<repo>/. Custom domain: /.
// Priority: explicit env > GitHub Actions auto-detect > repo-name fallback > '/'
const REPO_NAME = 'websitehimalnpne2026';
const base =
  process.env.VITE_BASE_PATH ||
  (process.env.GITHUB_ACTIONS ? `/${REPO_NAME}/` : '/');

export default defineConfig({
  plugins: [react()],
  base,
  publicDir: 'public',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (/node_modules\/(?:motion|framer-motion|motion-dom|motion-utils)\//.test(id)) return 'motion';
          if (/node_modules\/(?:react-icons|lucide-react)\//.test(id)) return 'icons';
          return 'vendor';
        }
      }
    }
  },
  define: {
    __SEO_SITE_URL__: JSON.stringify(
      process.env.SITE_URL ||
      process.env.VITE_SITE_URL ||
      `https://${process.env.GITHUB_REPOSITORY_OWNER || 'himalnpne'}.github.io/${REPO_NAME}`
    ),
  },
});