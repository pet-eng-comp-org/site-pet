import React from "react";

// Quando a API não responde: dizer o que houve e oferecer de novo, em vez de
// carregar para sempre ou afirmar algo que não se sabe ("não encontrada",
// "inscrições fechadas").
const CargaFalhou = ({ titulo }) => (
  <div className="pagina">
    <h1>{titulo}</h1>
    <p className="pagina-intro" role="alert">
      Não conseguimos carregar esta página agora. Confira a sua conexão e tente
      de novo.
    </p>
    <button
      type="button"
      className="botao-principal"
      onClick={() => window.location.reload()}
    >
      Tentar de novo
    </button>
  </div>
);

export default CargaFalhou;
