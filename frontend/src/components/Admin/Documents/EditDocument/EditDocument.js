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

const inputStyle = { width: "100%" };

const EditDocument = ({ isOpen, toggle, getDocuments, idDocument }) => {
  const [document, setDocument] = useState("");

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

  const handleChange = (e) => {
    let aux = { ...document };

    aux[e.target.name] = e.target.value;

    setDocument({ ...aux });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("LOGINPET_TOKEN");

    try {
      await api.put(
        `api/documents/${idDocument}`,
        { title: document.title },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      getDocuments();
      toast.success("Documento alterado com sucesso!");
      toggle();
    } catch (err) {
      console.log(err.response.data);
      toast.error(err.response.data);
    }
  }

  return (
    <MDBModal isOpen={isOpen} toggle={toggle} size="lg">
      <MDBModalHeader toggle={toggle}>
        Edição de grupo de Documento
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
                  value={document?.title || ""}
                  onChange={handleChange}
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

export default EditDocument;
