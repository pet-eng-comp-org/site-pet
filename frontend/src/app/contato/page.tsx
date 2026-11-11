import Contact from "../../components/Contact/Contact";
import { pagina } from "../../services/metadados";

export const metadata = pagina(
  "Contato",
  "Fale com o PET Engenharia de Computação da Ufes pelo formulário ou por e-mail.",
  "/contato"
);

export default function Contato() {
  return <Contact />;
}
