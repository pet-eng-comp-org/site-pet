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
  const links = comission.tags.filter((t) => t.link);
  const ferramentas = comission.tags.filter((t) => !t.link);

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

      {(links.length > 0 || ferramentas.length > 0) && (
        <ul className="projeto-tags">
          {links.map((tag) => (
            <li key={tag._id}>
              <a
                className="botao-principal"
                href={tag.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {tag.title.trim()}
              </a>
            </li>
          ))}
          {ferramentas.map((tag) => (
            <li key={tag._id}>
              <span>{tag.title.trim()}</span>
            </li>
          ))}
        </ul>
      )}

      {fotos.length > 0 && (
        <div className="projeto-fotos">
          {fotos.map((id) => (
            <img key={id} src={foto(id)} alt="" loading="lazy" />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjetoPagina;
