import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const site = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// As páginas públicas chegam com o HTML pronto (scripts/paginas.js): o React
// só assume o que já está na tela. Login e painel chegam vazios e são
// montados aqui.
const raiz = document.getElementById("root");
if (raiz.hasChildNodes()) hydrateRoot(raiz, site);
else createRoot(raiz).render(site);
