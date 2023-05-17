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

const CloseSelection = ({ isOpen, toggle, getSelections, idSelection }) => {
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
        toast.error(err.response.data);
      }
    };
    if (idSelection) getSelections();
  }, [idSelection]);

  async function handleSubmit() {
    const token = localStorage.getItem("LOGINPET_TOKEN");

    try {
      await api.patch(`api/selection/finalizeSelection/${idSelection}`, null, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      toast.success("Pocesso seletivo finalizado com sucesso!");

      getSelections();
      toggle();
    } catch (err) {
      console.log(err.response.data);
      toast.error(err.response.data);
    }
  }

  return (
    <MDBModal isOpen={isOpen} toggle={toggle} size="lg">
      <MDBModalHeader toggle={toggle}>
        Finalizando Processo Seletivo
      </MDBModalHeader>
      <MDBModalBody>
        <MDBContainer fluid>
          <MDBRow>
            <MDBCol md="12">
              <h4>
                Tem certeza que deseja finalizar{" "}
                <strong>{selection?.title}</strong>?
              </h4>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md="12">
              Ao clicar em Confirmar, os arquivos dos inscritos serão deletados,
              mas seus nomes ficarão salvos.
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </MDBModalBody>
      <MDBModalFooter>
        <MDBBtn onClick={toggle}>Cancelar</MDBBtn>
        <MDBBtn color="danger" onClick={handleSubmit}>
          Confirmar
        </MDBBtn>
      </MDBModalFooter>
    </MDBModal>
  );
};

export default CloseSelection;
