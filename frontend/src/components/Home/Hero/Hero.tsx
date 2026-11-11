import Link from "next/link";
import Vitrine from "../Vitrine/Vitrine";
import "./Hero.css";

// A abertura da inicial: o nome do PET, o que ele faz e, no mesmo bloco, os
// três projetos mais conhecidos, que são a primeira coisa a ver.
const Hero = () => {
  return (
    <section className="bloco hero">
      <div className="hero-texto">
        <h1 className="bloco-titulo">PET Engenharia de Computação</h1>
        <p className="bloco-subtitulo">
          Ensino, pesquisa e extensão na Ufes: Topcom, Game Jam, monitorias e
          mais.
        </p>
        <p className="hero-link">
          <Link className="link-mais" href="/sobre">
            Quem somos
          </Link>
        </p>
      </div>
      <Vitrine />
    </section>
  );
};

export default Hero;
