import React from "react";
import { Link } from "react-router-dom";
import "./AboutUs.css";

import imagemNos2 from "../../../assets/jacee.jpg";
import imagemNos3 from "../../../assets/topcom.jpg";

const AboutUs = () => {
  return (
    <section className="green-bg about-us" id="about-us">
      <div className="secao">
        <h2>Um pouco sobre nós</h2>
        <p>
          Somos o grupo PET (Programa de Educação Tutorial) do curso de
          Engenharia de Computação da Ufes, orientado por um professor tutor.
          Não sabe o que é o PET?{" "}
          <a href="http://portal.mec.gov.br/pet">Conheça o programa</a>.
        </p>
        <div className="about-us-fotos">
          <img alt="Petianos na JACEE" src={imagemNos2} loading="lazy" />
          <img alt="Participantes do Topcom" src={imagemNos3} loading="lazy" />
        </div>
        <p>
          Desenvolvemos diversas atividades de ensino, pesquisa e extensão a fim
          de promover crescimento acadêmico e pessoal, e tentamos manter um bom
          contato com os demais graduandos dos cursos de computação da Ufes.
          Nossa porta está sempre aberta!
        </p>
        <p>
          Conheça <Link to="/sobre">um pouco mais sobre nós</Link> e descubra os{" "}
          <Link to="/projetos">nossos projetos</Link>! Acesse também o{" "}
          <a href="http://pet.ufes.br/">site do PET Ufes</a> (mantido pelo nosso
          grupo) para conhecer os grupos PET de outros cursos da nossa
          universidade.
        </p>
      </div>
    </section>
  );
};

export default AboutUs;
