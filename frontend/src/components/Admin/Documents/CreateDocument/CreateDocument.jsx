import React, { useState } from "react";
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

const inputStyle = { width: "100%" };

const CreateDocument = ({ isOpen, toggle, getDocuments }) => {
  const [title, setTitle] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("LOGINPET_TOKEN");

    try {
      await api.post(
        `api/documents/`,
        { title },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      getDocuments();
      toast.success("Documento criado com sucesso!");
      toggle();
    } catch (err) {
      console.log(err.response.data);
      toast.error(err.response.data);
    }
  }

  return (
    <MDBModal isOpen={isOpen} toggle={toggle} size="lg">
      <MDBModalHeader toggle={toggle}>
        Cadastro de novo grupo de Documento
      </MDBModalHeader>
      <form onSubmit={handleSubmit}>
        <MDBModalBody>
          <MDBContainer fluid>
            <MDBRow>
              <MDBCol md="12">
                <label htmlFor="ititle">Título:</label>
                <br />
                <input
                  style={inputStyle}
                  id="ititle"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  required
                />
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn type="reset" onClick={toggle}>
            Cancelar
          </MDBBtn>
          <MDBBtn color="primary" type="submit">
            Enviar
          </MDBBtn>
        </MDBModalFooter>
      </form>
    </MDBModal>
  );
};

export default CreateDocument;
