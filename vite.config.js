import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    mkcert(), // Enable mkcert for HTTPS
  ],
  server: {
    https: true,          // Enable HTTPS
    host: 'localhost',    // Listen on localhost
    port: 5173,           // Optional: specify port
  },
})
