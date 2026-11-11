import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useApi from "../../../services/useApi";
import Project from "../../Projects/Project/Project";
import "../../Projects/Projects.css";
import "./Vitrine.css";

// Três projetos na abertura da inicial, nos mesmos cartões da página
// Projetos, com o caminho para os outros. Até 1068 px eles viram um
// carrossel, com setas para quem não desliza. Sem a API, a abertura fica só
// com o texto.
const DESTAQUES = ["Topcom", "IntroComp", "PET Game Jam"];

const Seta = ({ lado }) => (
  <svg viewBox="0 0 36 36" aria-hidden="true" focusable="false">
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
  const projetos = DESTAQUES.map((t) => comissoes?.find((c) => c.title === t)).filter(Boolean);
  const trilho = useRef(null);
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
  const andar = (sentido) => {
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
    <div className="vitrine">
      <ul className="projetos-grade vitrine-grade" ref={trilho} onScroll={medir}>
        {projetos.map((c) => (
          <li key={c._id}>
            <Project title={c.title} description={c.description} icon={c.photos[0]} />
          </li>
        ))}
      </ul>
      <div className="vitrine-rodape">
        <p className="vitrine-todos">
          <Link className="link-mais" to="/projetos">
            Todos os projetos
          </Link>
        </p>
        <div className="vitrine-setas">
          <button type="button" aria-label="Projeto anterior" aria-disabled={limites.inicio} onClick={() => andar(-1)}>
            <Seta lado="anterior" />
          </button>
          <button type="button" aria-label="Próximo projeto" aria-disabled={limites.fim} onClick={() => andar(1)}>
            <Seta lado="proximo" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Vitrine;
