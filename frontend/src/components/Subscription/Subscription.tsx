"use client";

import Link from "next/link";
import ClosedSelection from "./ClosedSelection/ClosedSelection";
import OpenedSelection from "./OpenedSelection/OpenedSelection";
import useApi, { type Estado } from "../../services/useApi";
import { API } from "../../services/apiUrl";
import type { Respostas } from "../../tipos";


import { AVISO, FRASE } from "./aviso";

const urlDocumento = `${API}api/file/downloadDocument/`;

// O edital mais novo do grupo "Editais de seleção", para a página não fixar
// regra que muda a cada seleção (o semestre de entrada aceito, por exemplo).
// undefined enquanto carrega; null se não há edital ou a API falhou.
const editalMaisRecente = (resposta: Estado<Respostas["api/documents/"]>) => {
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
  <section className={AVISO} role="alert">
    <h2>Não conseguimos carregar as inscrições</h2>
    <p className={FRASE}>
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
      className="botao-principal mt-4"
      onClick={() => window.location.reload()}
    >
      Tentar de novo
    </button>
  </section>
);

function Subscription() {
  const edital = editalMaisRecente(useApi("api/documents/"));

  const resposta = useApi("api/selection/openSelection");
  // Resposta da API sem seleção aberta é "fechadas"; sem resposta, ou com
  // erro do servidor (5xx), não dá para saber.
  const selection = resposta.carregando
    ? "loading"
    : resposta.falhou || (resposta.status !== undefined && resposta.status >= 500)
      ? "falhou"
      : resposta.data?.selection || null;

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
    // Na tela larga, o aviso fica na coluna da direita, sempre à vista
    // enquanto a pessoa lê. No celular, logo abaixo do título.
    <div className="mb-10 grid max-w-[36rem] *:col-start-1 *:row-start-1 *:self-start desktop:sticky desktop:top-24 desktop:col-start-2 desktop:row-start-3 desktop:mb-0 desktop:max-w-none">
      <div className="invisible" aria-hidden="true">
        <ClosedSelection edital="#" />
      </div>
      <div className="invisible" aria-hidden="true">
        <OpenedSelection edital="#" fim="2026-09-30T12:00:00Z" formulario="#" />
      </div>
      <div className="invisible" aria-hidden="true">
        <FalhaInscricoes />
      </div>
      {renderSelection()}
    </div>
  );

  return (
    // Tela larga: o texto na medida de leitura, à esquerda, e o aviso na
    // coluna da direita, com pelo menos 20rem, para não virar uma tira
    // estreita perto de 1069 px.
    <div className="pagina desktop:grid desktop:grid-cols-[minmax(0,36rem)_minmax(20rem,1fr)] desktop:items-start desktop:gap-x-12">
      <h1 className="desktop:col-span-full">Faça parte do PET</h1>
      <p className="pagina-intro desktop:col-span-full">
        Quem entra dedica 20 horas por semana ao grupo e recebe bolsa de
        R$&nbsp;700 por mês, paga pelo MEC.
      </p>
      {/* Quem chega quer saber primeiro se pode se inscrever agora. */}
      {aviso}
      <div className="desktop:col-start-1 desktop:row-start-3">
        <h2 className="titulo-bloco">Para se inscrever, é preciso</h2>
        <ul className="mt-0 mb-6 max-w-[36rem] pl-6 text-corpo leading-[1.47059]">
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
        <p className="pagina-texto">
          Parte das vagas é reservada a pessoas pretas, pardas e indígenas, a
          pessoas com deficiência e a pessoas trans. A seleção tem uma dinâmica
          em grupo e uma entrevista.
        </p>
        <p className="pagina-texto">
          Também dá para participar de um projeto sem ser petiano: veja os{" "}
          <Link className="link-texto" href="/projetos">
            nossos projetos
          </Link>{" "}
          e{" "}
          <Link className="link-texto" href="/contato">
            fale com a gente
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default Subscription;
