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

const DeletePetiano = ({ isOpen, toggle, getNews, idNews }) => {
  const [news, setNews] = useState();

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

  async function handleConfirm() {
    const token = localStorage.getItem("LOGINPET_TOKEN");

    try {
      await api.delete(`api/news/${idNews}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      toast.success("Notícia deletada com sucesso!");
      getNews();
      toggle();
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  }

  return (
    <MDBModal isOpen={isOpen} toggle={toggle} size="lg">
      <MDBModalHeader toggle={toggle}>Deletando notícia</MDBModalHeader>
      <MDBModalBody>
        <MDBContainer fluid>
          <MDBRow>
            <MDBCol md="12">
              <h4>
                Tem certeza que deseja deletar <strong>{news?.title}</strong>?
              </h4>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              Ao clicar em Confirmar, <strong>TODOS</strong> os dados da notícia
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
