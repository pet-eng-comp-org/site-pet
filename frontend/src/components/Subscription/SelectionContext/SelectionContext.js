import React, { useState, useEffect, createContext } from "react";
import api from "../../../services/api";
export const SelectionContext = createContext();

export const SelectionProvider = (props) => {
  const [selection, setState] = useState("loading");

  useEffect(() => {
    async function getSelection() {
      try {
        const response = await api.get("api/selection/openSelection");
        setState(response.data.selection);
      } catch (err) {
        setState(err.response);
      }
    }
    getSelection();
  }, []);

  return (
    <SelectionContext.Provider value={[selection]}>
      {props.children}
    </SelectionContext.Provider>
  );
};
