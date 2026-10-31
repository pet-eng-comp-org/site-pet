import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  SelectionContext,
  SelectionProvider,
} from "./SelectionContext/SelectionContext";
import ClosedSelection from "./ClosedSelection/ClosedSelection";
import OpenedSelection from "./OpenedSelection/OpenedSelection";
import goUp from "../../utils/goUp";
import useApi from "../../services/useApi";

import "./Subscription.css";
import useTitulo from "../../utils/useTitulo";

const urlDocumento = `${import.meta.env.VITE_API_URL}api/file/downloadDocument/`;

// O edital mais novo do grupo "Editais de seleção", para a página não fixar
// regra que muda a cada seleção (o semestre de entrada aceito, por exemplo).
// undefined enquanto carrega; null se não há edital ou a API falhou.
const editalMaisRecente = (resposta) => {
  if (resposta.carregando) return undefined;
  if (!resposta.data) return null;
  const editais = resposta.data.documents.find((g) => /edita/i.test(g.title));
  const [maisNovo] = [...(editais?.files || [])].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
  );
  return maisNovo ? urlDocumento + maisNovo._id : null;
};

// A API não respondeu: dizer isso e oferecer de novo, sem afirmar que as
// inscrições estão abertas ou fechadas.
const FalhaInscricoes = () => (
  <section className="aviso-selecao" role="alert">
    <h2>Não conseguimos carregar as inscrições</h2>
    <p>
      Tente de novo em alguns minutos ou veja o Instagram{" "}
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
    <button
      type="button"
      className="botao-principal"
      onClick={() => window.location.reload()}
    >
      Tentar de novo
    </button>
  </section>
);

function Content() {
  const edital = editalMaisRecente(useApi("api/documents/"));

  useEffect(() => {
    goUp();
  }, []);

  const [selection] = useContext(SelectionContext);

  const renderSelection = () => {
    if (selection === "loading" || edital === undefined) return null;
    if (selection === "falhou") return <FalhaInscricoes />;

    if (
      selection &&
      Date.now() > Date.parse(selection.dateBegin) &&
      Date.now() < Date.parse(selection.dateEnd)
    )
      return (
        <OpenedSelection
          edital={edital}
          fim={selection.dateEnd}
          formulario={selection.formLink}
        />
      );
    return <ClosedSelection edital={edital} />;
  };

  // O lugar do aviso tem desde o início a altura do maior dos três avisos
  // (fechado, aberto e falha), desenhados invisíveis no mesmo lugar: quando o
  // verdadeiro chega, nada embaixo dele se move, com a fonte de qualquer
  // aparelho. Espera também o edital, que muda o texto do aviso.
  const aviso = (
    <div className="aviso-lugar">
      <div className="aviso-reserva" aria-hidden="true">
        <ClosedSelection edital="#" />
      </div>
      <div className="aviso-reserva" aria-hidden="true">
        <OpenedSelection edital="#" fim="2026-09-30T12:00:00Z" formulario="#" />
      </div>
      <div className="aviso-reserva" aria-hidden="true">
        <FalhaInscricoes />
      </div>
      {renderSelection()}
    </div>
  );

  return (
    <div className="pagina faca-parte">
      <h1>Faça parte do PET</h1>
      {/* Quem chega quer saber primeiro se pode se inscrever agora. */}
      {aviso}
      <div className="faca-parte-texto">
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
    </div>
  );
}

function Subscription() {
  useTitulo("Faça parte do PET");

  return (
    <SelectionProvider>
      <Content />
    </SelectionProvider>
  );
}

export default Subscription;
