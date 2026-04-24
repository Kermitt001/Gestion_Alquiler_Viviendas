import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Cambia 'Gestion_Alquiler_Viviendas' por el nombre exacto de tu repo en GitHub
  base: '/Gestion_Alquiler_Viviendas/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})
