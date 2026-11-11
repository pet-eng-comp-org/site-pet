import Link from "next/link";
import { FOLGA_DO_BLOCO as FOLGA } from "../Hero/Hero";

const HOVER_CLARO = "hover:border-transparent hover:bg-[#e6f2f2] hover:text-faixa-verde";
const FOTO = "aspect-[4/3] w-full rounded-[12px] object-cover";

// Centralizada como os blocos da página inicial: título, texto curto, os dois
// botões e as fotos embaixo, em branco sobre a faixa verde.
const AboutUs = () => {
  return (
    <section
      id="about-us"
      className={`mb-3 bg-faixa-verde px-(--margem) ${FOLGA} text-center text-white [&_:focus-visible]:outline-white`}
    >
      <div className="mx-auto max-w-[980px]">
        <h2 className="bloco-titulo">O que é o PET</h2>
        <p className="bloco-subtitulo">
          Um programa do MEC que une alunos de graduação e um professor tutor
          em ensino, pesquisa e extensão. O nosso existe desde 1993.
        </p>
        <div className="bloco-acoes">
          {/* Sobre o verde, o par se inverte: o cheio é branco com texto verde
              e o de contorno tem borda branca. No hover os dois ficam quase brancos. */}
          <Link href="/inscricoes" className={`botao-principal bg-white text-faixa-verde ${HOVER_CLARO}`}>
            Faça parte
          </Link>
          <a href="https://www.gov.br/mec/pt-br/pet" className={`botao-contorno border-white text-white ${HOVER_CLARO}`}>
            Site do MEC
          </a>
        </div>
        {/* Uma foto embaixo da outra só no celular; no tablet ainda cabem as duas. */}
        <div className="mt-10 grid grid-cols-2 gap-6 max-desktop:gap-4 max-tablet:grid-cols-1">
          <img
            className={FOTO}
            alt="Palestra no auditório durante a JACEE, a Jornada de Atualização em Computação, Elétrica e Eletrônica"
            src="/imagens/jacee.jpg"
            loading="lazy"
          />
          <img className={FOTO} alt="Participantes do Topcom" src="/imagens/topcom.webp" loading="lazy" />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
