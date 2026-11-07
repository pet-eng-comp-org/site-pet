import React, { useEffect } from "react";
import { AvisoDeFalha } from "../CargaFalhou/CargaFalhou";
import Loader from "../Loader/Loader";
import goUp from "../../utils/goUp";
import useApi from "../../services/useApi";
import GrupoDocumentos from "./GrupoDocumentos/GrupoDocumentos";
import "./Documents.css";
import useTitulo from "../../utils/useTitulo";

const Documents = () => {
  useTitulo("Documentos");
  const resposta = useApi("api/documents/");
  const documents = resposta.data?.documents;
  const falhou = Boolean(resposta.falhou || resposta.status);

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
      {documents && (
        <div className="documentos-grade">
          {documents.map((document) => (
            <GrupoDocumentos key={document._id} document={document} />
          ))}
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
