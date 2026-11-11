import Icone from "../../Icone/Icone";
import { API } from "../../../services/apiUrl";
import type { GrupoDeDocumentos } from "../../../tipos";

const url = `${API}api/file/downloadDocument/`;

// "planejamento_2021.pdf" vira "planejamento 2021": o ícone já diz que é PDF.
export const nomeLegivel = (nome: string) =>
  nome
    .replace(/\.pdf$/i, "")
    .replace(/_+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// Busca sem acento e sem diferença de maiúscula: "edital 2026" acha
// "Edital nº 018/2026".
export const normaliza = (texto: string) =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const GrupoDocumentos = ({ document, busca = "" }: { document: GrupoDeDocumentos; busca?: string }) => {
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
              {nomeLegivel(file.name)}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default GrupoDocumentos;
