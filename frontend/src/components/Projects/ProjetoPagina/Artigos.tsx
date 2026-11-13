import Icone from "../../Icone/Icone";

// Os artigos que o PET publicou, por projeto, do mais novo para o mais
// antigo. O link vai para os anais do evento; artigo sem anais públicos fica
// em public/artigos. Artigo novo: uma linha aqui.
interface Artigo {
  titulo: string;
  evento: string;
  link: string;
}

const ARTIGOS: Record<string, Artigo[]> = {
  pesquisa: [
    {
      titulo: "Engajamento na monitoria e desempenho na disciplina de Programação II: uma análise quantitativa",
      evento: "ENAPET 2026",
      link: "/artigos/enapet-2026-monitoria-programacao-2.pdf",
    },
    {
      titulo:
        "Jogos digitais como estratégia de divulgação científica e orientação vocacional em Computação: a experiência do PET Game Jam",
      evento: "ENAPET 2025",
      link: "https://static.even3.com/anais/1380692.pdf",
    },
    {
      titulo:
        "Programação competitiva como ferramenta de formação e extensão universitária: um relato de experiência no Espírito Santo",
      evento: "ENAPET 2025",
      link: "https://static.even3.com/anais/1380446.pdf",
    },
    {
      titulo: "Um panorama da participação feminina nas iniciativas do PET Engenharia de Computação da Ufes",
      evento: "Sudeste PET 2025",
      link: "https://static.even3.com/anais/1091821.pdf",
    },
    {
      titulo: "Fomentando a computação através de jogos: a experiência do PET Game Jam",
      evento: "Sudeste PET 2025",
      link: "/artigos/sudeste-pet-2025-pet-game-jam.pdf",
    },
  ],
};

export const temArtigos = (projeto: string) => projeto in ARTIGOS;

// Uma linha por artigo, como os PDFs da página Documentos: ícone e título,
// e o evento embaixo. A coluna é a mesma da abertura, de 600 px.
function Artigos({ projeto }: { projeto: string }) {
  const lista = ARTIGOS[projeto];
  if (!lista) return null;
  return (
    <section className="mx-auto mt-16 max-w-[600px]" aria-labelledby="titulo-artigos">
      <h2 id="titulo-artigos">Artigos</h2>
      <ul className="m-0 list-none p-0">
        {lista.map((a) => (
          <li key={a.link} className="border-b border-linha">
            <a
              className="flex items-start gap-3 py-4 text-texto no-underline hover:text-link focus:text-link"
              href={a.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icone nome="pdf" className="mt-[3px] shrink-0 text-17 text-acao" />
              <span>
                <span className="block text-17 font-semibold text-balance">{a.titulo}</span>
                <span className="mt-1 block text-14 text-texto-suave">{a.evento}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Artigos;
