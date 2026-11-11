import NaoEncontrada from "../components/NaoEncontrada/NaoEncontrada";
import { fora } from "../services/metadados";

export const metadata = fora("Página não encontrada");

export default function NaoExiste() {
  return <NaoEncontrada />;
}
