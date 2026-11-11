import About from "../../components/About/About";
import { ComDadosIniciais } from "../../services/useApi";
import { buscarVarios } from "../../services/dadosDoServidor";
import { pagina } from "../../services/metadados";

export const metadata = pagina(
  "Quem somos",
  "Os petianos atuais e o professor tutor do PET Engenharia de Computação da Ufes.",
  "/sobre"
);

export default async function Sobre() {
  const dados = await buscarVarios(["api/members/", "api/comissions"]);
  return (
    <ComDadosIniciais dados={dados}>
      <About />
    </ComDadosIniciais>
  );
}
