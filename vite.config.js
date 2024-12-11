import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';
import viteJsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig({
  plugins: [react(), viteJsconfigPaths()],
  build: {
    outDir: 'dist'
  },
  server: {
    port: 3000
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Opcional: para importar variables globales
        // additionalData: `@import "./src/styles/variables.scss";`
      }
    }
  }
  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, 'src')
  //   }
  // },
});
