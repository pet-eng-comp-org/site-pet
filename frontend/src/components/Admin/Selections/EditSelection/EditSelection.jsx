import React, { useState, useEffect } from "react";
import api from "../../../../services/api";
import { toast } from "react-toastify";
import FormularioSelecao from "../FormularioSelecao/FormularioSelecao";

const EditSelection = ({ isOpen, toggle, getSelections, idSelection }) => {
  const [selection, setSelection] = useState();

  useEffect(() => {
    const getSelection = async () => {
      const token = localStorage.getItem("LOGINPET_TOKEN");

      try {
        const response = await api.get(`api/selection/${idSelection}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        setSelection(response.data.selection);
      } catch (err) {
        toast.error(err.response?.data || "Não foi possível abrir a seleção.");
      }
    };
    if (isOpen && idSelection) getSelection();
    if (!isOpen) setSelection();
  }, [isOpen, idSelection]);

  async function handleSubmit(selecao) {
    const token = localStorage.getItem("LOGINPET_TOKEN");

    try {
      await api.put(`api/selection/${idSelection}`, selecao, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      toast.success("Seleção atualizada.");
      getSelections();
      toggle();
    } catch (err) {
      toast.error(err.response?.data || "Não foi possível salvar a seleção.");
    }
  }

  if (!selection) return null;

  return (
    <FormularioSelecao
      key={selection._id}
      isOpen={isOpen}
      toggle={toggle}
      titulo="Editar seleção"
      inicial={selection}
      onSubmit={handleSubmit}
    />
  );
};

export default EditSelection;
