import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('redux') || id.includes('@reduxjs')) return 'vendor';
            if (id.includes('three') || id.includes('@react-three')) return 'three';
            if (id.includes('gsap') || id.includes('framer-motion') || id.includes('animejs')) return 'animation';
            if (id.includes('@react-google-maps') || id.includes('leaflet') || id.includes('react-leaflet')) return 'maps';
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
