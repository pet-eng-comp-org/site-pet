"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Quem volta pelo navegador a uma página (Voltar ou Avançar) chega por um
// popstate; a lista de projetos usa isso para voltar à posição em que estava.
let voltou = false;
export const chegouVoltando = () => voltou;

// Ao trocar de página, o foco vai para o conteúdo novo: sem isso ele ficava
// no link clicado (ou no body), e o leitor de tela não anunciava a página.
const Navegacao = () => {
  const pathname = usePathname();
  const primeira = useRef(true);

  useEffect(() => {
    // O script do layout tira a classe antes da primeira pintura; na página de
    // erro do Next (o 404 de um projeto) ele não roda, e o menu do celular
    // ficaria aberto como se não houvesse JavaScript.
    document.documentElement.classList.remove("sem-js");
    const aoVoltar = () => {
      voltou = true;
    };
    window.addEventListener("popstate", aoVoltar);
    return () => window.removeEventListener("popstate", aoVoltar);
  }, []);

  useEffect(() => {
    if (primeira.current) {
      primeira.current = false;
      return;
    }
    document.querySelector<HTMLElement>("main")?.focus({ preventScroll: true });
    // Vale só para a página a que se voltou: a próxima troca começa do zero.
    const t = setTimeout(() => {
      voltou = false;
    });
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
};

export default Navegacao;
