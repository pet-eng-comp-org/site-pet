import React, { useState, useEffect, useCallback } from "react";
import { MDBBtn, MDBCol, MDBContainer, MDBRow } from "mdbreact";
import CollapseDocument from "./CollapseDocument/CollapseDocument";
import CreateDocument from "./CreateDocument/CreateDocument";
import api from "../../../services/api";

const Documents = () => {
  const [documents, setDocuments] = useState();
  const [modalCreate, setModalCreate] = useState(false);

  const getDocuments = useCallback(async () => {
    const token = localStorage.getItem("LOGINPET_TOKEN");

    try {
      const response = await api.get("api/documents", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setDocuments([...response.data.documents]);
    } catch (err) {
      console.log(err.response.data);
    }
  }, []);

  useEffect(() => {
    getDocuments();
  }, [getDocuments]);

  return (
    <MDBContainer fluid>
      <MDBRow>
        <MDBBtn
          style={{ fontWeight: "bold" }}
          onClick={() => setModalCreate((old) => !old)}
        >
          Cadastrar novo Grupo de Documentos
        </MDBBtn>
      </MDBRow>
      {documents?.map((document, index) => (
        <MDBRow key={index}>
          <MDBCol md="10" lg="8" xl="6">
            <CollapseDocument
              title={document.title}
              files={document.files}
              idDocument={document._id}
              getDocuments={getDocuments}
            />
          </MDBCol>
        </MDBRow>
      ))}
      <CreateDocument
        getDocuments={getDocuments}
        isOpen={modalCreate}
        toggle={() => setModalCreate((old) => !old)}
      />
    </MDBContainer>
  );
};

export default Documents;
