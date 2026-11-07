import React from "react";
import { Link } from "react-router-dom";
import "./AboutUs.css";

import imagemNos2 from "../../../assets/jacee.jpg";
import imagemNos3 from "../../../assets/topcom.webp";

const AboutUs = () => {
  return (
    <section className="green-bg about-us" id="about-us">
      <div className="secao">
        <h2 className="titulo-bloco">O que é o PET</h2>
        <p>
          Um programa do MEC que une alunos de graduação e um professor tutor
          em ensino, pesquisa e extensão. O nosso existe desde 1993.
        </p>
        <div className="about-us-acoes">
          <Link to="/inscricoes" className="botao-principal">
            Faça parte
          </Link>
          <a href="https://www.gov.br/mec/pt-br/pet" className="botao-contorno">
            Site do MEC
          </a>
        </div>
        <div className="about-us-fotos">
          <img alt="Palestra no auditório durante a JACEE, a Jornada de Atualização em Computação, Elétrica e Eletrônica" src={imagemNos2} loading="lazy" />
          <img alt="Participantes do Topcom" src={imagemNos3} loading="lazy" />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
