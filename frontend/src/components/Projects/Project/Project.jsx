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
    // O nome do link é o título; a frase vem como descrição. Antes o leitor
    // de tela lia o cartão inteiro como nome, com 150 caracteres.
    <Link
      className="projeto"
      to={`/projetos/${slug(title)}`}
      onClick={onClick}
      aria-labelledby={`projeto-${slug(title)}`}
      aria-describedby={`projeto-${slug(title)}-frase`}
    >
      {/* O ícone (traço branco) vira máscara pintada no verde de ação. */}
      <span
        className="projeto-icone"
        style={src ? { "--icone": `url("${src}")` } : undefined}
      />
      <h2 id={`projeto-${slug(title)}`}>{title}</h2>
      <p id={`projeto-${slug(title)}-frase`}>{primeiraFrase(description)}</p>
      {/* O cartão inteiro é o link; o botão "›" no canto só mostra isso. */}
      <span className="projeto-ir" aria-hidden="true" />
    </Link>
  );
}

export default Project;
