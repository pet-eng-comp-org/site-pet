import React from "react";
import { Link } from "react-router-dom";
import "./AboutUs.css";

import imagemNos2 from "../../../assets/jacee.jpg";
import imagemNos3 from "../../../assets/topcom.webp";

const AboutUs = () => {
  return (
    <section className="green-bg about-us" id="about-us">
      <div className="secao">
        <h2>O que é o PET</h2>
        <p>
          O Programa de Educação Tutorial, do MEC, reúne alunos de graduação e
          um professor tutor em atividades de ensino, pesquisa e extensão. Na
          Ufes são 13 grupos, e o nosso é um dos originais, de 1993.{" "}
          <a href="https://www.gov.br/mec/pt-br/pet">Saiba mais no site do MEC</a>.
        </p>
        <div className="about-us-fotos">
          <img alt="Petianos na JACEE" src={imagemNos2} loading="lazy" />
          <img alt="Participantes do Topcom" src={imagemNos3} loading="lazy" />
        </div>
        <p>
          Quer fazer parte? <Link to="/inscricoes">Veja como entrar</Link>.
        </p>
      </div>
    </section>
  );
};

export default AboutUs;
