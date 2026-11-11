import type { Metadata } from "next";
import Painel from "../../../components/Painel/Painel";
import { fora } from "../../../services/metadados";

const NOMES: Record<string, string> = {
  petianos: "Petianos",
  projetos: "Projetos",
  documentos: "Documentos",
  noticias: "Notícias",
  selecoes: "Seleções",
};

type Props = { params: Promise<{ secao?: string[] }> };

// "Projetos · Painel": a aba diz em que seção a pessoa está.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const nome = NOMES[(await params).secao?.[0] ?? ""];
  return fora(nome ? `${nome} · Painel` : "Painel");
}

export default function Admin() {
  return <Painel />;
}
