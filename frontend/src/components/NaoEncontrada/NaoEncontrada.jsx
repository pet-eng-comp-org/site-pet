import React from "react";
import { Link } from "react-router-dom";
import useTitulo from "../../utils/useTitulo";

const NaoEncontrada = () => {
  useTitulo("Página não encontrada");

  return (
    <div className="pagina">
      <h1>Página não encontrada</h1>
      <p className="pagina-intro">
        O endereço pode estar errado ou a página mudou de lugar.
      </p>
      <Link className="botao-principal" to="/">
        Ir para a página inicial
      </Link>
    </div>
  );
};

export default NaoEncontrada;
