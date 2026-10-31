import React from "react";
import { Link } from "react-router-dom";

// Mesma estrutura do aviso de inscrições abertas (título, uma frase, uma
// ação), para os dois terem quase a mesma altura e a página não pular quando
// o aviso chega (ver a reserva em Subscription.jsx).
function ClosedSelection({ edital }) {
  return (
    <section className="aviso-selecao">
      <h2>Inscrições fechadas</h2>
      <p>
        Abrimos seleção uma ou duas vezes por ano e avisamos no Instagram{" "}
        <a
          href="https://www.instagram.com/petengcomp/"
          target="_blank"
          rel="noopener noreferrer"
          className="link-texto"
        >
          @petengcomp
        </a>
        .
      </p>
      {edital ? (
        <a
          className="botao-link"
          href={edital}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ler o último edital
        </a>
      ) : (
        <Link className="botao-link" to="/documentos">
          Ver os editais
        </Link>
      )}
    </section>
  );
}
export default ClosedSelection;
