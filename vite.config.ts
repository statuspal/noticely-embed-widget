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
  minify: 'terser' as const,
  rollupOptions: {
    output: {
      extend: true,
      manualChunks: undefined
    }
  },
  chunkSizeWarningLimit: 150
});

// Auto-rebuild plugin for development
const autoRebuild = () => {
  let isBuilding = false;

  return {
    name: 'auto-rebuild-widget',
    handleHotUpdate() {
      if (isBuilding) return;

      isBuilding = true;
      console.log('🔨 Rebuilding widget bundle...');

      // Run build in background without blocking HMR
      build({
        plugins: [preact(), tailwindcss(), cssInjectedByJsPlugin()],
        mode: 'development',
        build: createBuildConfig(true),
        configFile: false,
        logLevel: 'silent'
      })
        .then(() => console.log('✅ Widget bundle rebuilt'))
        .catch(error => console.error('❌ Build failed:', error))
        .finally(() => (isBuilding = false));

      // Return undefined to let Vite handle HMR normally
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
          deleteOriginFile: false,
          threshold: 1024,
          filter: /\.(js|cjs)$/,
          verbose: true
        })
      ]);

    return {
      plugins,
      build: createBuildConfig(mode === 'development')
    };
  }

  // Development server with auto-rebuild
  return {
    plugins: [preact(), tailwindcss(), autoRebuild()],
    server: {
      cors: true,
      port: 5173
    }
  };
});
