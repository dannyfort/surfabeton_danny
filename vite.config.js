import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    strictPort: false,
    // Séquence scroll-vidéo : ~120 frames régénérées d'un coup → on
    // exclut le dossier du watch pour éviter les reloads en rafale.
    watch: {
      ignored: ['**/public/seq/**'],
    },
  },
  build: {
    target: 'es2020',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap'],
        },
      },
    },
  },
});
