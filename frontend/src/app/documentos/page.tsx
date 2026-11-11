import Documents from "../../components/Documents/Documents";
import { ComDadosIniciais } from "../../services/useApi";
import { buscarVarios } from "../../services/dadosDoServidor";
import { pagina } from "../../services/metadados";

export const metadata = pagina(
  "Documentos",
  "Normas, planejamentos, relatórios e editais de seleção do PET Engenharia de Computação.",
  "/documentos"
);

export default async function Documentos() {
  const dados = await buscarVarios(["api/documents/"]);
  return (
    <ComDadosIniciais dados={dados}>
      <Documents />
    </ComDadosIniciais>
  );
}
