import React from "react";
import Icone from "../../Icone/Icone";

const url = `${import.meta.env.VITE_API_URL}api/file/downloadDocument/`;

// "planejamento_2021.pdf" vira "planejamento 2021": o ícone já diz que é PDF.
const nomeLegivel = (nome) =>
  nome
    .replace(/\.pdf$/i, "")
    .replace(/_+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const GrupoDocumentos = ({ document }) => {
  if (document.files.length === 0) return null;

  return (
    <section className="grupo-documentos">
      <h2>{document.title}</h2>
      <ul>
        {document.files.map((file) => (
          <li key={file._id}>
            <a href={url + file._id} target="_blank" rel="noopener noreferrer">
              <Icone nome="pdf" />
              {nomeLegivel(file.name)}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default GrupoDocumentos;
