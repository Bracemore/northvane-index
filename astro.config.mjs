import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://vector-report.pages.dev',
  output: 'static',
  build: { inlineStylesheets: 'auto' },
  compressHTML: true,
});
