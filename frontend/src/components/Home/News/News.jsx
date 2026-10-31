import React from "react";
import "./News.css";
import useApi from "../../../services/useApi";

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

// Só aparece o que é recente: notícia velha faz o site parecer abandonado.
const SEIS_MESES = 183 * 24 * 60 * 60 * 1000;
const recente = (n) => Date.now() - Date.parse(n.date) < SEIS_MESES;

const dataDa = (n) =>
  new Date(n.date).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  });

const News = () => {
  const news = useApi("api/news/").data?.news.filter(recente);

  if (!news?.length) return null;

  return (
    <section className="noticias">
      <div className="secao">
        <h2 className="title">Notícias</h2>
        <div className="noticias-grade">
          {news.map((singleNew) => (
            <article key={singleNew._id} className="noticia">
              <img
                src={`${import.meta.env.VITE_API_URL}api/file/getImageNews/${singleNew.file._id}`}
                alt=""
                loading="lazy"
              />
              <div className="noticia-texto">
                <time dateTime={singleNew.date}>{dataDa(singleNew)}</time>
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
