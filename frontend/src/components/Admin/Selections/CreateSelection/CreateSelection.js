import React from "react";
import api from "../../../../services/api";
import { toast } from "react-toastify";
import FormularioSelecao from "../FormularioSelecao/FormularioSelecao";

const CreateSelection = ({ isOpen, toggle, getSelections }) => {
  async function handleSubmit(selecao) {
    const token = localStorage.getItem("LOGINPET_TOKEN");

    try {
      await api.post("api/selection", selecao, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      toast.success("Seleção criada. O botão de inscrição aparece no site no primeiro dia.");
      getSelections();
      toggle();
    } catch (err) {
      toast.error(err.response?.data || "Não foi possível criar a seleção.");
    }
  }

  return (
    <FormularioSelecao
      key={isOpen ? "aberto" : "fechado"}
      isOpen={isOpen}
      toggle={toggle}
      titulo="Nova seleção"
      onSubmit={handleSubmit}
    />
  );
};

export default CreateSelection;
