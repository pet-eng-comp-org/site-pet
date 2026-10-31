import React, { useEffect, useState } from "react";
import { AvisoDeFalha } from "../CargaFalhou/CargaFalhou";
import Loader from "../Loader/Loader";
import goUp from "../../utils/goUp";
import api from "../../services/api";
import GrupoDocumentos from "./GrupoDocumentos/GrupoDocumentos";
import "./Documents.css";
import useTitulo from "../../utils/useTitulo";

const Documents = () => {
  useTitulo("Documentos");
  const [documents, setDocuments] = useState();
  const [falhou, setFalhou] = useState(false);

  useEffect(() => {
    goUp();
    const getDocuments = async () => {
      try {
        const response = await api.get("api/documents/");
        setDocuments(response.data.documents);
      } catch (err) {
        setFalhou(true);
      }
    };
    getDocuments();
  }, []);

  return (
    <div className="pagina">
      <h1>Documentos</h1>
      <p className="pagina-intro">
        Normas, planejamentos, relatórios e editais do PET Engenharia de
        Computação. A legislação do programa está no{" "}
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
    </div>
  );
};

export default Documents;
