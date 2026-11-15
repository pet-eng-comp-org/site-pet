"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import slug from "../../utils/slug";

type Destino = { rotulo: string; href: string; externo?: boolean };
type Grupo = { titulo: string; grandes?: boolean; links: Destino[] };

// As comissões que cuidam do próprio PET (site, rede, artes). No painel,
// ficam em letra pequena; os projetos abertos a quem visita, em letra grande.
const COMISSOES = ["Dev", "Manutenção", "Pulga"];

// O que a lista de projetos e a de documentos trazem para os painéis.
export type DadosDoMenu = { projetos?: string[]; documentos?: string[] };

// Os itens do menu que têm painel. A inicial não tem.
export const temPainel = (href: string) => ["/sobre", "/projetos", "/documentos", "/contato", "/inscricoes"].includes(href);

// O conteúdo de cada painel: o primeiro grupo em letra grande (os destinos
// principais da página), os outros em letra pequena.
const grupos = (href: string, dados: DadosDoMenu): Grupo[] => {
  switch (href) {
    case "/sobre":
      return [
        {
          titulo: "Conhecer o PET",
          grandes: true,
          links: [
            { rotulo: "Quem somos", href: "/sobre" },
            { rotulo: "A equipe", href: "/sobre#equipe" },
          ],
        },
        {
          titulo: "Mais sobre o programa",
          links: [
            { rotulo: "Os outros grupos PET de Computação", href: "https://www.sbc.org.br/grupos-pet/", externo: true },
            { rotulo: "O PET no site do MEC", href: "https://www.gov.br/mec/pt-br/pet", externo: true },
          ],
        },
      ];
    case "/projetos": {
      const link = (p: string) => ({ rotulo: p, href: `/projetos/${slug(p)}` });
      const projetos = dados.projetos || [];
      const comissoes = projetos.filter((p) => COMISSOES.includes(p));
      return [
        {
          titulo: "Explorar projetos",
          grandes: true,
          links: [
            { rotulo: "Todos os projetos", href: "/projetos" },
            ...projetos.filter((p) => !COMISSOES.includes(p)).map(link),
          ],
        },
        ...(comissoes.length ? [{ titulo: "Comissões do PET", links: comissoes.map(link) }] : []),
      ];
    }
    case "/documentos":
      return [
        {
          titulo: "Explorar documentos",
          grandes: true,
          links: [
            { rotulo: "Todos os documentos", href: "/documentos" },
            ...(dados.documentos || []).map((d) => ({ rotulo: d, href: `/documentos#${slug(d)}` })),
          ],
        },
      ];
    case "/contato":
      return [
        {
          titulo: "Fale com a gente",
          grandes: true,
          links: [
            { rotulo: "Mandar uma mensagem", href: "/contato" },
            { rotulo: "Onde estamos", href: "/contato#onde-estamos" },
          ],
        },
        {
          titulo: "Outros canais",
          links: [
            { rotulo: "petengcomp@inf.ufes.br", href: "mailto:petengcomp@inf.ufes.br", externo: true },
            { rotulo: "Instagram", href: "https://www.instagram.com/petengcomp/", externo: true },
            { rotulo: "YouTube", href: "https://www.youtube.com/c/PETEngCompUfes", externo: true },
          ],
        },
      ];
    case "/inscricoes":
      return [
        {
          titulo: "Faça parte",
          grandes: true,
          links: [
            { rotulo: "Como entrar no PET", href: "/inscricoes" },
            { rotulo: "Quem pode se inscrever", href: "/inscricoes#requisitos" },
            { rotulo: "Editais anteriores", href: "/documentos#editais-de-selecao" },
          ],
        },
      ];
    default:
      return [];
  }
};

// O painel de um item do menu, no computador: desce da barra com os grupos
// lado a lado na coluna de 980 px. A altura dele vai para o Nav, que anima o
// fundo da barra (globals.css, .barra::before) e a cortina. Os links entram
// um a um (--grupo-atraso e --item) e saem juntos.
export default function PainelDoMenu({
  href,
  rotulo,
  dados,
  aoMedir,
  aoEscolher,
}: {
  href: string;
  rotulo: string;
  dados: DadosDoMenu;
  aoMedir: (altura: number) => void;
  aoEscolher: () => void;
}) {
  const conteudo = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = conteudo.current;
    if (!el) return undefined;
    const medir = () => aoMedir(el.offsetHeight);
    medir();
    const tamanho = new ResizeObserver(medir);
    tamanho.observe(el);
    return () => tamanho.disconnect();
  }, [aoMedir]);
  const lista = grupos(href, dados);
  const total = lista.reduce((n, g) => n + g.links.length, 0);
  let item = 0;
  return (
    <div id={`painel-${href.slice(1)}`} className="painel-menu" role="group" aria-label={rotulo}>
      <div ref={conteudo} className="painel-menu-conteudo" style={{ "--total": total } as CSSProperties}>
        {lista.map((g, i) => (
          // O primeiro grupo começa na hora; o segundo, 80 ms depois; cada
          // um dos seguintes, mais 40 ms.
          <div
            key={g.titulo}
            className={g.grandes ? "painel-grupo painel-grupo-grande" : "painel-grupo"}
            style={{ "--grupo-atraso": `${i === 0 ? 0 : 80 + (i - 1) * 40}ms` } as CSSProperties}
          >
            <h2 className="painel-titulo">{g.titulo}</h2>
            <ul>
              {g.links.map((l) => {
                const n = item++;
                return (
                  <li key={l.href} className="painel-item" style={{ "--item": n } as CSSProperties}>
                    {l.externo ? (
                      <a
                        href={l.href}
                        target={l.href.startsWith("mailto:") ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        onClick={aoEscolher}
                      >
                        {l.rotulo}
                      </a>
                    ) : (
                      <Link href={l.href} onClick={aoEscolher}>
                        {l.rotulo}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
