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
import Dropzone from "../../Dropzone/Dropzone";
import api from "../../../../services/api";
import { toast } from "react-toastify";
import NewsPreview from "../NewsPreview/NewsPreview";

const inputStyle = { width: "100%" };

const EditNews = ({ isOpen, toggle, getNews, idNews }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [news, setNews] = useState();
  const [modalPreview, setModalPreview] = useState(false);

  useEffect(() => {
    const getNews = async () => {
      try {
        const response = await api.get(`api/news/${idNews}`);
        setNews(response.data.new);
      } catch (err) {
        console.log(err.response.data);
      }
    };
    if (idNews) getNews();
  }, [idNews]);

  const handleChange = (e) => {
    let aux = { ...news };

    aux[e.target.name] = e.target.value;

    setNews({ ...aux });
  };

  async function handleChangeImage() {
    const data = new FormData();
    data.append("file", selectedFile);

    const token = localStorage.getItem("LOGINPET_TOKEN");

    try {
      await api.patch(`api/news/updateImage/${idNews}`, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      getNews();
      toast.success("Foto alterada com sucesso!");
    } catch (err) {
      console.log(err.response.data);
      toast.error(err.response.data);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const data = new FormData();
    data.append("title", news.title);
    data.append("text", news.text);

    const token = localStorage.getItem("LOGINPET_TOKEN");
    try {
      console.log("to dentro do try");

      await api.patch(
        `api/news/updateTexts/${idNews}`,
        {
          title: news.title,
          text: news.text,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      getNews();
      toast.success("Dados alterados com sucesso!");
    } catch (err) {
      console.log(err.response.data);
      toast.error(err.response.data);
    }
  }

  return (
    <MDBModal isOpen={isOpen} toggle={toggle} size="lg">
      <MDBModalHeader toggle={toggle}>Editar notícia</MDBModalHeader>
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
                  value={news?.title || " "}
                  onChange={handleChange}
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
                  id="idtext"
                  name="text"
                  value={news?.text || " "}
                  onChange={handleChange}
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
                  setFileUrl={setSelectedFileUrl}
                  type="news"
                  idPhoto={news?.file?._id || null}
                />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol>
                <MDBBtn onClick={handleChangeImage}>Enviar Foto</MDBBtn>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn type="reset" onClick={() => setModalPreview((old) => !old)}>
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
            title: news?.title,
            description: news?.text,
          }}
        />
      </form>
    </MDBModal>
  );
};

export default EditNews;
