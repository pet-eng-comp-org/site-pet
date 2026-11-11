import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="bloco hero">
      <div className="hero-texto">
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
    </section>
  );
};

export default Hero;
