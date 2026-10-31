import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ComDadosIniciais } from "./services/useApi";

// Os dados da API que o servidor usou para gerar a página.
const dados = JSON.parse(
  document.getElementById("dados-iniciais")?.textContent || "{}"
);

const site = (
  <ComDadosIniciais dados={dados}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ComDadosIniciais>
);

// As páginas públicas chegam com o HTML pronto (server/servidor.js): o React
// só assume o que já está na tela. Login e painel chegam vazios e são
// montados aqui.
const raiz = document.getElementById("root");
if (raiz.hasChildNodes()) hydrateRoot(raiz, site);
else createRoot(raiz).render(site);
