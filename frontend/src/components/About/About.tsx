"use client";

import Team from "./Team/Team";
import useApi from "../../services/useApi";
import { AvisoDeFalha } from "../CargaFalhou/CargaFalhou";
import Loader from "../Loader/Loader";

// Números em destaque: o número grande na fonte da marca e a legenda curta
// embaixo, em quatro colunas (duas no celular).
const NUMERO = "font-marca text-[4rem] leading-none font-extrabold text-acao max-tablet:text-[3rem]";
const LEGENDA = "mx-0 mt-2 mb-0 text-corpo tracking-[-0.022em] text-texto-suave";

const About = () => {
  const membros = useApi("api/members/");
  const comissoes = useApi("api/comissions");
  const petianos = membros.data?.members.filter((p) => p.active);
  const falhou = Boolean(membros.falhou || membros.status);
  const projetos = comissoes.data?.comissions || [];

  // O texto fixo aparece já, e continua com a API fora; só a equipe espera
  // a resposta.

  return (
    <>
      {/* A equipe vem logo abaixo, na mesma página branca. */}
      <div className="pagina pb-24">
        <h1>Quem somos</h1>
        <p className="pagina-intro">
          Estudantes de Engenharia de Computação e um professor tutor, em
          ensino, pesquisa e extensão.
        </p>
        {/* Os números em destaque. Os do programa são
            do portal do MEC (gov.br/mec/pt-br/pet, conferido em 07/11/2026). */}
        <dl className="m-0 grid grid-cols-4 gap-8 text-center max-tablet:grid-cols-2 max-tablet:gap-x-4">
          <div>
            <dt className={NUMERO}>1993</dt>
            <dd className={LEGENDA}>o começo do nosso grupo</dd>
          </div>
          <div>
            <dt className={NUMERO}>13</dt>
            <dd className={LEGENDA}>grupos PET na Ufes</dd>
          </div>
          <div>
            <dt className={NUMERO}>881</dt>
            <dd className={LEGENDA}>grupos PET no Brasil</dd>
          </div>
          <div>
            <dt className={NUMERO}>+10 mil</dt>
            <dd className={LEGENDA}>bolsistas no país</dd>
          </div>
        </dl>
        <p className="mt-10 mb-0 text-center">
          <a
            className="link-mais"
            href="https://www.sbc.org.br/grupos-pet/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Os outros grupos PET de computação do país
          </a>
        </p>
        {falhou && <AvisoDeFalha />}
      </div>
      {!petianos && !falhou && (
        <div className="carregando-dados">
          <Loader />
        </div>
      )}
      {petianos && <Team petianos={petianos} projetos={projetos} />}
    </>
  );
};

export default About;
