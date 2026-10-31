import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { SelectionContext } from "../SelectionContext/SelectionContext";

const ultimoDia = (data) =>
  new Date(data).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    timeZone: "America/Sao_Paulo",
  });

function OpenedSelection({ edital }) {
  const [selection] = useContext(SelectionContext);

  return (
    <section className="aviso-selecao aviso-selecao-aberta">
      <h2>Inscrições abertas até {ultimoDia(selection.dateEnd)}</h2>
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
        href={selection.formLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        Inscreva-se
      </a>
    </section>
  );
}
export default OpenedSelection;
