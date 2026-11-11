import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O Dockerfile copia só o servidor mínimo que o Next gera em
  // .next/standalone, com as dependências que o código usa.
  output: "standalone",
  poweredByHeader: false,
  // O repositório tem outro lockfile na raiz; o app é só esta pasta.
  turbopack: { root: import.meta.dirname },
  outputFileTracingRoot: import.meta.dirname,
  // Endereço antigo da página de inscrição, que ainda circula.
  async redirects() {
    return [
      { source: "/subscription", destination: "/inscricoes", statusCode: 301 },
      { source: "/subscription/:resto*", destination: "/inscricoes", statusCode: 301 },
    ];
  },
};

export default nextConfig;
