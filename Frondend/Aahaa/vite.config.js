// vite.config.js
import { defineConfig } from 'vite'  // This import was missing
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://aahaa-backend.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
