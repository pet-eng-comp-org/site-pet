import React, { useState, useEffect, useCallback } from "react";
import Table from "../../Table/Table";
import api from "../../../../services/api";
import { MDBBtn, MDBContainer, MDBIcon, MDBRow } from "mdbreact";
import { SpanIcon, DivButtons } from "./style";
import CreateSelection from "../CreateSelection/CreateSelection";
import EditSelection from "../EditSelection/EditSelection";
import CloseSelection from "../CloseSelection/CloseSelection";
import DeleteSelection from "../DeleteSelection/DeleteSelection";

const columns = [
  {
    label: "Título",
    field: "title",
    sort: "asc",
    width: 150,
  },
  {
    label: "Inscrições",
    field: "periodo",
    sort: "asc",
    width: 150,
  },
  {
    label: "Situação",
    field: "situation",
    sort: "asc",
    width: 150,
  },
  {
    label: "Ações",
    field: "actions",
    sort: "asc",
    width: 150,
  },
];

const INITIAL_ROWS = [
  {
    title: "",
    periodo: "",
    situation: "",
    actions: <></>,
  },
];

const dia = (data) =>
  new Date(data).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });

const ListSelections = () => {
  const [selections, setSelections] = useState();
  const [idSelection, setIdSelection] = useState();
  const [modalCreate, setModalCreate] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalClose, setModalClose] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [rows, setRows] = useState(INITIAL_ROWS);

  const getSelections = useCallback(async () => {
    const token = localStorage.getItem("LOGINPET_TOKEN");

    try {
      const response = await api.get("api/selection", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setSelections([...response.data.selections]);
    } catch (err) {}
  }, []);

  useEffect(() => {
    getSelections();
  }, [getSelections]);

  useEffect(() => {
    const populateTable = () => {
      const selecs = [];

      selections.forEach((selection) => {
        selecs.push({
          id: selection._id,
          title: selection.title,
          periodo: `${dia(selection.dateBegin)} a ${dia(selection.dateEnd)}`,
          situation: selection.open ? "Aberto" : "Finalizado",
          actions: (
            <DivButtons>
              {selection.open ? (
                <>
                  <SpanIcon
                    background="#ffc107"
                    onClick={() => {
                      setIdSelection(selection._id);
                      setModalEdit((old) => !old);
                    }}
                  >
                    <MDBIcon icon="edit" />
                  </SpanIcon>
                  <SpanIcon
                    background="#fd7e14"
                    onClick={() => {
                      setIdSelection(selection._id);
                      setModalClose((old) => !old);
                    }}
                  >
                    <i className="fas fa-times-circle"></i>
                  </SpanIcon>
                </>
              ) : (
                <SpanIcon
                  background="#dc3545"
                  onClick={() => {
                    setIdSelection(selection._id);
                    setModalDelete((old) => !old);
                  }}
                >
                  <MDBIcon icon="trash" />
                </SpanIcon>
              )}
            </DivButtons>
          ),
        });
      });

      setRows([...selecs]);
    };

    if (selections) populateTable();
  }, [selections]);

  return (
    <MDBContainer fluid>
      <MDBRow>
        <MDBBtn
          style={{ fontWeight: "bold" }}
          onClick={() => setModalCreate((old) => !old)}
        >
          Nova seleção
        </MDBBtn>
      </MDBRow>
      <MDBRow>
        <Table rows={rows} columns={columns} />
      </MDBRow>
      <CreateSelection
        getSelections={getSelections}
        isOpen={modalCreate}
        toggle={() => setModalCreate((old) => !old)}
      />
      <EditSelection
        idSelection={idSelection}
        getSelections={getSelections}
        isOpen={modalEdit}
        toggle={() => setModalEdit((old) => !old)}
      />
      <CloseSelection
        idSelection={idSelection}
        getSelections={getSelections}
        isOpen={modalClose}
        toggle={() => {
          setModalClose((old) => !old);
        }}
      />
      <DeleteSelection
        idSelection={idSelection}
        getSelections={getSelections}
        isOpen={modalDelete}
        toggle={() => {
          setModalDelete((old) => !old);
        }}
      />
    </MDBContainer>
  );
};

export default ListSelections;
