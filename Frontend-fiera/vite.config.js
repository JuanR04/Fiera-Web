/* eslint-disable no-undef */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

// Carga las variables de entorno
dotenv.config()

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [process.env.VITE_HOST_TUNNEL]
  }
})
