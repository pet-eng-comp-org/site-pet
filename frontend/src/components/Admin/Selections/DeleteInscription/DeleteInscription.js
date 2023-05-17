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

const DeleteInscription = ({ isOpen, toggle, getSelection, idInscription }) => {
  const [inscription, setInscription] = useState();

  useEffect(() => {
    const getInscription = async () => {
      const token = localStorage.getItem("LOGINPET_TOKEN");

      try {
        const response = await api.get(`api/inscriptions/${idInscription}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        setInscription(response.data.inscription);
      } catch (err) {
        console.log(err.response.data);
      }
    };
    if (idInscription) getInscription();
  }, [idInscription]);

  async function handleConfirm() {
    const token = localStorage.getItem("LOGINPET_TOKEN");

    try {
      await api.delete(`api/inscriptions/${idInscription}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      toast.success("Inscrição deletada com sucesso!");

      getSelection();
      toggle();
    } catch (err) {
      console.log(err.response.data);
      toast.error(err.response.data);
    }
  }

  return (
    <MDBModal isOpen={isOpen} toggle={toggle} size="lg">
      <MDBModalHeader toggle={toggle}>Deletando Inscrição</MDBModalHeader>
      <MDBModalBody>
        <MDBContainer fluid>
          <MDBRow>
            <MDBCol md="12">
              <h4>
                Tem certeza que deseja deletar{" "}
                <strong>{inscription?.name}</strong>?
              </h4>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              Ao clicar em Confirmar, <strong>TODOS</strong> os dados do
              inscrito serão apagados!
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

export default DeleteInscription;
