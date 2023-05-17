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

const DeletePetiano = ({ isOpen, toggle, getPetianos, idPetiano }) => {
  const [petiano, setPetiano] = useState();

  useEffect(() => {
    const getPetiano = async () => {
      const token = localStorage.getItem("LOGINPET_TOKEN");
      try {
        const response = await api.get(`api/members/${idPetiano}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        setPetiano(response.data.member);
      } catch (err) {
        console.log(err.response.data);
      }
    };
    if (idPetiano) getPetiano();
  }, [idPetiano]);

  async function handleConfirm() {
    const token = localStorage.getItem("LOGINPET_TOKEN");

    try {
      await api.delete(`api/members/${idPetiano}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      toast.success("Petiano deletado com sucesso!");

      getPetianos();
      toggle();
    } catch (err) {
      console.log(err.response.data);
      toast.error(err.response.data);
    }
  }

  return (
    <MDBModal isOpen={isOpen} toggle={toggle} size="lg">
      <MDBModalHeader toggle={toggle}>Deletando Petiano</MDBModalHeader>
      <MDBModalBody>
        <MDBContainer fluid>
          <MDBRow>
            <MDBCol md="12">
              <h4>
                Tem certeza que deseja deletar{" "}
                <strong>{petiano?.memberName}</strong>?
              </h4>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              Ao clicar em Confirmar, <strong>TODOS</strong> os dados do Petiano
              serão apagados!
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

export default DeletePetiano;
