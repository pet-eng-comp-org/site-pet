import React from "react";

// O cartão inteiro é o botão: abre a comissão com fotos e descrição completa.
function Project({ title, description, icon, onClick }) {
  const src = icon
    ? `${process.env.REACT_APP_API_URL}api/file/getComissionPhoto/${icon}`
    : "";

  return (
    <button type="button" className="projeto" onClick={onClick}>
      <span className="projeto-icone">
        {src && <img src={src} alt="" loading="lazy" />}
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      <span className="projeto-mais">Saiba mais</span>
    </button>
  );
}

export default Project;
