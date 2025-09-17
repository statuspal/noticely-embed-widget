import { defineConfig, build } from 'vite';
import preact from '@preact/preset-vite';
import { resolve } from 'path';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// Shared build configuration
const createBuildConfig = (isDev = false) => ({
  lib: {
    entry: resolve(process.cwd(), 'src/widget.tsx'),
    name: 'NoticelyWidget',
    fileName: 'widget',
    formats: (isDev ? ['iife'] : ['iife', 'umd']) as ('iife' | 'umd')[]
  },
  minify: (isDev ? false : 'terser') as boolean | 'terser',
  rollupOptions: {
    output: {
      extend: true,
      manualChunks: undefined
    }
  },
  chunkSizeWarningLimit: 20
});

// Auto-rebuild plugin for development
const autoRebuildWidget = () => {
  let isBuilding = false;

  return {
    name: 'auto-rebuild-widget',
    handleHotUpdate({ file }) {
      if (file.includes('src/widget') && !isBuilding) {
        isBuilding = true;
        console.log('🔄 Auto-rebuilding widget...');

        build({
          plugins: [preact(), cssInjectedByJsPlugin()],
          mode: 'development',
          build: createBuildConfig(true)
        })
          .then(() => {
            isBuilding = false;
            console.log('✅ Widget auto-rebuilt successfully!');
          })
          .catch(error => {
            isBuilding = false;
            console.error(`❌ Auto-build failed: ${error.message}`);
          });
      }
      return undefined;
    }
  };
};

export default defineConfig(({ command, mode }) => {
  if (command === 'build')
    return {
      plugins: [preact(), cssInjectedByJsPlugin()],
      build: createBuildConfig(mode === 'development')
    };

  return {
    plugins: [preact(), autoRebuildWidget()],
    server: {
      host: true,
      cors: true,
      port: 5173
    }
  };
});
