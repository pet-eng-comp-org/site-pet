import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Uma cópia só do React. O mdbreact e outros pacotes do painel trazem o
  // React 16 dentro de node_modules próprios; o modal era desenhado por um
  // React e animado pelo outro, e não abria ("Minified React error #188").
  resolve: { dedupe: ["react", "react-dom"] },
  // build/ é o que a imagem serve (server/servidor.js); assets/ tem nome com
  // hash e cache de um ano.
  build: { outDir: "build", emptyOutDir: true },
  // O servidor gera as páginas com o React empacotado em build-ssr/, sem
  // node_modules na imagem; pacotes antigos em CommonJS (styled-components)
  // também não importariam direito no Node sozinhos.
  ssr: { noExternal: true },
});
