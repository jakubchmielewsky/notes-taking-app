import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    svgr(),
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.API_PORT ?? 3000}`,
        changeOrigin: true,
      },
    },
  },
})
