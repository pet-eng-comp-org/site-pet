import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjetoPagina from "../../../components/Projects/ProjetoPagina/ProjetoPagina";
import { ComDadosIniciais } from "../../../services/useApi";
import { buscar } from "../../../services/dadosDoServidor";
import { API } from "../../../services/apiUrl";
import { PREVIA, fora } from "../../../services/metadados";
import slug from "../../../utils/slug";
import type { Comissao } from "../../../tipos";

type Props = { params: Promise<{ projeto: string }> };

// A lista guardada pode não ter um projeto criado agora: antes de dizer que
// não existe, confere na API.
const projetos = async (projeto: string) => {
  const lista = await buscar("api/comissions");
  if (lista && !lista.comissions.some((c) => slug(c.title) === projeto))
    return (await buscar("api/comissions", { fresco: true })) || lista;
  return lista;
};

// A primeira frase da descrição, para a prévia do link. Passando de 200
// caracteres, corta no fim de uma palavra, com reticências: cortada no meio,
// "Tutorial" virava "Tutoria" e parecia erro.
const primeiraFrase = (texto: string) => {
  const frase = (texto.match(/^.*?[.!?](\s|$)/s)?.[0] || texto).trim();
  if (frase.length <= 200) return frase;
  return `${frase.slice(0, 200).replace(/\s+\S*$/, "").replace(/[\s,;:]+$/, "")}…`;
};

// A primeira foto deitada ou quadrada da galeria: a prévia do link é larga, e
// foto em pé sai cortada. Sem nenhuma, fica a imagem padrão do site.
const fotoDoProjeto = (c: Comissao) => {
  const deitada = c.photos.slice(1).find((id) => {
    const m = (c.medidas || []).find((f) => f._id === id);
    return m?.width && m.height && m.width >= m.height;
  });
  return deitada ? `${API}api/file/getComissionPhoto/${deitada}?largura=800` : undefined;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { projeto } = await params;
  const lista = await projetos(projeto);
  const c = lista?.comissions.find((x) => slug(x.title) === projeto);
  // Projeto que não existe: o 404 sai aqui, antes do começo da página, para
  // vir com o status e o texto no HTML.
  if (lista && !c) return fora("Página não encontrada");
  // Sem a API não dá para saber se o projeto existe: a página sai com o aviso
  // de falha, fora dos buscadores.
  if (!c) return fora("Projetos");
  const descricao = primeiraFrase(c.description);
  const imagem = fotoDoProjeto(c);
  return {
    title: c.title,
    description: descricao,
    alternates: { canonical: `/projetos/${projeto}` },
    openGraph: {
      ...PREVIA,
      title: `${c.title} · PET Eng Comp Ufes`,
      description: descricao,
      url: `/projetos/${projeto}`,
      ...(imagem && { images: [{ url: imagem }] }),
    },
  };
}

export default async function Projeto({ params }: Props) {
  const { projeto } = await params;
  const lista = await projetos(projeto);
  if (lista && !lista.comissions.some((c) => slug(c.title) === projeto)) notFound();
  return (
    <ComDadosIniciais dados={lista ? { "api/comissions": { data: lista } } : {}}>
      <ProjetoPagina projeto={projeto} />
    </ComDadosIniciais>
  );
}
