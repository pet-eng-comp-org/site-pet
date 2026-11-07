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
          Um dos 13 grupos PET da Ufes e um dos primeiros, de 1993.
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
