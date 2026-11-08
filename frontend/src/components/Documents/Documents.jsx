import React, { useEffect, useState } from "react";
import { AvisoDeFalha } from "../CargaFalhou/CargaFalhou";
import Loader from "../Loader/Loader";
import goUp from "../../utils/goUp";
import useApi from "../../services/useApi";
import GrupoDocumentos, { nomeLegivel, normaliza } from "./GrupoDocumentos/GrupoDocumentos";
import "./Documents.css";
import useTitulo from "../../utils/useTitulo";

const Documents = () => {
  useTitulo("Documentos");
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

  useEffect(() => {
    goUp();
  }, []);

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
        <div className="campo documentos-busca">
          <svg className="busca-lupa" viewBox="0 0 15 15" aria-hidden="true">
            <circle cx="6.25" cy="6.25" r="5.25" />
            <path d="M10.1 10.1 14 14" />
          </svg>
          <input
            id="documentos-busca"
            className="form-control"
            type="search"
            placeholder=" "
            autoComplete="off"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <label htmlFor="documentos-busca">Buscar documentos</label>
          {busca && (
            <button
              type="button"
              className="busca-limpar"
              aria-label="Limpar busca"
              onClick={() => {
                setBusca("");
                document.getElementById("documentos-busca").focus();
              }}
            />
          )}
        </div>
      )}
      {documents && (
        <div className="documentos-grade">
          {documents.map((document) => (
            <GrupoDocumentos key={document._id} document={document} busca={busca} />
          ))}
          {termos.length > 0 && (
            <p className="documentos-nada" role="status">
              {achados === 0
                ? "Nenhum documento com esse nome. Tente outra palavra, como \"edital\" ou o ano."
                : `${achados} ${achados === 1 ? "documento" : "documentos"}`}
            </p>
          )}
        </div>
      )}
      {documents && (
        <p className="pagina-texto documentos-mec">
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
