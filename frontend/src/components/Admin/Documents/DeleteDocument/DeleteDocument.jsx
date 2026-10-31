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

const DeleteDocument = ({ isOpen, toggle, getDocuments, idDocument }) => {
  const [document, setDocument] = useState();

  useEffect(() => {
    const getDocument = async () => {
      try {
        const response = await api.get(`api/documents/${idDocument}`);
        setDocument(response.data.document);
      } catch (err) {
        console.log(err.response.data);
      }
    };
    if (idDocument) getDocument();
  }, [idDocument]);

  async function handleConfirm() {
    const token = localStorage.getItem("LOGINPET_TOKEN");

    try {
      await api.delete(`api/documents/${idDocument}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      toast.success("Documento deletado com sucesso!");

      getDocuments();
      toggle();
    } catch (err) {
      console.log(err.response.data);
      toast.error(err.response.data);
    }
  }

  return (
    <MDBModal isOpen={isOpen} toggle={toggle} size="lg">
      <MDBModalHeader toggle={toggle}>
        Deletando grupo de Documentos
      </MDBModalHeader>
      <MDBModalBody>
        <MDBContainer fluid>
          <MDBRow>
            <MDBCol md="12">
              <h4>
                Tem certeza que deseja deletar{" "}
                <strong>{document?.title}</strong>?
              </h4>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              Ao clicar em Confirmar, <strong>TODOS</strong> os arquivos desse
              grupo de documentos serão apagados!
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

export default DeleteDocument;
