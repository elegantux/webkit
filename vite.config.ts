// https://www.youtube.com/watch?v=u-nQzshfZcc
// https://vitejs.dev/guide/backend-integration

import { defineConfig, Plugin, ServerOptions, BuildOptions } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dns from 'dns';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/server-options.html#server-host
dns.setDefaultResultOrder('verbatim');

const APP_NAME = 'webkit';
const OUT_DIR = 'dist';
const PORT = 5888;
const ROOT = path.resolve('./');
const BASE = __dirname.replace(ROOT, '');

// Plugins
const plugins: Plugin[] = [
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  react(),
  svgr({
  
  }),
  tsconfigPaths(),
  {
    name: 'php',
    handleHotUpdate({ file, server }) {
      if (file.includes(`${APP_NAME}/`) && file.endsWith('.php')) {
        console.log('[PHP File Updated]: ', file);
        server.ws.send({ type: 'full-reload' });
      }
    }
  }
];

// Server
const server: ServerOptions = {
  port: PORT,
  strictPort: true,
};

// Build
const build: BuildOptions = {
  manifest: true,
  assetsDir: '.',
  outDir: OUT_DIR,
  emptyOutDir: true,
  sourcemap: true,
  rollupOptions: {
    input: ['src/main.tsx'],
    output: {
      entryFileNames: 'app.js',
      assetFileNames: '[name].[ext]',
    }
  }
};

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? `${BASE}/${OUT_DIR}/` : BASE,
  plugins,
  server,
  build,
});
