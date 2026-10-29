import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css";
import fotoGrupo from "../../../assets/grupo.jpg";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-conteudo">
        <div className="hero-texto">
          <p className="hero-sobretitulo">Programa de Educação Tutorial · Ufes</p>
          <h1>PET Engenharia de Computação</h1>
          <p className="hero-descricao">
            Somos estudantes de Engenharia de Computação da Ufes e um professor
            tutor. Fazemos ensino, pesquisa e extensão: o Topcom, o Game Jam,
            monitorias e muito mais.
          </p>
          <div className="hero-acoes">
            <Link to="/projetos" className="botao-principal">
              Conheça os projetos
            </Link>
            <Link to="/sobre" className="botao-link">
              Quem somos
            </Link>
          </div>
        </div>
        <img
          className="hero-foto"
          src={fotoGrupo}
          alt="Petianos reunidos no DiaPET 2020"
          width="1280"
          height="960"
        />
      </div>
    </section>
  );
};

export default Hero;
