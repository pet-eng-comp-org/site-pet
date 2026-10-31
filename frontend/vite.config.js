import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // build/ é o que a imagem serve (Dockerfile); assets/ tem nome com hash e
  // cache de um ano (public/serve.json).
  build: { outDir: "build", emptyOutDir: true },
  // O HTML das páginas é gerado no build com tudo empacotado: pacotes antigos
  // em CommonJS (styled-components) não importam direito no Node sozinhos.
  ssr: { noExternal: true },
});
