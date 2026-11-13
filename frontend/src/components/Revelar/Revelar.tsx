"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Nas páginas internas, os títulos de seção e os cartões que estão abaixo da
// tela surgem quando chegam a 100 px dentro dela: sobem 30 px e aparecem
// (globals.css, [data-esperando]). O que já está à vista ao abrir a página,
// mesmo no pé dela, fica como está. A inicial e o painel não têm isso, e quem
// pede menos movimento vê tudo parado.
export default function Revelar() {
  const caminho = usePathname();
  useEffect(() => {
    if (caminho === "/" || caminho.startsWith("/admin")) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    // O que está abaixo da tela espera; a cada quadro de rolagem, o que já
    // chegou a 100 px dentro dela (ou passou, num salto) aparece. Sem
    // IntersectionObserver: num salto, o elemento vai de baixo para cima da
    // tela sem cruzá-la, o observador não avisa e ele ficaria escondido.
    // Só o que está todo abaixo da tela: o que já apareceu não some.
    let esperando = [...document.querySelectorAll<HTMLElement>("main .titulo-bloco, main [data-revela]")].filter(
      (el) => el.getBoundingClientRect().top >= window.innerHeight,
    );
    esperando.forEach((el) => el.setAttribute("data-esperando", ""));
    let quadro = 0;
    const conferir = () => {
      quadro = 0;
      const limite = window.innerHeight - 100;
      esperando = esperando.filter((el) => {
        if (el.getBoundingClientRect().top >= limite) return true;
        el.removeAttribute("data-esperando");
        return false;
      });
      if (!esperando.length) parar();
    };
    const pedir = () => {
      if (!quadro) quadro = requestAnimationFrame(conferir);
    };
    // O teclado que chega a um cartão escondido mostra o cartão na hora, sem
    // animação: o foco nunca fica em algo invisível.
    const aoFocar = (e: FocusEvent) => {
      const cartao = (e.target as Element).closest?.<HTMLElement>("[data-esperando]");
      if (!cartao) return;
      cartao.style.transition = "none";
      cartao.removeAttribute("data-esperando");
      void cartao.offsetWidth; // aplica o estado final antes de devolver a transição
      cartao.style.transition = "";
      esperando = esperando.filter((el) => el !== cartao);
    };
    // A página também muda sem rolar (a busca de Documentos filtra os
    // grupos e os de baixo sobem): confere de novo quando o conteúdo muda de
    // tamanho.
    const tamanho = new ResizeObserver(pedir);
    const principal = document.querySelector("main");
    if (principal) tamanho.observe(principal);
    const parar = () => {
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", pedir);
      document.removeEventListener("focusin", aoFocar);
      tamanho.disconnect();
    };
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);
    document.addEventListener("focusin", aoFocar);
    return () => {
      parar();
      cancelAnimationFrame(quadro);
      esperando.forEach((el) => el.removeAttribute("data-esperando"));
    };
  }, [caminho]);
  return null;
}
