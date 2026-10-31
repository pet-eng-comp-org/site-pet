import React, { createContext, useContext, useEffect, useState } from "react";
import api from "./api";

// Respostas da API que o servidor já buscou para gerar a página
// (server/servidor.js), por caminho: { "api/comissions": { data }, ... }. No
// navegador vêm no <script id="dados-iniciais">; com elas, a página chega
// pronta e o React não busca de novo.
const DadosIniciais = createContext({});

// Os dados que vieram com a página valem para ela e para as páginas abertas
// logo depois; passado esse tempo, cada página busca de novo, para quem
// navega muito tempo sem recarregar ver o que mudou.
const carregadaEm = Date.now();
const VALIDADE = 30 * 1000;

export const ComDadosIniciais = ({ dados, children }) => (
  <DadosIniciais.Provider value={dados || {}}>{children}</DadosIniciais.Provider>
);

// Estado de uma busca: { carregando }, { data }, { status } (a API respondeu
// com erro) ou { falhou } (a API não respondeu).
export default function useApi(caminho) {
  const recebido = useContext(DadosIniciais)[caminho];
  // No servidor, os dados acabaram de ser buscados: valem sempre. O relógio
  // é só do navegador (no servidor, carregadaEm é a hora em que ele subiu).
  const valido = typeof window === "undefined" || Date.now() - carregadaEm < VALIDADE;
  const inicial = valido ? recebido : undefined;
  const [estado, setEstado] = useState(inicial || { carregando: true });

  useEffect(() => {
    if (inicial) return undefined;
    let vivo = true;
    api
      .get(caminho)
      .then(({ data }) => vivo && setEstado({ data }))
      .catch((err) =>
        vivo &&
        setEstado(err.response ? { status: err.response.status } : { falhou: true })
      );
    return () => {
      vivo = false;
    };
  }, [caminho]); // eslint-disable-line react-hooks/exhaustive-deps

  return estado;
}
