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

import Dropzone from "../../Dropzone/Dropzone";
import api from "../../../../services/api";
import { toast } from "react-toastify";
import NewsPreview from "../NewsPreview/NewsPreview";

const inputStyle = { width: "100%" };
const CreateNews = ({ isOpen, toggle, getNews }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [modalPreview, setModalPreview] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Nenhuma foto selecionada.");
      return null;
    }

    const data = new FormData();
    data.append("file", selectedFile);
    data.append("title", title);
    data.append("text", description);

    const token = localStorage.getItem("LOGINPET_TOKEN");

    try {
      await api.post("api/news", data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      getNews();
      toast.success("Noticia criada com sucesso!");
      toggle();

      setTitle("");
      setDescription("");
    } catch (err) {
      console.log(err.response.data);
      toast.error(err.response.data);
    }
  }

  async function handlePreview(e) {
    setModalPreview((old) => !old);
  }

  return (
    <MDBModal isOpen={isOpen} toggle={toggle} size="lg">
      <MDBModalHeader toggle={toggle}>Criar notícia</MDBModalHeader>
      <form onSubmit={handleSubmit}>
        <MDBModalBody>
          <MDBContainer fluid>
            <MDBRow>
              <MDBCol md="12">
                <label htmlFor="iname">Título:</label>
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
            <MDBRow>
              <MDBCol md="12">
                <br />
                <label htmlFor="idescription">Descrição:</label>
                <br />
                <textarea
                  style={inputStyle}
                  id="idescription"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="5"
                  required
                />
              </MDBCol>
            </MDBRow>
            <br />
            <MDBRow>
              <MDBCol md="12">
                <Dropzone
                  onFileUploaded={setSelectedFile}
                  text="Foto da notícia"
                  setFileUrl={setSelectedFileUrl}
                />
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn type="reset" onClick={handlePreview}>
            Preview
          </MDBBtn>
          <MDBBtn type="reset" onClick={toggle}>
            Cancelar
          </MDBBtn>
          <MDBBtn color="primary" type="submit">
            Enviar
          </MDBBtn>
        </MDBModalFooter>
        <NewsPreview
          isOpen={modalPreview}
          toggle={() => setModalPreview((old) => !old)}
          singleNews={{
            image: selectedFileUrl,
            title: title,
            description: description,
          }}
        />
      </form>
    </MDBModal>
  );
};

export default CreateNews;
