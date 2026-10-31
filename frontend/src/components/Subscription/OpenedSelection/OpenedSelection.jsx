import React from "react";
import { Link } from "react-router-dom";

const ultimoDia = (data) =>
  new Date(data).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    timeZone: "America/Sao_Paulo",
  });

// fim e formulario vêm da seleção aberta; a reserva de altura (Subscription)
// usa valores de exemplo.
function OpenedSelection({ edital, fim, formulario }) {
  return (
    <section className="aviso-selecao aviso-selecao-aberta">
      <h2>Inscrições abertas até {ultimoDia(fim)}</h2>
      <p>
        Antes de se inscrever, leia o{" "}
        {edital ? (
          <a
            href={edital}
            target="_blank"
            rel="noopener noreferrer"
            className="link-texto"
          >
            edital
          </a>
        ) : (
          <Link to="/documentos" className="link-texto">
            edital
          </Link>
        )}
        .
      </p>
      <a
        className="botao-principal"
        href={formulario}
        target="_blank"
        rel="noopener noreferrer"
      >
        Inscreva-se
      </a>
    </section>
  );
}
export default OpenedSelection;
