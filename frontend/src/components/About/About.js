import React, { useState, useEffect } from "react";
import Team from "./Team/Team";
import goUp from "../../utils/goUp";
import api from "../../services/api";
import "./About.css";
import Loader from "../Loader/Loader";
import useTitulo from "../../utils/useTitulo";

const About = () => {
  useTitulo("Quem somos");
  const [petianos, setPetianos] = useState();

  useEffect(() => {
    goUp();
  }, []);

  useEffect(() => {
    const getPetianos = async () => {
      try {
        const response = await api.get("api/members/");
        setPetianos(response.data.members.filter((p) => p.active));
      } catch (err) {
        console.log(err.response.data);
      }
    };

    getPetianos();
  }, []);

  if (!petianos) {
    return (
      <div className="divloader">
        <Loader />
      </div>
    );
  }

  const alunos = petianos.filter((p) => !p.tutor).length;

  return (
    <>
      <div className="pagina">
        <h1>Quem somos</h1>
        <p className="pagina-intro">
          O PET Engenharia de Computação é um dos grupos PET originais da Ufes,
          criado em 1993. Hoje somos {alunos} alunos e um professor tutor.
        </p>
        <p className="pagina-intro">
          O{" "}
          <a className="link-texto" href="https://www.gov.br/mec/pt-br/pet">
            Programa de Educação Tutorial
          </a>{" "}
          foi criado pela CAPES em 1979, com o nome de Programa Especial de
          Treinamento, e desde 1999 é gerido pela SESu. É destinado a alunos de
          graduação que demonstrem potencial, interesse e habilidades
          destacadas. Na Ufes são 13 grupos PET; conheça todos no{" "}
          <a className="link-texto" href="http://pet.ufes.br/">
            site do PET Ufes
          </a>
          .
        </p>
      </div>
      <Team petianos={petianos} />
    </>
  );
};

export default About;
