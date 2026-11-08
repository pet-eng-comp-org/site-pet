import React from "react";
import Icone from "../../Icone/Icone";

const url = `${import.meta.env.VITE_API_URL}api/file/downloadDocument/`;

// "planejamento_2021.pdf" vira "planejamento 2021": o ícone já diz que é PDF.
export const nomeLegivel = (nome) =>
  nome
    .replace(/\.pdf$/i, "")
    .replace(/_+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// "250396" bytes vira "245 KB": o tamanho diz se vale abrir no celular.
const tamanho = (bytes) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

// Busca sem acento e sem diferença de maiúscula: "edital 2026" acha
// "Edital nº 018/2026".
export const normaliza = (texto) =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const GrupoDocumentos = ({ document, busca = "" }) => {
  const termos = normaliza(busca).split(/\s+/).filter(Boolean);
  const arquivos = document.files.filter((f) => {
    const nome = normaliza(`${nomeLegivel(f.name)} ${document.title}`);
    return termos.every((t) => nome.includes(t));
  });
  if (arquivos.length === 0) return null;

  return (
    <section className="grupo-documentos">
      <h2>{document.title}</h2>
      <ul>
        {arquivos.map((file) => (
          <li key={file._id}>
            <a href={url + file._id} target="_blank" rel="noopener noreferrer">
              <Icone nome="pdf" />
              <span>
                {nomeLegivel(file.name)}
                {file.size > 0 && <small>PDF, {tamanho(file.size)}</small>}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default GrupoDocumentos;
