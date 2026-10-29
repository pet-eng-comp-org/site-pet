import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  SelectionContext,
  SelectionProvider,
} from "./SelectionContext/SelectionContext";
import ClosedSelection from "./ClosedSelection/ClosedSelection";
import OpenedSelection from "./OpenedSelection/OpenedSelection";
import goUp from "../../utils/goUp";
import Loader from "../Loader/Loader";
import api from "../../services/api";

import "./Subscription.css";
import useTitulo from "../../utils/useTitulo";

const urlDocumento = `${process.env.REACT_APP_API_URL}api/file/downloadDocument/`;

// O edital mais novo do grupo "Editais de seleção", para a página não fixar
// regra que muda a cada seleção (o semestre de entrada aceito, por exemplo).
const editalMaisRecente = async () => {
  try {
    const { data } = await api.get("api/documents/");
    const editais = data.documents.find((g) => /edita/i.test(g.title));
    const [maisNovo] = [...(editais?.files || [])].sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
    );
    return maisNovo && urlDocumento + maisNovo._id;
  } catch (err) {
    return null;
  }
};

function Subscription() {
  useTitulo("Faça parte do PET");
  function Content() {
    const [edital, setEdital] = useState();

    useEffect(() => {
      goUp();
      editalMaisRecente().then(setEdital);
    }, []);

    const [selection] = useContext(SelectionContext);

    const renderSelection = () => {
      if (selection === "loading") return <Loader />;

      if (!selection) return <ClosedSelection edital={edital} />;

      if (
        Date.now() > Date.parse(selection.dateBegin) &&
        Date.now() < Date.parse(selection.dateEnd)
      )
        return <OpenedSelection edital={edital} />;
      else return <ClosedSelection edital={edital} />;
    };

    return (
      <div className="pagina">
        <h1>Faça parte do PET</h1>
        <p className="pagina-intro">
          Os petianos são alunos de Engenharia de Computação que trabalham em
          projetos de ensino, pesquisa e extensão, com um professor tutor. Quem
          entra dedica 20 horas por semana ao grupo e recebe bolsa de R$&nbsp;700
          por mês, paga pelo MEC.
        </p>
        <h2>Para se inscrever, é preciso</h2>
        <ul className="requisitos">
          <li>
            cursar Engenharia de Computação na Ufes, com entrada recente no
            curso (cada edital diz a partir de qual semestre);
          </li>
          <li>ter coeficiente de rendimento acumulado (CRA) de 5,0 ou mais;</li>
          <li>ter 20 horas por semana para as atividades do grupo;</li>
          <li>
            não ter outra bolsa, exceto as de assistência estudantil (Proaeci)
            e de permanência (PBP).
          </li>
        </ul>
        <p className="pagina-intro">
          Parte das vagas é reservada a pessoas pretas, pardas e indígenas, a
          pessoas com deficiência e a pessoas trans. A seleção tem uma dinâmica
          em grupo e uma entrevista.
        </p>
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
