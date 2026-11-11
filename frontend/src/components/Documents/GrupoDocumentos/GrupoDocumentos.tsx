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
    <section className="mb-6 break-inside-avoid rounded-cartao bg-superficie px-8 pt-8 pb-6">
      <h2 className="mb-3 text-cartao">{document.title}</h2>
      {/* Do tablet em diante, os documentos em colunas que se alinham por
          linha: nome de duas linhas numa coluna não desalinha as divisórias
          das outras. */}
      <ul className="m-0 list-none p-0 tablet:grid tablet:grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] tablet:gap-x-8">
        {arquivos.map((file) => (
          <li key={file._id} className="border-b border-superficie-suave">
            <a
              className="flex min-h-[44px] items-center gap-3 py-1 text-texto hover:text-link focus:text-link"
              href={url + file._id}
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* Nome em duas linhas não espreme o ícone. */}
              <Icone nome="pdf" className="shrink-0 text-corpo text-acao" />
              {nomeLegivel(file.name)}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default GrupoDocumentos;
