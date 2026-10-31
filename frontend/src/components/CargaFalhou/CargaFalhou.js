import React from "react";

// Quando a API não responde: dizer o que houve e oferecer de novo, em vez de
// carregar para sempre ou afirmar algo que não se sabe ("não encontrada",
// "inscrições fechadas").
export const AvisoDeFalha = () => (
  <>
    <p className="pagina-intro" role="alert">
      Não conseguimos carregar agora. Tente de novo em alguns minutos.
    </p>
    <button
      type="button"
      className="botao-principal"
      onClick={() => window.location.reload()}
    >
      Tentar de novo
    </button>
  </>
);

const CargaFalhou = ({ titulo }) => (
  <div className="pagina">
    <h1>{titulo}</h1>
    <AvisoDeFalha />
  </div>
);

export default CargaFalhou;
