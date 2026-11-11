"use client";

import { useState } from "react";
import { AvisoDeFalha } from "../CargaFalhou/CargaFalhou";
import Loader from "../Loader/Loader";
import useApi from "../../services/useApi";
import GrupoDocumentos, { nomeLegivel, normaliza } from "./GrupoDocumentos/GrupoDocumentos";

const Documents = () => {
  const resposta = useApi("api/documents/");
  const documents = resposta.data?.documents;
  const falhou = Boolean(resposta.falhou || resposta.status);
  const [busca, setBusca] = useState("");
  const termos = normaliza(busca).split(/\s+/).filter(Boolean);
  const achados = (documents || []).reduce(
    (n, d) =>
      n +
      d.files.filter((f) =>
        termos.every((t) => normaliza(`${nomeLegivel(f.name)} ${d.title}`).includes(t))
      ).length,
    0
  );

  return (
    <div className="pagina">
      <h1>Documentos</h1>
      <p className="pagina-intro">
        Normas, planejamentos, relatórios e editais do PET Engenharia de
        Computação.
      </p>
      {/* O título e a abertura são fixos: aparecem já, e os documentos
          entram embaixo quando a API responde. */}
      {falhou && <AvisoDeFalha />}
      {!documents && !falhou && (
        <div className="carregando-dados">
          <Loader />
        </div>
      )}
      {/* Busca de central de ajuda: lupa à esquerda, o nome dentro do campo
          que sobe ao digitar, e o × para limpar. Filtra enquanto se digita. */}
      {documents && (
        // A lupa a 17 px da borda e o texto a 49 px; a lupa fica a meia força
        // com o campo vazio.
        <div className="group campo">
          <svg
            className="pointer-events-none absolute top-1/2 left-[17px] z-1 -mt-[7.5px] size-[15px] fill-none stroke-texto stroke-[1.3] opacity-50 [stroke-linecap:round] group-has-focus:opacity-100 group-has-[input:not(:placeholder-shown)]:opacity-100"
            viewBox="0 0 15 15"
            aria-hidden="true"
          >
            <circle cx="6.25" cy="6.25" r="5.25" />
            <path d="M10.1 10.1 14 14" />
          </svg>
          <input
            id="documentos-busca"
            // No foco a borda tem 2 px: 1 px sai da folga para o texto não
            // andar. Sem o × do navegador: o × é o nosso.
            className="form-control appearance-none px-[49px] focus:px-[48px] [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
            type="search"
            placeholder=" "
            autoComplete="off"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <label className="left-[49px]" htmlFor="documentos-busca">
            Buscar documentos
          </label>
          {busca && (
            <button
              type="button"
              // Círculo cinza de 15 px com o ×, e toque de 44 px.
              className="absolute top-1/2 right-[3px] -mt-[22px] size-[44px] cursor-pointer border-0 bg-transparent p-0 before:absolute before:inset-0 before:m-auto before:size-[15px] before:rounded-full before:bg-[#6e6e73] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-[13px] after:leading-none after:text-white after:content-['×']"
              aria-label="Limpar busca"
              onClick={() => {
                setBusca("");
                document.getElementById("documentos-busca")?.focus();
              }}
            />
          )}
        </div>
      )}
      {documents && (
        // Um grupo por linha, na largura toda: em duas colunas de grupos, o
        // mais alto abria um vazio ao lado do outro.
        <div className="mt-6">
          {documents.map((document) => (
            <GrupoDocumentos key={document._id} document={document} busca={busca} />
          ))}
          {termos.length > 0 && (
            <p className="text-texto-suave" role="status">
              {achados === 0
                ? "Nenhum documento com esse nome. Tente outra palavra, como \"edital\" ou o ano."
                : `${achados} ${achados === 1 ? "documento" : "documentos"}`}
            </p>
          )}
        </div>
      )}
      {documents && (
        <p className="pagina-texto mt-8">
          O programa, que existe desde 1979, foi instituído com o nome atual pela{" "}
          <a
            className="link-texto"
            target="_blank"
            href="https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2005/lei/l11180.htm"
            rel="noopener noreferrer"
          >
            Lei nº 11.180/2005
          </a>
          , e o resto da legislação está no{" "}
          <a
            className="link-texto"
            target="_blank"
            href="https://www.gov.br/mec/pt-br/areas-de-atuacao/educacao-superior/pet"
            rel="noopener noreferrer"
          >
            portal do MEC
          </a>
          .
        </p>
      )}
    </div>
  );
};

export default Documents;
