import React, { createContext } from "react";
import useApi from "../../../services/useApi";
export const SelectionContext = createContext();

export const SelectionProvider = (props) => {
  const resposta = useApi("api/selection/openSelection");
  // Resposta da API sem seleção aberta é "fechadas"; sem resposta, ou com
  // erro do servidor (5xx), não dá para saber.
  const selection = resposta.carregando
    ? "loading"
    : resposta.falhou || resposta.status >= 500
    ? "falhou"
    : resposta.data?.selection || null;

  return (
    <SelectionContext.Provider value={[selection]}>
      {props.children}
    </SelectionContext.Provider>
  );
};
