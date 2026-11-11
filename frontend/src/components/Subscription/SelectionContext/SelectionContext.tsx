"use client";

import { createContext, type ReactNode } from "react";
import useApi from "../../../services/useApi";
import type { Selecao } from "../../../tipos";

// "loading" enquanto a API não responde; "falhou" sem resposta ou com erro do
// servidor; a seleção aberta; ou null, fechadas.
type Estado = "loading" | "falhou" | Selecao | null;

export const SelectionContext = createContext<[Estado]>(["loading"]);

export const SelectionProvider = ({ children }: { children: ReactNode }) => {
  const resposta = useApi("api/selection/openSelection");
  // Resposta da API sem seleção aberta é "fechadas"; sem resposta, ou com
  // erro do servidor (5xx), não dá para saber.
  const selection: Estado = resposta.carregando
    ? "loading"
    : resposta.falhou || (resposta.status !== undefined && resposta.status >= 500)
      ? "falhou"
      : resposta.data?.selection || null;

  return <SelectionContext.Provider value={[selection]}>{children}</SelectionContext.Provider>;
};
