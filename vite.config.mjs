import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/glasscraft/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0] ?? '';
          return name.endsWith('.css') ? 'assets/glasscraft.css' : 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
});
