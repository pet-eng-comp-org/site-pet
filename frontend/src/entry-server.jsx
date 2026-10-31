import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import slug from "./utils/slug";
import { ComDadosIniciais } from "./services/useApi";

// Usado pelo servidor (server/servidor.js) a cada visita: o HTML da página
// com os dados da API que ele já buscou. O navegador recebe os mesmos dados
// e assume a página sem buscar de novo.
export const render = (url, dados) =>
  renderToString(
    <ComDadosIniciais dados={dados}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </ComDadosIniciais>
  );

export const API = import.meta.env.VITE_API_URL;
export { slug };
