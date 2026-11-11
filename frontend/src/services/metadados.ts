import type { Metadata } from "next";

export const SITE = "https://pet.inf.ufes.br";
// O que toda prévia de link leva; cada página troca o título, a descrição e,
// se tiver, a imagem.
export const PREVIA: {
  type: "website";
  siteName: string;
  images: { url: string; width?: number; height?: number }[];
} = {
  type: "website",
  siteName: "PET Eng Comp Ufes",
  images: [{ url: "/compartilhar.png", width: 1200, height: 630 }],
};

export const DESCRICAO =
  "Alunos de Engenharia de Computação da Ufes e um professor tutor em projetos de ensino, pesquisa e extensão.";

// Página indexada: título, descrição (sem ela, a página não é indexada),
// endereço canônico e a prévia do link compartilhado.
export const pagina = (titulo: string, descricao: string, caminho: string): Metadata => ({
  title: titulo,
  description: descricao,
  alternates: { canonical: caminho },
  openGraph: {
    ...PREVIA,
    title: `${titulo} · PET Eng Comp Ufes`,
    description: descricao,
    url: caminho,
  },
});

// Página sem texto público (login, painel) ou que não existe: fora dos buscadores.
export const fora = (titulo: string): Metadata => ({
  title: titulo,
  robots: { index: false },
  openGraph: { ...PREVIA, title: `${titulo} · PET Eng Comp Ufes` },
});
