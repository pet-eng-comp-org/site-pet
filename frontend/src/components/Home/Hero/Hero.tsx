import Link from "next/link";
import Vitrine from "../Vitrine/Vitrine";

// A folga dos blocos da inicial, por degrau: 56/63 px, 61/69 até 1068 px e
// 39/43 até 734 px.
export const FOLGA_DO_BLOCO =
  "pt-[56px] pb-[63px] max-desktop:pt-[61px] max-desktop:pb-[69px] max-tablet:pt-[39px] max-tablet:pb-[43px]";

// O "Quem somos ›" e o "Todos os projetos ›": 44 px de altura de toque, e o
// contorno de foco acompanha a área com cantos arredondados.
export const LINK_DE_TOQUE = "inline-flex min-h-[44px] items-center focus-visible:rounded-[8px]";

// A abertura da inicial: o nome do PET, o que ele faz e, no mesmo bloco, os
// três projetos mais conhecidos, que são a primeira coisa a ver.
const Hero = () => {
  return (
    <section className={`mb-3 bg-superficie ${FOLGA_DO_BLOCO} text-center`}>
      <div className="px-(--margem)">
        {/* Do tamanho do título das outras páginas: 72 px, 56 até 1068 px, 48 até 734 px. */}
        <h1 className="bloco-titulo text-[4.5rem] leading-[1.1] text-texto max-desktop:text-[3.5rem] max-tablet:text-[3rem]">PET Engenharia de Computação</h1>
        <p className="bloco-subtitulo">
          Ensino, pesquisa e extensão na Ufes: Topcom, Game Jam, monitorias e
          mais.
        </p>
        {/* A margem desconta a folga do toque: o texto fica 17 px abaixo do
            subtítulo (16 e 11 nos degraus menores). */}
        <p className="mt-[5px] mb-0 max-desktop:mt-[4px] max-tablet:mt-0">
          <Link className={`link-mais ${LINK_DE_TOQUE}`} href="/sobre">
            Quem somos
          </Link>
        </p>
      </div>
      <Vitrine />
    </section>
  );
};

export default Hero;
