import React, { useEffect } from "react";
import Team from "./Team/Team";
import goUp from "../../utils/goUp";
import useApi from "../../services/useApi";
import "./About.css";
import { AvisoDeFalha } from "../CargaFalhou/CargaFalhou";
import Loader from "../Loader/Loader";
import useTitulo from "../../utils/useTitulo";

const About = () => {
  useTitulo("Quem somos");
  const membros = useApi("api/members/");
  const comissoes = useApi("api/comissions");
  const petianos = membros.data?.members.filter((p) => p.active);
  const falhou = Boolean(membros.falhou || membros.status);
  const projetos = comissoes.data?.comissions || [];

  useEffect(() => {
    goUp();
  }, []);

  // O texto fixo aparece já, e continua com a API fora; só a equipe espera
  // a resposta.

  return (
    <>
      <div className="pagina sobre">
        <h1>Quem somos</h1>
        <div className="sobre-texto">
          <p className="pagina-intro">
            O PET Engenharia de Computação é um dos grupos PET originais da Ufes,
            criado em 1993.
          </p>
          <p className="pagina-intro">
            O{" "}
            <a className="link-texto" href="https://www.gov.br/mec/pt-br/pet">
              Programa de Educação Tutorial
            </a>{" "}
            foi criado pela CAPES em 1979, com o nome de Programa Especial de
            Treinamento, e desde 1999 é gerido pela SESu. É destinado a alunos de
            graduação que demonstrem potencial, interesse e habilidades
            destacadas. Na Ufes são 13 grupos PET.
          </p>
          {falhou && <AvisoDeFalha />}
        </div>
        {/* Os números que o texto cita, em destaque, na coluna que ficava
            vazia na tela larga (até a foto do grupo ocupar o lugar). Só na
            tela larga, e fora do leitor de tela: repetem o texto. */}
        <dl className="sobre-numeros" aria-hidden="true">
          <div>
            <dt>1993</dt>
            <dd>ano em que o grupo foi criado</dd>
          </div>
          <div>
            <dt>13</dt>
            <dd>grupos PET na Ufes</dd>
          </div>
          <div>
            <dt>1979</dt>
            <dd>ano em que o programa começou, na CAPES</dd>
          </div>
        </dl>
      </div>
      {!petianos && !falhou && (
        <div className="carregando-dados">
          <Loader />
        </div>
      )}
      {petianos && <Team petianos={petianos} projetos={projetos} />}
    </>
  );
};

export default About;
