import Home from "../components/Home/Home";
import { ComDadosIniciais } from "../services/useApi";
import { buscarVarios } from "../services/dadosDoServidor";

export const metadata = { alternates: { canonical: "/" } };

export default async function Inicio() {
  const dados = await buscarVarios(["api/news/", "api/comissions"]);
  return (
    <ComDadosIniciais dados={dados}>
      <Home />
    </ComDadosIniciais>
  );
}
