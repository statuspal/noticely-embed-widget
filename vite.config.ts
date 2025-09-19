import { defineConfig, build } from 'vite';
import preact from '@preact/preset-vite';
import { resolve } from 'path';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import compression from 'vite-plugin-compression';
import tailwindcss from '@tailwindcss/vite';

// Shared build configuration
const createBuildConfig = (isDev = false) => ({
  lib: {
    entry: resolve(process.cwd(), 'src/main.tsx'),
    name: 'NoticelyWidget',
    fileName: 'main',
    formats: ['iife', ...(isDev ? [] : ['umd'])] as ('iife' | 'umd')[]
  },
  minify: (isDev ? false : 'terser') as boolean | 'terser',
  rollupOptions: {
    output: {
      extend: true,
      manualChunks: undefined
    }
  },
  chunkSizeWarningLimit: 100
});

// Auto-rebuild plugin for development
const autoRebuild = () => {
  let isBuilding = false;

  return {
    name: 'auto-rebuild-widget',
    handleHotUpdate() {
      if (!isBuilding) {
        isBuilding = true;

        build({
          plugins: [preact(), tailwindcss(), cssInjectedByJsPlugin()],
          mode: 'development',
          build: createBuildConfig(true)
        }).finally(() => (isBuilding = false));
      }
      return undefined;
    }
  };
};

export default defineConfig(({ command, mode }) => {
  if (command === 'build') {
    const plugins = [preact(), tailwindcss(), cssInjectedByJsPlugin()];

    // Only add compression plugin for production builds
    if (mode !== 'development')
      plugins.push([
        compression({
          algorithm: 'gzip',
          ext: '.gz',
          deleteOriginFile: false, // Keep original files
          threshold: 1024, // Only compress files larger than 1KB
          filter: /\.(js|cjs)$/, // Include both .js and .cjs files
          verbose: true // Show compression results
        })
      ]);

    return {
      plugins,
      build: createBuildConfig(mode === 'development')
    };
  }

  return {
    plugins: [preact(), tailwindcss(), autoRebuild()],
    server: {
      host: true,
      cors: true,
      port: 5173
    }
  };
});
