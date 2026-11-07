import React from "react";
import { Link } from "react-router-dom";
import useApi from "../../../services/useApi";
import slug from "../../../utils/slug";
import "./Destaques.css";

// Os quadrados da inicial do apple.com, que lá levam aos produtos; aqui,
// aos projetos principais. Nome e frase ficam aqui, para o quadrado já ter o
// tamanho certo antes de a API responder; a foto e o site vêm dela.
const PROJETOS = [
  ["Topcom", "O maior torneio de programação do Espírito Santo."],
  ["IntroComp", "Programação para alunos do ensino médio público."],
  ["EletroPET", "Eletrônica e microcontroladores na prática."],
  ["Pulga", "As artes de todas as comissões do PET."],
];

const foto = (id) =>
  `${import.meta.env.VITE_API_URL}api/file/getComissionPhoto/${id}`;

// A primeira imagem da comissão é o ícone; das fotos, a primeira que não é
// em pé (as em pé ficam cortadas demais no quadrado).
const fotoDeitada = (c) => {
  const medidas = c.medidas || [];
  const deitada = c.photos
    .slice(1)
    .find((id) => {
      const m = medidas.find((f) => f._id === id);
      return m && m.width >= m.height;
    });
  return deitada || c.photos[1];
};

const Destaques = () => {
  const comissoes = useApi("api/comissions").data?.comissions || [];

  return (
    <section className="destaques bloco" aria-label="Projetos em destaque">
      {PROJETOS.map(([titulo, frase]) => {
        const c = comissoes.find((x) => x.title === titulo);
        const id = c && fotoDeitada(c);
        const site =
          c && c.tags.find((t) => t.link && slug(t.title).includes(slug(titulo)));
        return (
          <article className="destaque" key={titulo}>
            <h2 className="destaque-titulo">{titulo}</h2>
            <p className="destaque-frase">{frase}</p>
            <div className="destaque-acoes">
              <Link to={`/projetos/${slug(titulo)}`} className="botao-principal">
                Saiba mais
              </Link>
              {site && (
                <a
                  href={site.link}
                  className="botao-contorno"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {site.title.trim()}
                </a>
              )}
            </div>
            {id && (
              <img
                className="destaque-foto"
                src={`${foto(id)}?largura=800`}
                srcSet={`${foto(id)}?largura=400 400w, ${foto(id)}?largura=800 800w`}
                sizes="(max-width: 734px) 100vw, 50vw"
                alt=""
                loading="lazy"
              />
            )}
          </article>
        );
      })}
    </section>
  );
};

export default Destaques;
