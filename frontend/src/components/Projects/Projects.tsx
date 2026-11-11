"use client";

import { useEffect, useState } from "react";
import { chegouVoltando } from "../Navegacao/Navegacao";
import Project from "./Project/Project";
import useApi from "../../services/useApi";

import { AvisoDeFalha } from "../CargaFalhou/CargaFalhou";
import Loader from "../Loader/Loader";

// Quem volta de um projeto (Voltar do navegador ou "Todos os projetos") cai
// onde estava na lista, e não no topo: no celular a lista tem 4000 px.
const POSICAO = "projetos-posicao";
const VOLTAR = "projetos-voltar";
const guardarPosicao = () => {
  try {
    sessionStorage.setItem(POSICAO, String(window.scrollY));
  } catch {}
};
const posicaoGuardada = () => {
  try {
    return Number(sessionStorage.getItem(POSICAO)) || 0;
  } catch {
    return 0;
  }
};
// O "Todos os projetos" da página de um projeto marca a volta (ProjetoPagina).
export const marcarVolta = () => {
  try {
    sessionStorage.setItem(VOLTAR, "1");
  } catch {}
};
const veioDeVolta = () => {
  try {
    const marcada = sessionStorage.getItem(VOLTAR) === "1";
    sessionStorage.removeItem(VOLTAR);
    return marcada || chegouVoltando();
  } catch {
    return chegouVoltando();
  }
};

const Projects = () => {
  const resposta = useApi("api/comissions");
  const comissions = resposta.data?.comissions;
  const falhou = Boolean(resposta.falhou || resposta.status);
  // Lido uma vez, ao montar.
  const [voltando] = useState(veioDeVolta);

  // A posição só existe depois que a lista carrega e a página cresce.
  useEffect(() => {
    if (comissions && voltando) window.scrollTo(0, posicaoGuardada());
  }, [comissions, voltando]);

  return (
    // Fundo cinza e cartões brancos com sombra.
    <div className="bg-superficie">
    <div className="pagina">
      <h1>Projetos</h1>
      <p className="pagina-intro">
        Ensino, pesquisa e extensão, divididos em comissões. Escolha uma para
        saber mais.
      </p>

      {/* O título e a abertura são fixos: aparecem já, e a lista entra
          embaixo quando a API responde. */}
      {falhou && <AvisoDeFalha />}
      {!comissions && !falhou && (
        <div className="carregando-dados">
          <Loader />
        </div>
      )}
      {comissions && (
        // Três por linha na tela larga, dois no tablet, um no celular; a última
        // linha, se incompleta, fica alinhada à esquerda.
        <ul className="mt-10 mb-0 grid list-none grid-cols-1 gap-5 p-0 tablet:grid-cols-2 desktop:grid-cols-3">
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
      )}
    </div>
    </div>
  );
};

export default Projects;
