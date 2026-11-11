"use client";

import useApi from "../../../services/useApi";
import { API } from "../../../services/apiUrl";
import type { Noticia } from "../../../tipos";
import { FOLGA_DO_BLOCO } from "../Hero/Hero";

// Endereço escrito no texto da notícia vira link de verdade.
const comLinks = (texto: string) =>
  texto.split(/(https:\/\/\S+[^\s.,;:!?)])/).map((parte, i) =>
    i % 2 ? (
      <a key={i} className="wrap-anywhere" href={parte} target="_blank" rel="noopener noreferrer">
        {parte.replace(/^https:\/\//, "")}
      </a>
    ) : (
      parte
    )
  );

// Só aparece o que é recente: notícia velha faz o site parecer abandonado.
const SEIS_MESES = 183 * 24 * 60 * 60 * 1000;
const recente = (n: Noticia) => Date.now() - Date.parse(n.date) < SEIS_MESES;

const dataDa = (n: Noticia) =>
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
    // Na página branca, com os cartões em cinza.
    <section className={`mb-3 bg-fundo px-(--margem) ${FOLGA_DO_BLOCO}`}>
      <div className="mx-auto max-w-[980px]">
        <h2 className="bloco-titulo mb-8 text-center text-texto">Notícias</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-8 max-desktop:grid-cols-1">
          {news.map((singleNew) => (
            <article key={singleNew._id} className="flex flex-col overflow-hidden rounded-cartao bg-superficie">
              <img
                className="aspect-video w-full bg-rodape object-cover"
                src={`${API}api/file/getImageNews/${singleNew.file._id}`}
                alt=""
                loading="lazy"
              />
              {/* 32 px de folga, a data em 14 px, título de 21 px em peso 600 e texto de 17/25. */}
              <div className="p-8">
                <time className="mb-[0.35rem] block text-14 text-texto-suave" dateTime={singleNew.date}>
                  {dataDa(singleNew)}
                </time>
                <h3 className="mb-3 text-21 font-semibold text-texto">{singleNew.title}</h3>
                <p className="m-0 max-w-[34rem] whitespace-pre-line">{comLinks(singleNew.text)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;
