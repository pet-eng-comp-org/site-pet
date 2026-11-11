import Login from "../../components/Login/Login";
import { fora } from "../../services/metadados";

export const metadata = fora("Entrar no painel");

export default function Entrar() {
  return <Login />;
}
