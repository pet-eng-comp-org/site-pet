"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Nas páginas internas, os títulos de seção e os cartões que estão abaixo da
// tela surgem quando chegam a 100 px dentro dela: sobem 30 px e aparecem
// (globals.css, [data-esperando]). O que já está à vista ao abrir a página
// fica como está. A inicial e o painel não têm isso, e quem pede menos
// movimento vê tudo parado.
export default function Revelar() {
  const caminho = usePathname();
  useEffect(() => {
    if (caminho === "/" || caminho.startsWith("/admin")) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    // O que está abaixo da tela espera; a cada quadro de rolagem, o que já
    // chegou a 100 px dentro dela (ou passou, num salto) aparece. Sem
    // IntersectionObserver: num salto, o elemento vai de baixo para cima da
    // tela sem cruzá-la, o observador não avisa e ele ficaria escondido.
    let esperando = [...document.querySelectorAll<HTMLElement>("main .titulo-bloco, main [data-revela]")].filter(
      (el) => el.getBoundingClientRect().top >= window.innerHeight - 100,
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
    const parar = () => {
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", pedir);
    };
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);
    return () => {
      parar();
      cancelAnimationFrame(quadro);
      esperando.forEach((el) => el.removeAttribute("data-esperando"));
    };
  }, [caminho]);
  return null;
}
