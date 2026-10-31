import React, { createContext } from "react";
import useApi from "../../../services/useApi";
export const SelectionContext = createContext();

export const SelectionProvider = (props) => {
  const resposta = useApi("api/selection/openSelection");
  // Resposta do servidor sem seleção aberta é "fechadas"; sem resposta
  // nenhuma, não dá para saber.
  const selection = resposta.carregando
    ? "loading"
    : resposta.falhou
    ? "falhou"
    : resposta.data?.selection || null;

  return (
    <SelectionContext.Provider value={[selection]}>
      {props.children}
    </SelectionContext.Provider>
  );
};
