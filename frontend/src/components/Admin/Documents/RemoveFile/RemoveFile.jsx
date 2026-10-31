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

const RemoveFile = ({ isOpen, toggle, getDocuments, idDocument, idFile }) => {
  const [file, setFile] = useState();

  useEffect(() => {
    const getFile = async () => {
      try {
        const response = await api.get(`api/file/${idFile}`);
        setFile(response.data.file);
      } catch (err) {
        console.log(err.response.data);
      }
    };
    if (idFile) getFile();
  }, [idFile]);

  async function handleClick() {
    const token = localStorage.getItem("LOGINPET_TOKEN");

    try {
      await api.patch(
        `api/documents/removeFile/${idDocument}`,
        { idFile },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      toast.success("Arquivo excluído com sucesso!");

      getDocuments();
      toggle();
    } catch (err) {
      console.log(err.response.data);
      toast.error(err.response.data);
    }
  }

  return (
    <MDBModal isOpen={isOpen} toggle={toggle} size="lg">
      <MDBModalHeader toggle={toggle}>Deletando arquivo</MDBModalHeader>
      <MDBModalBody>
        <MDBContainer fluid>
          <MDBRow>
            <MDBCol md="12">
              <h4>
                Tem certeza que deseja exluir, <strong>{file?.name}</strong>?
              </h4>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md="12">
              Ao clicar em Confirmar, o arquivo será permanentemente excluido.
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </MDBModalBody>
      <MDBModalFooter>
        <MDBBtn onClick={toggle}>Cancelar</MDBBtn>
        <MDBBtn color="danger" onClick={handleClick}>
          Confirmar
        </MDBBtn>
      </MDBModalFooter>
    </MDBModal>
  );
};

export default RemoveFile;
