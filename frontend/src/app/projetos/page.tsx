import Projects from "../../components/Projects/Projects";
import { ComDadosIniciais } from "../../services/useApi";
import { buscarVarios } from "../../services/dadosDoServidor";
import { pagina } from "../../services/metadados";

export const metadata = pagina(
  "Projetos",
  "IntroComp, Topcom, PET Game Jam, monitorias e os outros projetos do grupo.",
  "/projetos"
);

export default async function Projetos() {
  const dados = await buscarVarios(["api/comissions"]);
  return (
    <ComDadosIniciais dados={dados}>
      <Projects />
    </ComDadosIniciais>
  );
}
