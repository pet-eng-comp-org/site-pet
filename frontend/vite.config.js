import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Uma cópia só do React, mesmo que um pacote traga outra em node_modules
  // próprio: em 31/10/2026 o mdbreact trazia o React 16, e as janelas do
  // painel antigo eram desenhadas por um React e animadas pelo outro.
  resolve: { dedupe: ["react", "react-dom"] },
  // build/ é o que a imagem serve (server/servidor.js); assets/ tem nome com
  // hash e cache de um ano.
  build: { outDir: "build", emptyOutDir: true },
  // O servidor gera as páginas com o React empacotado em build-ssr/, sem
  // node_modules na imagem; pacotes antigos em CommonJS (styled-components)
  // também não importariam direito no Node sozinhos.
  ssr: { noExternal: true },
});
