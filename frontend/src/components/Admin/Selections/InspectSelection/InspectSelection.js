import React, { useState, useEffect, useCallback } from "react";
import { MDBContainer, MDBIcon, MDBRow } from "mdbreact";
import Table from "../../Table/Table";
import { SpanIcon, DivButtons } from "./style";
import api from "../../../../services/api";
import { toast } from "react-toastify";
import DeleteInscription from "../DeleteInscription/DeleteInscription";

const columns = [
  {
    label: "Nome",
    field: "name",
    sort: "asc",
    width: 150,
  },
  {
    label: "Email",
    field: "email",
    sort: "asc",
    width: 150,
  },
  {
    label: "Telefone",
    field: "phone",
    sort: "asc",
    width: 150,
  },
  {
    label: "Status",
    field: "status",
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
    name: "",
    email: "",
    phone: "",
    status: "",
    actions: <></>,
  },
];

const InspectSelection = ({ idSelection }) => {
  const [selection, setSelection] = useState();
  const [rows, setRows] = useState(INITIAL_ROWS);
  const [idInscription, setIdInscription] = useState();
  const [modalDelete, setModalDelete] = useState(false);

  const getSelection = useCallback(async () => {
    const token = localStorage.getItem("LOGINPET_TOKEN");

    try {
      const response = await api.get(`api/selection/${idSelection}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setSelection(response.data.selection);
    } catch (err) {
      console.log(err.response.data);
    }
  }, [idSelection]);

  useEffect(() => {
    if (idSelection) getSelection();
  }, [idSelection, getSelection]);

  const handleDownload = useCallback(async (id, name) => {
    const token = localStorage.getItem("LOGINPET_TOKEN");

    try {
      const response = await api.get(`api/file/downloadInscription/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
        responseType: "blob",
      });

      const fileUrl = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      const fileName = `${name.replaceAll(" ", "")}.zip`;
      link.setAttribute("href", fileUrl);
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      toast.error(err.response.data);
    }
  }, []);

  const handleAccept = useCallback(
    async (id, index) => {
      const token = localStorage.getItem("LOGINPET_TOKEN");

      try {
        await api.patch(
          `api/inscriptions/acceptInscription/${id}`,
          { accepted: true },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        let aux = { ...selection };
        aux.inscriptions[index].accepted = true;
        setSelection({ ...aux });
        toast.success("Inscrição aceita!");
      } catch (err) {
        toast.error(err.response.data);
      }
    },
    [selection]
  );

  useEffect(() => {
    const populateTable = () => {
      const inscrips = [];
      selection.inscriptions.forEach((inscription, index) => {
        inscrips.push({
          id: inscription._id,
          name: inscription.name,
          email: inscription.email,
          phone: inscription.phone,
          status: inscription.accepted ? "Confirmada" : "Em Análise",
          actions: (
            <DivButtons>
              {selection.open && (
                <>
                  <SpanIcon
                    background="#007bff"
                    onClick={() => {
                      handleDownload(inscription.file, inscription.name);
                    }}
                  >
                    <MDBIcon icon="download" />
                  </SpanIcon>
                  {!inscription.accepted && (
                    <SpanIcon
                      background="#28a745"
                      onClick={() => {
                        handleAccept(inscription._id, index);
                      }}
                    >
                      <MDBIcon icon="check-circle" />
                    </SpanIcon>
                  )}
                </>
              )}
              <SpanIcon
                background="#dc3545"
                onClick={() => {
                  setIdInscription(inscription._id);
                  setModalDelete((old) => !old);
                }}
              >
                <MDBIcon icon="trash" />
              </SpanIcon>
            </DivButtons>
          ),
        });
      });

      setRows([...inscrips]);
    };

    if (selection) populateTable();
  }, [selection, handleDownload, handleAccept]);

  return (
    <MDBContainer fluid>
      <MDBRow>
        <div>
          <h3>Inscritos em {selection?.title}</h3>
        </div>
        <Table rows={rows} columns={columns} />
      </MDBRow>
      <DeleteInscription
        idInscription={idInscription}
        getSelection={getSelection}
        isOpen={modalDelete}
        toggle={() => {
          setModalDelete((old) => !old);
        }}
      />
    </MDBContainer>
  );
};

export default InspectSelection;
