import Link from "next/link";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <section className="bloco green-bg about-us" id="about-us">
      <div className="secao">
        <h2 className="bloco-titulo">O que é o PET</h2>
        <p className="bloco-subtitulo">
          Um programa do MEC que une alunos de graduação e um professor tutor
          em ensino, pesquisa e extensão. O nosso existe desde 1993.
        </p>
        <div className="bloco-acoes">
          <Link href="/inscricoes" className="botao-principal">
            Faça parte
          </Link>
          <a href="https://www.gov.br/mec/pt-br/pet" className="botao-contorno">
            Site do MEC
          </a>
        </div>
        <div className="about-us-fotos">
          <img alt="Palestra no auditório durante a JACEE, a Jornada de Atualização em Computação, Elétrica e Eletrônica" src="/imagens/jacee.jpg" loading="lazy" />
          <img alt="Participantes do Topcom" src="/imagens/topcom.webp" loading="lazy" />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
