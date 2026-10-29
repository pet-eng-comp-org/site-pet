import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { SelectionContext } from "../SelectionContext/SelectionContext";
import SubscribeForm from "./SubscribeForm/SubscribeForm";

function OpenedSelection() {
  const [selection] = useContext(SelectionContext);

  return (
    <>
      <section className="aviso-selecao">
        <h2>Inscrições abertas</h2>
        <p>{selection?.description}</p>
        <p>
          Antes de se inscrever, leia o edital na página de{" "}
          <Link to="/documentos" className="link-texto">
            Documentos
          </Link>
          .
        </p>
      </section>
      <SubscribeForm idSelection={selection._id} />
    </>
  );
}
export default OpenedSelection;
