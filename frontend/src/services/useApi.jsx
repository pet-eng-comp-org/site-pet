import React, { createContext, useContext, useEffect, useState } from "react";
import api from "./api";

// Respostas da API que o servidor já buscou para gerar a página
// (server/servidor.js), por caminho: { "api/comissions": { data }, ... }. No
// navegador vêm no <script id="dados-iniciais">; com elas, a página chega
// pronta e o React não busca de novo.
const DadosIniciais = createContext({});

export const ComDadosIniciais = ({ dados, children }) => (
  <DadosIniciais.Provider value={dados || {}}>{children}</DadosIniciais.Provider>
);

// Estado de uma busca: { carregando }, { data }, { status } (a API respondeu
// com erro) ou { falhou } (a API não respondeu).
export default function useApi(caminho) {
  const inicial = useContext(DadosIniciais)[caminho];
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
  }, [caminho, inicial]);

  return estado;
}
