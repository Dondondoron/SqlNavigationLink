import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    // Output bundle straight into the main extension's media folder
    outDir: path.resolve(__dirname, '../media/lineageViewer'),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Keeps bundle names predictable for your Webview Provider
        entryFileNames: 'index.js',
        assetFileNames: 'index.[ext]'
      }
    }
  }
});