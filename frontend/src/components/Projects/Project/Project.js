import React from "react";
import { Link } from "react-router-dom";
import slug from "../../../utils/slug";

// O cartão inteiro é o link para a página do projeto.
function Project({ title, description, icon }) {
  const src = icon
    ? `${process.env.REACT_APP_API_URL}api/file/getComissionPhoto/${icon}`
    : "";

  return (
    <Link className="projeto" to={`/projetos/${slug(title)}`}>
      <span className="projeto-icone">
        {src && <img src={src} alt="" loading="lazy" />}
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      <span className="projeto-mais">Saiba mais</span>
    </Link>
  );
}

export default Project;
