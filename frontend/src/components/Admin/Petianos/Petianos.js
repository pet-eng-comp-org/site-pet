import React, { useState, useEffect, useCallback } from "react";
import Table from "../Table/Table";
import api from "../../../services/api";
import { MDBBtn, MDBContainer, MDBIcon, MDBRow } from "mdbreact";
import { SpanIcon, DivButtons } from "./style";
import CreatePetiano from "./CreatePetiano/CreatePetiano";
import DeletePetiano from "./DeletePetiano/DeletePetiano";
import ExitPetiano from "./ExitPetiano/ExitPetiano";
import EditPetiano from "./EditPetiano/EditPetiano";

const columns = [
  {
    label: "Nome",
    field: "name",
    sort: "asc",
    width: 150,
  },
  {
    label: "E-mail",
    field: "email",
    sort: "asc",
    width: 270,
  },
  {
    label: "Telefone",
    field: "cellphone",
    sort: "asc",
    width: 200,
  },
  {
    label: "Situação",
    field: "situation",
    sort: "asc",
    width: 100,
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
    cellphone: "",
    situation: "",
    actions: <></>,
  },
];

const Petianos = () => {
  const [petianos, setPetianos] = useState();
  const [idPetiano, setIdPetiano] = useState();
  const [modalCreate, setModalCreate] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalExit, setModalExit] = useState(false);
  const [rows, setRows] = useState(INITIAL_ROWS);

  const getPetianos = useCallback(async () => {
    const token = localStorage.getItem("LOGINPET_TOKEN");

    try {
      const response = await api.get("api/members/all", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setPetianos([...response.data.members]);
    } catch (err) {
      console.log(err.response.data);
    }
  }, []);

  useEffect(() => {
    getPetianos();
  }, [getPetianos]);

  useEffect(() => {
    const populateTable = () => {
      const pets = [];

      petianos.forEach((petiano) => {
        pets.push({
          id: petiano._id,
          name: petiano.memberName,
          email: petiano.email,
          cellphone: petiano.phone,
          situation: petiano.active ? "Ativo" : "Egresso",
          actions: (
            <DivButtons>
              {petiano.active && (
                <>
                  <SpanIcon
                    background="#ffc107"
                    onClick={() => {
                      setIdPetiano(petiano._id);
                      setModalEdit((old) => !old);
                    }}
                  >
                    <MDBIcon icon="edit" />
                  </SpanIcon>

                  <SpanIcon
                    background="#fd7e14"
                    onClick={() => {
                      setIdPetiano(petiano._id);
                      setModalExit((old) => !old);
                    }}
                  >
                    <MDBIcon icon="sign-out-alt" />
                  </SpanIcon>
                </>
              )}
              <SpanIcon
                background="#dc3545"
                onClick={() => {
                  setIdPetiano(petiano._id);
                  setModalDelete((old) => !old);
                }}
              >
                <MDBIcon icon="trash" />
              </SpanIcon>
            </DivButtons>
          ),
        });
      });

      setRows([...pets]);
    };

    if (petianos) populateTable();
  }, [petianos]);

  return (
    <MDBContainer fluid>
      <MDBRow>
        <MDBBtn
          style={{ fontWeight: "bold" }}
          onClick={() => setModalCreate((old) => !old)}
        >
          Cadastrar novo Petiano
        </MDBBtn>
      </MDBRow>
      <MDBRow>
        <Table rows={rows} columns={columns} />
      </MDBRow>
      <CreatePetiano
        getPetianos={getPetianos}
        isOpen={modalCreate}
        toggle={() => setModalCreate((old) => !old)}
      />
      <EditPetiano
        idPetiano={idPetiano}
        getPetianos={getPetianos}
        isOpen={modalEdit}
        toggle={() => setModalEdit((old) => !old)}
      />
      <ExitPetiano
        idPetiano={idPetiano}
        getPetianos={getPetianos}
        isOpen={modalExit}
        toggle={() => setModalExit((old) => !old)}
      />
      <DeletePetiano
        idPetiano={idPetiano}
        getPetianos={getPetianos}
        isOpen={modalDelete}
        toggle={() => setModalDelete((old) => !old)}
      />
    </MDBContainer>
  );
};

export default Petianos;
