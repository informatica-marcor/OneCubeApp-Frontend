import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'robots.txt',
        'sitemap.xml',
        'favicon-96x96.png',
        'icons/web-app-manifest-192x192.png',
        'icons/web-app-manifest-512x512.png',
        'screenshots/1871x880.png',
        'screenshots/1080x2060.jpeg'
      ],
      manifest: {
        id: '/',
        name: 'OneCube',
        short_name: 'OneCube',
        description: 'Sistema de Control de Accesos',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#228be6',
        icons: [
          {
            src: '/favicon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: '/icons/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        screenshots: [
          {
            src: '/screenshots/1871x880.png',
            sizes: '1871x880',
            type: 'image/png',
            form_factor: 'wide'
          },
          {
            src: '/screenshots/1080x2060.jpeg',
            sizes: '1080x2060',
            type: 'image/jpeg',
            form_factor: 'narrow'
          }
        ]
      }
    })
  ]
})