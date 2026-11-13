"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import useApi from "../../services/useApi";
import slug from "../../utils/slug";

// O nome de cada página no caminho do rodapé.
const NOMES: Record<string, string> = {
  "/sobre": "Quem somos",
  "/projetos": "Projetos",
  "/documentos": "Documentos",
  "/contato": "Contato",
  "/inscricoes": "Faça parte",
  "/login": "Entrar no painel",
  "/admin": "Painel",
};

// O nome do projeto vem da lista de projetos, buscada pelo navegador:
// levá-la no HTML de toda página (13 KB) só para o rodapé não compensa, e o
// nome chega antes de alguém rolar até aqui. Até lá, o caminho para em
// "Projetos".
function NomeDoProjeto({ projeto }: { projeto: string }) {
  const lista = useApi("api/comissions");
  if (!lista.data) return null;
  const c = lista.data.comissions.find((x) => slug(x.title) === projeto);
  return <Nivel>{c ? c.title : "Página não encontrada"}</Nivel>;
}

// Um nível: a seta e o nome (ou o link, se houver um nível depois).
function Nivel({ href, children }: { href?: string; children: string }) {
  return (
    <li className="mr-[7px] flex h-[22px] items-center pl-[4px] before:mr-[11px] before:block before:h-[11px] before:w-[6px] before:bg-[rgba(0,0,0,0.48)] before:content-[''] before:[mask:var(--seta-fina)_center/contain_no-repeat]">
      {href ? (
        <Link href={href} className="text-inherit no-underline hover:underline">
          {children}
        </Link>
      ) : (
        <span>{children}</span>
      )}
    </li>
  );
}

// Onde a pessoa está: o símbolo (que leva ao início) e o nome da página, no
// topo do rodapé de toda página menos a inicial. Endereço que não existe
// mostra "Página não encontrada".
export default function Caminho() {
  const caminho = usePathname();
  if (caminho === "/") return null;
  const [, primeiro, segundo] = caminho.split("/");
  const raiz = `/${primeiro}`;
  const projeto = raiz === "/projetos" && segundo ? segundo : null;
  const nome = raiz === "/admin" ? NOMES["/admin"] : NOMES[caminho] || (projeto ? NOMES["/projetos"] : "Página não encontrada");
  return (
    // A linha embaixo só no celular; no computador, o respiro basta.
    <nav aria-label="Caminho" className="flex items-center pb-[17px] text-[rgba(0,0,0,0.72)] max-tablet:mb-[17px] max-tablet:border-b max-tablet:border-separador">
      <Link
        href="/"
        className="block h-[18px] w-[14px] flex-none bg-current text-inherit [mask:url(/imagens/logo_pet_simbolo.svg)_center/contain_no-repeat]"
      >
        <span className="sr-only">Início</span>
      </Link>
      <ol className="m-0 ml-[11px] flex list-none flex-wrap p-0">
        <Nivel href={projeto ? "/projetos" : undefined}>{nome}</Nivel>
        {projeto && <NomeDoProjeto projeto={projeto} />}
      </ol>
    </nav>
  );
}
