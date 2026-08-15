import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://toufichanna.dev',
  output: 'hybrid',
  adapter: node({ mode: 'standalone' }),
});
