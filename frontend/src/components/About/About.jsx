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
      <div className="pagina">
        <h1>Quem somos</h1>
        <p className="pagina-intro">
          Estudantes de Engenharia de Computação e um professor tutor, em
          ensino, pesquisa e extensão.
        </p>
        {/* Os números em destaque. Os do programa são
            do portal do MEC (gov.br/mec/pt-br/pet, conferido em 07/11/2026). */}
        <dl className="numeros">
          <div>
            <dt>1993</dt>
            <dd>o começo do nosso grupo</dd>
          </div>
          <div>
            <dt>13</dt>
            <dd>grupos PET na Ufes</dd>
          </div>
          <div>
            <dt>881</dt>
            <dd>grupos PET no Brasil</dd>
          </div>
          <div>
            <dt>+10 mil</dt>
            <dd>bolsistas no país</dd>
          </div>
        </dl>
        <p className="numeros-fonte">
          <a
            className="link-mais"
            href="https://www.sbc.org.br/grupos-pet/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Os outros grupos PET de computação do país
          </a>
        </p>
        {falhou && <AvisoDeFalha />}
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
