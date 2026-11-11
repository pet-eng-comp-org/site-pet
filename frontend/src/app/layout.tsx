import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Nav from "../components/Navbar/Nav";
import Footer from "../components/Footer/Footer";
import Navegacao from "../components/Navegacao/Navegacao";
import { ComDadosIniciais } from "../services/useApi";
import { buscarVarios } from "../services/dadosDoServidor";
import { SITE, DESCRICAO, PREVIA } from "../services/metadados";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "PET Engenharia de Computação · Ufes", template: "%s · PET Eng Comp Ufes" },
  description: DESCRICAO,
  openGraph: { ...PREVIA, title: "PET Engenharia de Computação · Ufes", description: DESCRICAO, url: "/" },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
  manifest: "/manifest.json",
};

export const viewport: Viewport = { themeColor: "#1d1d1f" };

// Toda página é montada a cada visita, com os dados da API (guardados 30 s).
export const dynamic = "force-dynamic";

export default async function Layout({ children }: { children: ReactNode }) {
  // A faixa de inscrições abertas aparece em todas as páginas.
  const dados = await buscarVarios(["api/selection/openSelection"]);
  return (
    // sem-js sai antes da primeira pintura: com JavaScript, o menu do celular
    // abre pelo botão; sem ele, a classe fica e os links ficam à vista.
    <html lang="pt-br" className="sem-js" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.classList.remove("sem-js")' }} />
        {/* A fonte dos títulos vem antes do primeiro desenho da página: se
            chegasse depois, o texto mudaria de tamanho e empurraria o resto. */}
        <link
          rel="preload"
          href="/fonts/sofia-sans-condensed-normal-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link rel="stylesheet" href="/fonts/stylesheet.css" />
      </head>
      <body>
        <ComDadosIniciais dados={dados}>
          <div className="App">
            <Nav />
            <Navegacao />
            {/* Leitor de tela usa o <main> para pular direto ao conteúdo. */}
            <main className="conteudo" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </div>
        </ComDadosIniciais>
      </body>
    </html>
  );
}
