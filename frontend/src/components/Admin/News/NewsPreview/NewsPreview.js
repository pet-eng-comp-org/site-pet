import React, { useState, useEffect } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
} from "mdbreact";
import api from "../../../../services/api";

const NewsPreview = ({ isOpen, toggle, singleNews, idNews }) => {
  const [news, setNews] = useState();
  const [src, setSrc] = useState("");

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

  useEffect(() => {
    let path = "api/file/getImageNews/";
    if (news) {
      setSrc(`${process.env.REACT_APP_API_URL + path}${news.file._id}`);
    }
  }, [news]);

  return (
    <MDBModal isOpen={isOpen} toggle={toggle} size="lg">
      <MDBModalHeader toggle={toggle}>Prévia da notícia</MDBModalHeader>
      <MDBModalBody>
        <MDBContainer className="container">
          <div className="div-carousel">
            <div
              className="image"
              style={{
                backgroundImage: `url(${news ? src : singleNews?.image})`,
              }}
            ></div>
            <div className="info">
              <h3>{news ? news.title : singleNews?.title}</h3>
              <p>{news ? news.text : singleNews?.description}</p>
            </div>
          </div>
        </MDBContainer>
      </MDBModalBody>
      <MDBModalFooter>
        <MDBBtn type="reset" onClick={toggle}>
          Voltar
        </MDBBtn>
      </MDBModalFooter>
    </MDBModal>
  );
};

export default NewsPreview;
