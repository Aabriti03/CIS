import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  root: resolve(__dirname, '.'), // force root to current folder
  plugins: [react()],
  // ✅ Add this block so calls like "/api/..." go to your backend
  server: {
    proxy: {
      // Forward anything starting with /api to your backend
      '/api': {
        target: 'http://localhost:5001', // <-- backend port (set PORT=5001 in backend/.env)
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
