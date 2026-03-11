import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync, mkdirSync } from 'fs'

/** Vite plugin that copies splash.html into the main-process output directory. */
function copySplashPlugin() {
  return {
    name: 'copy-splash-html',
    closeBundle() {
      const src = resolve(__dirname, 'src/main/splash.html')
      const outDir = resolve(__dirname, 'out/main')
      if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })
      copyFileSync(src, resolve(outDir, 'splash.html'))
    },
  }
}

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), copySplashPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/main/index.ts')
        }
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/preload/index.ts')
        }
      }
    }
  },
  renderer: {
    plugins: [react()],
    root: resolve(__dirname, 'src/renderer'),
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html')
        }
      }
    },
    resolve: {
      alias: {
        '@renderer': resolve(__dirname, 'src/renderer')
      }
    }
  }
})
