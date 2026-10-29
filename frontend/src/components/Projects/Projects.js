import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Project from "./Project/Project";
import "./Projects.css";
import api from "../../services/api";
import goUp from "../../utils/goUp";

import Loader from "../Loader/Loader";
import useTitulo from "../../utils/useTitulo";

// Quem volta de um projeto (Voltar do navegador ou "Todos os projetos") cai
// onde estava na lista, e não no topo: no celular a lista tem 4000 px.
const POSICAO = "projetos-posicao";
const guardarPosicao = () => {
  try {
    sessionStorage.setItem(POSICAO, String(window.scrollY));
  } catch (err) {}
};
const posicaoGuardada = () => {
  try {
    return Number(sessionStorage.getItem(POSICAO)) || 0;
  } catch (err) {
    return 0;
  }
};

const Projects = () => {
  useTitulo("Projetos");
  const [comissions, setComissions] = useState();
  const history = useHistory();
  const location = useLocation();
  const voltando = history.action === "POP" || location.state?.voltar;

  // A posição só existe depois que a lista carrega e a página cresce.
  useEffect(() => {
    if (comissions && voltando) window.scrollTo(0, posicaoGuardada());
  }, [comissions, voltando]);

  useEffect(() => {
    goUp();
    const getComissions = async () => {
      try {
        const response = await api.get("api/comissions");
        setComissions([...response.data.comissions]);
      } catch (err) {
        console.log(err);
      }
    };
    getComissions();
  }, []);

  if (!comissions) {
    return (
      <div className="divloader">
        <Loader />
      </div>
    );
  }

  return (
    <div className="pagina">
      <h1>Projetos</h1>
      <p className="pagina-intro">
        Como todo grupo PET, trabalhamos no tripé de ensino, pesquisa e
        extensão. As atividades se dividem em comissões, cada uma com um líder
        que coordena os seus projetos. Escolha uma para saber mais.
      </p>

      <ul className="projetos-grade">
        {comissions.map((comission) => (
          <li key={comission._id}>
            <Project
              title={comission.title}
              description={comission.description}
              icon={comission.photos[0]}
              onClick={guardarPosicao}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Projects;
