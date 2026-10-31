import React from "react";
import { Link } from "react-router-dom";
import slug from "../../../utils/slug";

// O cartão mostra só a primeira frase da descrição, inteira; o resto fica na
// página do projeto. Cortar o texto em 3 linhas partia palavras ao meio.
const primeiraFrase = (texto) => texto.match(/^[\s\S]*?[.!?](?=\s|$)/)?.[0] || texto;

// O cartão inteiro é o link para a página do projeto.
function Project({ title, description, icon, onClick }) {
  const src = icon
    ? `${import.meta.env.VITE_API_URL}api/file/getComissionPhoto/${icon}`
    : "";

  return (
    <Link className="projeto" to={`/projetos/${slug(title)}`} onClick={onClick}>
      <span className="projeto-icone">
        {src && <img src={src} alt="" loading="lazy" />}
      </span>
      <h2>{title}</h2>
      <p>{primeiraFrase(description)}</p>
      <span className="projeto-mais">Saiba mais</span>
    </Link>
  );
}

export default Project;
