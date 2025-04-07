import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Complaint Management System',
        short_name: 'CMS',
        description: 'A complaint management system for MANIT',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: '/logo/manit_sm.png',  // ✅ FIXED PATH
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo/manit_sm.png',  // ✅ FIXED PATH
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,json}'], // Cache all static assets
      }
    })
  ],
  server: {
    port: 5173
  }
});
