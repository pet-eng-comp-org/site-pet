"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import useApi from "../../../services/useApi";
import Project from "../../Projects/Project/Project";
import { LINK_DE_TOQUE } from "../Hero/Hero";

// As setas: círculos cinza de 36 px, com 44 px de área de toque (o ::after).
// Desligada, só o círculo e a seta esmaecem, e o contorno de foco fica inteiro.
const SETA =
  "group relative grid size-9 cursor-pointer place-items-center rounded-full border-0 bg-[rgba(210,210,215,0.64)] p-0 text-[rgba(0,0,0,0.56)] transition-colors duration-100 ease-linear after:absolute after:-inset-1 hover:not-aria-disabled:bg-[rgba(223,223,227,0.7)] hover:not-aria-disabled:text-[rgba(0,0,0,0.64)] aria-disabled:cursor-default aria-disabled:bg-[rgba(210,210,215,0.27)]";

// Três projetos na abertura da inicial, nos mesmos cartões da página
// Projetos, com o caminho para os outros. Até 1068 px eles viram um
// carrossel, com setas para quem não desliza. Sem a API, a abertura fica só
// com o texto.
const DESTAQUES = ["Topcom", "IntroComp", "PET Game Jam"];

const Seta = ({ lado }: { lado: "anterior" | "proximo" }) => (
  <svg
    className="size-9 transition-opacity duration-100 ease-linear group-aria-disabled:opacity-[0.42]"
    viewBox="0 0 36 36"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d={lado === "anterior" ? "M21 11l-7 7 7 7" : "M15 11l7 7-7 7"}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Vitrine = () => {
  const comissoes = useApi("api/comissions").data?.comissions;
  const projetos = DESTAQUES.map((t) => comissoes?.find((c) => c.title === t)).filter((c) => c !== undefined);
  const trilho = useRef<HTMLUListElement>(null);
  const [limites, setLimites] = useState({ inicio: true, fim: false });

  // Liga ou desliga cada seta conforme o carrossel chegou a uma ponta.
  const medir = () => {
    const t = trilho.current;
    if (!t) return;
    setLimites({
      inicio: t.scrollLeft <= 1,
      fim: t.scrollLeft + t.clientWidth >= t.scrollWidth - 1,
    });
  };

  useEffect(() => {
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, [projetos.length]);

  // As setas usam aria-disabled em vez de disabled: um botão desligado perde
  // o foco, e quem navega pelo teclado ficaria sem saber onde está.
  // Anda um cartão (a largura dele mais o espaço entre eles).
  const andar = (sentido: number) => {
    if (sentido < 0 ? limites.inicio : limites.fim) return;
    const t = trilho.current;
    const cartao = t?.firstElementChild;
    if (!cartao) return;
    const passo = cartao.getBoundingClientRect().width + parseFloat(getComputedStyle(t).columnGap);
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    t.scrollBy({ left: sentido * passo, behavior: reduzir ? "auto" : "smooth" });
  };

  if (!projetos.length) return null;
  return (
    // Os três cartões na coluna de 980 px, com o texto à esquerda.
    <div className="mx-auto mt-[36px] box-content max-w-[980px] px-(--margem) text-left max-desktop:max-w-none max-desktop:px-0 max-tablet:mt-[20px]">
      {/* Até 1068 px, um carrossel: cartões de 344 px (260 no celular), 20 px
          entre eles, o primeiro na margem da página e o seguinte aparecendo na
          borda. Cada deslize para no começo de um cartão, e a folga em cima e
          embaixo deixa a sombra do cartão à vista. */}
      <ul
        className="mt-10 mb-0 grid list-none gap-5 p-0 desktop:grid-cols-3 max-desktop:mt-0 max-desktop:snap-x max-desktop:snap-mandatory max-desktop:auto-cols-[344px] max-desktop:grid-flow-col max-desktop:scroll-px-(--margem) max-desktop:overflow-x-auto max-desktop:px-(--margem) max-desktop:pt-[8px] max-desktop:pb-[24px] max-desktop:[scrollbar-width:none] max-tablet:auto-cols-[260px] max-desktop:[&::-webkit-scrollbar]:hidden"
        ref={trilho}
        onScroll={medir}
      >
        {projetos.map((c) => (
          <li key={c._id} className="max-desktop:snap-start">
            <Project title={c.title} description={c.description} icon={c.photos[0]} />
          </li>
        ))}
      </ul>
      <div className="mt-[20px] flex items-center justify-between gap-4 max-desktop:mt-[4px] max-desktop:px-(--margem)">
        <p className="m-0">
          <Link className={`link-mais ${LINK_DE_TOQUE}`} href="/projetos">
            Todos os projetos
          </Link>
        </p>
        {/* Nas telas largas cabem os três lado a lado: sem setas. */}
        <div className="hidden gap-[18px] max-desktop:flex">
          <button type="button" className={SETA} aria-label="Projeto anterior" aria-disabled={limites.inicio} onClick={() => andar(-1)}>
            <Seta lado="anterior" />
          </button>
          <button type="button" className={SETA} aria-label="Próximo projeto" aria-disabled={limites.fim} onClick={() => andar(1)}>
            <Seta lado="proximo" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Vitrine;
