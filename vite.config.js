import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const BACKEND_URL = "https://desenvolvimento-web-2025-5vis.onrender.com"; 

const csp = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: http://localhost:3000 ${BACKEND_URL}/uploads https://placehold.co https://picsum.photos`,
  "font-src 'self'",
  `connect-src 'self' http://localhost:3000 ${BACKEND_URL}`, 
  "base-uri 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
].join("; ");

export default defineConfig({
  plugins: [react()],
  base: "/react-frontend-redesocial/",
  preview: {
    headers: {
      "Content-Security-Policy": csp,
    },
  },
})
