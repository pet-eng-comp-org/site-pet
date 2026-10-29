import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  SelectionContext,
  SelectionProvider,
} from "./SelectionContext/SelectionContext";
import ClosedSelection from "./ClosedSelection/ClosedSelection";
import OpenedSelection from "./OpenedSelection/OpenedSelection";
import goUp from "../../utils/goUp";
import Loader from "../Loader/Loader";

import "./Subscription.css";

function Subscription() {
  function Content() {
    useEffect(() => {
      goUp();
    }, []);

    const [selection] = useContext(SelectionContext);

    const renderSelection = () => {
      if (selection === "loading") return <Loader />;

      if (!selection) return <ClosedSelection />;

      if (
        Date.now() > Date.parse(selection.dateBegin) &&
        Date.now() < Date.parse(selection.dateEnd)
      )
        return <OpenedSelection />;
      else return <ClosedSelection />;
    };

    return (
      <div className="pagina">
        <h1>Faça parte do PET</h1>
        <p className="pagina-intro">
          Para ser petiano, é preciso passar pelo processo seletivo. Pode se
          inscrever quem:
        </p>
        <ul className="requisitos">
          <li>cursa Engenharia de Computação na Ufes, em Goiabeiras;</li>
          <li>está entre o segundo e o quarto período;</li>
          <li>tem CR de 5,0 ou mais;</li>
          <li>tem vontade de aprender e se desenvolver.</li>
        </ul>
        {renderSelection()}
        <p className="pagina-intro">
          Também dá para participar de um projeto sem ser petiano: veja os{" "}
          <Link className="link-texto" to="/projetos">
            nossos projetos
          </Link>{" "}
          e{" "}
          <Link className="link-texto" to="/contato">
            fale com a gente
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <SelectionProvider>
      <Content />
    </SelectionProvider>
  );
}

export default Subscription;
