import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages'a dağıtım için 'base' yolunu depo adınızla güncelleyin.
  // Örn: https://<kullanici_adiniz>.github.io/<depo_adiniz>/ adresinde yayınlanacaksa,
  // base: '/<depo_adiniz>/' olmalıdır.
  base: '/gercek-zamanli-sohbet/', 
})
