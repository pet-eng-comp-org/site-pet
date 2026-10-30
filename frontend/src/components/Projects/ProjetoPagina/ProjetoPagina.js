import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../services/api";
import goUp from "../../../utils/goUp";
import slug from "../../../utils/slug";
import useTitulo from "../../../utils/useTitulo";
import Loader from "../../Loader/Loader";
import NaoEncontrada from "../../NaoEncontrada/NaoEncontrada";
import "./ProjetoPagina.css";

const foto = (id) =>
  `${process.env.REACT_APP_API_URL}api/file/getComissionPhoto/${id}`;

// Cada foto aparece inteira, na proporção dela, em linhas de mesma altura.
// A API manda largura e altura, então o espaço é reservado antes de a foto
// chegar e a página não pula.
const proporcao = (comission, id) => {
  const m = (comission.medidas || []).find((f) => f._id === id);
  return m ? m.width / m.height : 1.5;
};

// Cada projeto tem endereço próprio, para dar para mandar o link a alguém.
// A primeira imagem da comissão é o ícone do cartão; as outras são fotos
// (na lista da API, cada foto vem só como o id do arquivo).
function ProjetoPagina() {
  const { projeto } = useParams();
  const [comission, setComission] = useState();

  useEffect(() => {
    goUp();
    api
      .get("api/comissions")
      .then(({ data }) =>
        setComission(
          data.comissions.find((c) => slug(c.title) === projeto) || null
        )
      )
      .catch(() => setComission(null));
  }, [projeto]);

  useTitulo(comission?.title || "Projetos");

  if (comission === undefined)
    return (
      <div className="divloader">
        <Loader />
      </div>
    );
  if (comission === null) return <NaoEncontrada />;

  const fotos = comission.photos.slice(1);
  // Os canais do próprio projeto ("Site do Topcom", "Instagram do Mobiliza
  // PET") são ações: o site é o botão principal; os outros, links. O resto
  // das etiquetas são ferramentas, mostradas como rótulo, com ou sem link.
  const doProjeto = (t) =>
    t.link && slug(t.title).includes(slug(comission.title));
  const canais = comission.tags.filter(doProjeto);
  const ferramentas = comission.tags.filter((t) => !doProjeto(t));

  return (
    <div className="pagina">
      <Link
        className="projeto-voltar link-texto"
        to={{ pathname: "/projetos", state: { voltar: true } }}
      >
        Todos os projetos
      </Link>
      <h1>{comission.title}</h1>
      <p className="pagina-intro projeto-descricao">{comission.description}</p>

      {canais.length > 0 && (
        <div className="projeto-acoes">
          {canais.map((tag) => (
            <a
              key={tag._id}
              className={/^site\b/i.test(tag.title.trim()) ? "botao-principal" : "botao-link"}
              href={tag.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {tag.title.trim()}
            </a>
          ))}
        </div>
      )}

      {ferramentas.length > 0 && (
        <ul className="projeto-tags" aria-label="Ferramentas">
          {ferramentas.map((tag) => (
            <li key={tag._id}>
              {tag.link ? (
                <a href={tag.link} target="_blank" rel="noopener noreferrer">
                  {tag.title.trim()}
                </a>
              ) : (
                <span>{tag.title.trim()}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {fotos.length > 0 && (
        <div className="projeto-fotos">
          {fotos.map((id) => (
            <img
              key={id}
              src={foto(id)}
              alt=""
              loading="lazy"
              style={{ "--proporcao": proporcao(comission, id) }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjetoPagina;
