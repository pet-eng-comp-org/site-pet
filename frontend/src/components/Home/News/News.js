import React, { useState, useEffect } from "react";
import "./News.css";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
import api from "../../../services/api";
import { Carousel } from "react-responsive-carousel";

const News = () => {
  const [news, setNews] = useState();

  useEffect(() => {
    const getNews = async () => {
      try {
        const response = await api.get("api/news/");
        setNews([...response.data.news]);
      } catch (err) {
        console.log(err.response);
      }
    };
    getNews();
  }, []);

  const createNews = () => {
    let formatedNews = news.map((singleNew) => {
      let imgUrl =
        `${process.env.REACT_APP_API_URL}api/file/getImageNews/` +
        singleNew.file._id;
      return (
        <div key={singleNew._id} className="div-carousel">
          <div
            className="image"
            style={{ backgroundImage: `url(${imgUrl})` }}
          />
          {/* <img className="image" alt={singleNew._id} src={imgUrl} /> */}
          <div className="info">
            <h3>{singleNew.title}</h3>
            <p className="ft-normal">{singleNew.text}</p>
          </div>
        </div>
      );
    });
    return formatedNews;
  };

  return (
    <div className="news">
      {news?.length > 0 && (
        <MDBContainer>
          <MDBRow center>
            <MDBCol xs="12" md="11" lg="10">
              <h1 className="title">Notícias</h1>
            </MDBCol>
          </MDBRow>
          <MDBRow center>
            <MDBCol xs="12" md="11" lg="10">
              <Carousel
                showThumbs={false}
                infiniteLoop={true}
                showIndicators={true}
                showStatus={false}
                width="100%"
                swipeScrollTolerance={5}
                transitionTime={200}
                className="outline-grey"
              >
                {createNews()}
              </Carousel>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      )}
    </div>
  );
};

export default News;
