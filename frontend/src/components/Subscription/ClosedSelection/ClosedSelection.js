import React from "react";

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
        {edital && (
          <>
            {" "}
            Para saber como funciona, leia o{" "}
            <a
              href={edital}
              target="_blank"
              rel="noopener noreferrer"
              className="link-texto"
            >
              último edital
            </a>
            .
          </>
        )}
      </p>
    </section>
  );
}
export default ClosedSelection;
