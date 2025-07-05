import { defineConfig } from "vite"
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Adjust the target to your backend server
        changeOrigin: true,
      },
    },
    allowedHosts: [
      '2b8a-2409-40c2-804a-49c5-651f-4a51-bcd8-463c.ngrok-free.app',
    ],
  },
})
