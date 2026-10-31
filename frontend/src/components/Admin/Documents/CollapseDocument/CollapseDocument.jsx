import React, { useState } from "react";
import { MDBCollapse, MDBIcon, MDBBtn } from "mdbreact";
import { Button, Row, Icon, Text, InputFile } from "./style";
import DeleteDocument from "../DeleteDocument/DeleteDocument";
import RemoveFile from "../RemoveFile/RemoveFile";
import EditDocument from "../EditDocument/EditDocument";
import api from "../../../../services/api";
import { toast } from "react-toastify";

const CollapseDocument = ({ title, files, idDocument, getDocuments }) => {
  const [collapseId, setCollapseId] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [nome, setNome] = useState("");
  const [idFile, setIdFile] = useState();
  const [modalDelete, setModalDelete] = useState(false);
  const [modalRemove, setModalRemove] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);

  const toggleCollapse = (id) => {
    setCollapseId((prev) => (prev !== id ? id : ""));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("LOGINPET_TOKEN");

    const data = new FormData();

    data.append("name", nome.trim());
    data.append("file", selectedFile);

    try {
      await api.patch(`api/documents/addFile/${idDocument}`, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      toast.success("Arquivo adicionado. Ele aparece no topo da lista.");
      setSelectedFile();
      setNome("");

      getDocuments();
    } catch (err) {
      console.log(err.response.data);
      toast.error(err.response.data);
    }
  };

  return (
    <>
      <Button color="primary" onClick={() => toggleCollapse("basicCollapse")}>
        <span>{title}</span>
        <Icon>
          <MDBIcon
            icon="edit"
            className="edit"
            onClick={() => setModalEdit((old) => !old)}
          />
          <MDBIcon
            icon="trash"
            className="delete"
            onClick={() => setModalDelete((old) => !old)}
          />
        </Icon>
      </Button>
      <MDBCollapse id="basicCollapse" isOpen={collapseId}>
        {files?.map((file, index) => (
          <Row background={index} key={index}>
            <Text
              href={`${import.meta.env.VITE_API_URL}api/file/downloadDocument/${file._id}`}
              target="_blank"
            >
              {file.name}
            </Text>
            <Icon>
              <MDBIcon
                icon="trash"
                className="delete"
                onClick={() => {
                  setIdFile(file._id);
                  setModalRemove((old) => !old);
                }}
              />
            </Icon>
          </Row>
        ))}
        <Row className="addFile">
          <InputFile>
            <label htmlFor={idDocument}>
              {selectedFile?.name || "Adicionar novo arquivo"}
            </label>
            <input
              type="file"
              name=""
              id={idDocument}
              accept="application/pdf"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
          </InputFile>
        </Row>
        {selectedFile && (
          <Row>
            <label htmlFor={`nome-${idDocument}`} style={{ margin: 0 }}>
              Nome no site
            </label>
            <input
              id={`nome-${idDocument}`}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Edital nº 018/2026, Relatório de atividades 2026"
              style={{ flex: 1, margin: "0 8px", minHeight: 36 }}
            />
            <MDBBtn
              size="sm"
              color="primary"
              disabled={nome.trim().length < 3}
              onClick={handleSubmit}
            >
              Enviar
            </MDBBtn>
          </Row>
        )}
      </MDBCollapse>
      <EditDocument
        idDocument={idDocument}
        getDocuments={getDocuments}
        isOpen={modalEdit}
        toggle={() => setModalEdit((old) => !old)}
      />
      <RemoveFile
        idDocument={idDocument}
        idFile={idFile}
        getDocuments={getDocuments}
        isOpen={modalRemove}
        toggle={() => setModalRemove((old) => !old)}
      />
      <DeleteDocument
        idDocument={idDocument}
        getDocuments={getDocuments}
        isOpen={modalDelete}
        toggle={() => setModalDelete((old) => !old)}
      />
    </>
  );
};

export default CollapseDocument;
