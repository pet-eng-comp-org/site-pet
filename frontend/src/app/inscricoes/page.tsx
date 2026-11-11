import Subscription from "../../components/Subscription/Subscription";
import { ComDadosIniciais } from "../../services/useApi";
import { buscarVarios } from "../../services/dadosDoServidor";
import { pagina } from "../../services/metadados";

export const metadata = pagina(
  "Faça parte do PET",
  "Requisitos, bolsa e seleção para entrar no PET Engenharia de Computação da Ufes.",
  "/inscricoes"
);

export default async function Inscricoes() {
  const dados = await buscarVarios(["api/documents/"]);
  return (
    <ComDadosIniciais dados={dados}>
      <Subscription />
    </ComDadosIniciais>
  );
}
