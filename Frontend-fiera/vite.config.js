import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permite acceso externo
    allowedHosts: ['bjfv5l-ip-186-86-52-214.tunnelmole.net'] // Cambia esto si el dominio cambia
  }
})
