import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import goUp from "../../utils/goUp";
import api from "../../services/api";
import GrupoDocumentos from "./GrupoDocumentos/GrupoDocumentos";
import "./Documents.css";

const Documents = () => {
  const [documents, setDocuments] = useState();

  useEffect(() => {
    goUp();
    const getDocuments = async () => {
      try {
        const response = await api.get("api/documents/");
        setDocuments(response.data.documents);
      } catch (err) {
        console.log(err.response);
      }
    };
    getDocuments();
  }, []);

  if (!documents) {
    return (
      <div className="divloader">
        <Loader />
      </div>
    );
  }

  return (
    <div className="pagina">
      <h1>Documentos</h1>
      <p className="pagina-intro">
        Normas, planejamentos, relatórios e editais do PET Engenharia de
        Computação. Documentos de todos os grupos PET estão no{" "}
        <a
          className="link-texto"
          target="_blank"
          href="http://pet.ufes.br/documentos/"
          rel="noopener noreferrer"
        >
          site do PET Ufes
        </a>
        , e a legislação do programa, no{" "}
        <a
          className="link-texto"
          target="_blank"
          href="http://portal.mec.gov.br/component/content/article?id=12227%3Alegislacao-pet"
          rel="noopener noreferrer"
        >
          portal do MEC
        </a>
        .
      </p>
      <div className="documentos-grade">
        {documents.map((document) => (
          <GrupoDocumentos key={document._id} document={document} />
        ))}
      </div>
    </div>
  );
};

export default Documents;
