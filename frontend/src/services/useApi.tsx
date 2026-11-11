"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import api from "./api";
import type { Caminho, Respostas } from "../tipos";

// Estado de uma busca: { carregando }, { data }, { status } (a API respondeu
// com erro) ou { falhou } (a API não respondeu).
export type Estado<T> =
  | { carregando: true; data?: undefined; status?: undefined; falhou?: undefined }
  | { data: T; carregando?: undefined; status?: undefined; falhou?: undefined }
  | { status: number; carregando?: undefined; data?: undefined; falhou?: undefined }
  | { falhou: true; carregando?: undefined; data?: undefined; status?: undefined };

// Respostas que o servidor já buscou para montar a página, por caminho.
export type Dados = { [C in Caminho]?: { data: Respostas[C] } };

const DadosIniciais = createContext<Dados>({});

// Cada página traz os dados dela; o layout, os de todas (a seleção aberta).
// Os de dentro se somam aos de fora.
export const ComDadosIniciais = ({ dados, children }: { dados: Dados; children: ReactNode }) => {
  const deFora = useContext(DadosIniciais);
  return <DadosIniciais.Provider value={{ ...deFora, ...dados }}>{children}</DadosIniciais.Provider>;
};

export default function useApi<C extends Caminho>(caminho: C): Estado<Respostas[C]> {
  const inicial = useContext(DadosIniciais)[caminho] as { data: Respostas[C] } | undefined;
  const [estado, setEstado] = useState<Estado<Respostas[C]>>(inicial || { carregando: true });

  useEffect(() => {
    if (inicial) return undefined;
    let vivo = true;
    api
      .get<Respostas[C]>(caminho)
      .then(({ data }) => vivo && setEstado({ data }))
      .catch((err) => {
        if (vivo) setEstado(err.response ? { status: err.response.status } : { falhou: true });
      });
    return () => {
      vivo = false;
    };
  }, [caminho]); // os dados iniciais só valem na primeira montagem

  return estado;
}
