import React, { useState, useEffect } from "react";
import "./News.css";
import api from "../../../services/api";

// Endereço escrito no texto da notícia vira link de verdade.
const comLinks = (texto) =>
  texto.split(/(https:\/\/\S+[^\s.,;:!?)])/).map((parte, i) =>
    i % 2 ? (
      <a key={i} href={parte} target="_blank" rel="noopener noreferrer">
        {parte.replace(/^https:\/\//, "")}
      </a>
    ) : (
      parte
    )
  );

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

  if (!news?.length) return null;

  return (
    <section className="noticias">
      <div className="secao">
        <h2 className="title">Notícias</h2>
        <div className="noticias-grade">
          {news.map((singleNew) => (
            <article key={singleNew._id} className="noticia">
              <img
                src={`${process.env.REACT_APP_API_URL}api/file/getImageNews/${singleNew.file._id}`}
                alt=""
                loading="lazy"
              />
              <div className="noticia-texto">
                <h3>{singleNew.title}</h3>
                <p>{comLinks(singleNew.text)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;
