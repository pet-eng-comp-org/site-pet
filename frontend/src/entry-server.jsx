import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";

// Usado só no build (scripts/paginas.js): o HTML de uma página com tudo o que
// não depende da API. O que vem da API aparece no estado de carregando e é
// preenchido no navegador.
export const render = (url) =>
  renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
