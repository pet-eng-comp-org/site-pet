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

const DeleteCommission = ({ isOpen, toggle, getCommissions, idCommission }) => {
  const [commission, setCommission] = useState();

  useEffect(() => {
    const getCommission = async () => {
      try {
        const response = await api.get(`api/comissions/${idCommission}`);
        setCommission(response.data.commission);
      } catch (err) {
        console.log(err.response.data);
      }
    };
    if (idCommission) getCommission();
  }, [idCommission]);

  async function handleConfirm() {
    const token = localStorage.getItem("LOGINPET_TOKEN");

    try {
      await api.delete(`api/comissions/${idCommission}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      toast.success("Comissão deletada com sucesso!");
      getCommissions();
      toggle();
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  }

  return (
    <MDBModal isOpen={isOpen} toggle={toggle} size="lg">
      <MDBModalHeader toggle={toggle}>Deletando comissão</MDBModalHeader>
      <MDBModalBody>
        <MDBContainer fluid>
          <MDBRow>
            <MDBCol md="12">
              <h4>
                Tem certeza que deseja deletar{" "}
                <strong>{commission?.title}</strong>?
              </h4>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              Ao clicar em Confirmar, <strong>TODOS</strong> os dados da
              comissão serão apagados!
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

export default DeleteCommission;
