import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

// Largura em que a foto aparece; o mesmo valor está no preload do index.html,
// que pede a foto antes de o JavaScript chegar.
const TAMANHO_FOTO =
  "(max-width: 1068px) 87.5vw, 980px";

const Hero = () => {
  return (
    <section className="bloco hero">
      <div className="hero-conteudo">
        <div className="hero-texto">
          <p className="hero-sobretitulo">Programa de Educação Tutorial · Ufes</p>
          <h1 className="bloco-titulo">PET Engenharia de Computação</h1>
          <p className="bloco-subtitulo">
            Ensino, pesquisa e extensão na Ufes: Topcom, Game Jam, monitorias e
            mais.
          </p>
          <div className="bloco-acoes">
            <Link to="/projetos" className="botao-principal">
              Conheça os projetos
            </Link>
            <Link to="/sobre" className="botao-contorno">
              Quem somos
            </Link>
          </div>
        </div>
        <img
          className="hero-foto"
          src={`/grupo-1280.jpg`}
          srcSet={`/grupo-700.jpg 700w, /grupo-1280.jpg 1280w`}
          sizes={TAMANHO_FOTO}
          alt="Petianos reunidos no DiaPET 2020"
          width="1280"
          height="960"
        />
      </div>
    </section>
  );
};

export default Hero;
