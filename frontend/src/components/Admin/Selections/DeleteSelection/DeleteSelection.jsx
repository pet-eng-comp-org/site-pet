import React, { useState, useEffect } from "react";
import {
  MDBBtn,
  MDBCol,
  MDBContainer,
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
  MDBRow,
} from "mdbreact";
import api from "../../../../services/api";
import { toast } from "react-toastify";

const DeleteSelection = ({ isOpen, toggle, getSelections, idSelection }) => {
  const [selection, setSelection] = useState();

  useEffect(() => {
    const getSelections = async () => {
      const token = localStorage.getItem("LOGINPET_TOKEN");

      try {
        const response = await api.get(`api/selection/${idSelection}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        setSelection(response.data.selection);
      } catch (err) {
        console.log(err.response.data);
      }
    };
    if (idSelection) getSelections();
  }, [idSelection]);

  async function handleConfirm() {
    const token = localStorage.getItem("LOGINPET_TOKEN");

    try {
      await api.delete(`api/selection/${idSelection}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      toast.success("Processo Seletivo deletado com sucesso!");

      getSelections();
      toggle();
    } catch (err) {
      console.log(err.response.data);
      toast.error(err.response.data);
    }
  }

  return (
    <MDBModal isOpen={isOpen} toggle={toggle} size="lg">
      <MDBModalHeader toggle={toggle}>Deletando Seleção</MDBModalHeader>
      <MDBModalBody>
        <MDBContainer fluid>
          <MDBRow>
            <MDBCol md="12">
              <h4>
                Tem certeza que deseja deletar{" "}
                <strong>{selection?.title}</strong>?
              </h4>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              Ao clicar em Confirmar, <strong>TODOS</strong> os dados do
              Processo Seletivo e dos Inscritos no mesmo serão apagados!
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </MDBModalBody>
      <MDBModalFooter>
        <MDBBtn onClick={toggle}>Cancelar</MDBBtn>
        <MDBBtn color="danger" onClick={handleConfirm}>
          Confirmar
        </MDBBtn>
      </MDBModalFooter>
    </MDBModal>
  );
};

export default DeleteSelection;
