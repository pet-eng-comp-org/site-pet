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

const ExitPetiano = ({ isOpen, toggle, getPetianos, idPetiano }) => {
  const [petiano, setPetiano] = useState();
  const [endPet, setEndPet] = useState("");

  useEffect(() => {
    const getPetianos = async () => {
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
    if (idPetiano) getPetianos();
  }, [idPetiano]);

  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("LOGINPET_TOKEN");

    try {
      await api.patch(
        `api/members/sairDoPet/${idPetiano}`,
        { endPet },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      toast.success("Muito obrigado por ter feito parte da equipe! :D");

      getPetianos();
      toggle();
    } catch (err) {
      console.log(err.response.data);
      toast.error(err.response.data);
    }
  }

  return (
    <MDBModal isOpen={isOpen} toggle={toggle} size="lg">
      <form onSubmit={handleSubmit}>
        <MDBModalHeader toggle={toggle}>Saindo do PET {"😭"}</MDBModalHeader>
        <MDBModalBody>
          <MDBContainer fluid>
            <MDBRow>
              <MDBCol md="12">
                <h4>
                  Tem certeza que deseja sair do PET,{" "}
                  <strong>{petiano?.memberName}</strong>?
                </h4>
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol md="12">
                Ao clicar em Confirmar, a maioria dos dados do Petiano serão
                mantidos, mas ele não aparecerá na página da equipe.
              </MDBCol>
            </MDBRow>
            <br />
            <MDBRow>
              <MDBCol md="12">
                <label htmlFor="iendpet">Data de saída</label>
                <br />
                <input
                  type="date"
                  value={endPet}
                  style={{ width: "30%", height: 34 }}
                  onChange={(e) => setEndPet(e.target.value)}
                  required
                />
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn onClick={toggle}>Cancelar</MDBBtn>
          <MDBBtn color="danger" type="submit">
            Confirmar
          </MDBBtn>
        </MDBModalFooter>
      </form>
    </MDBModal>
  );
};

export default ExitPetiano;
