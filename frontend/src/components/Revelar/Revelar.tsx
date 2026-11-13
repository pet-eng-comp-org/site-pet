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
    const elementos = [...document.querySelectorAll<HTMLElement>("main .titulo-bloco, main [data-revela]")];
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          // Também o que ficou para trás num salto de rolagem (voltar à
          // lista de projetos, por exemplo), para nada sumir acima da tela.
          if (!e.isIntersecting && e.boundingClientRect.top > 0) continue;
          e.target.removeAttribute("data-esperando");
          observador.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -100px 0px" },
    );
    for (const el of elementos) {
      if (el.getBoundingClientRect().top < window.innerHeight - 100) continue;
      el.setAttribute("data-esperando", "");
      observador.observe(el);
    }
    return () => {
      observador.disconnect();
      elementos.forEach((el) => el.removeAttribute("data-esperando"));
    };
  }, [caminho]);
  return null;
}
