import React, { useState, useEffect } from "react";
import {
  MDBBtn,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
  MDBRow,
} from "mdbreact";
import api from "../../../../services/api";
import { Phase, DivPhases } from "./style.js";
import { toast } from "react-toastify";

const inputStyle = { width: "100%" };

const EditSelection = ({ isOpen, toggle, getSelections, idSelection }) => {
  const [hourPhase, setHourPhase] = useState("");
  const [datePhase, setDatePhase] = useState("");
  const [localPhase, setLocalPhase] = useState("");
  const [selection, setSelection] = useState();

  useEffect(() => {
    const getSelection = async () => {
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
    };
    if (idSelection) getSelection();
  }, [idSelection]);

  const handleChange = (e) => {
    let aux = { ...selection };

    aux[e.target.name] = e.target.value;

    setSelection({ ...aux });
  };

  const addPhase = () => {
    let aux = {
      date: datePhase,
      hour: hourPhase,
      local: localPhase,
    };

    const selecAux = { ...selection };
    if (!selecAux.phases) selecAux.phases = [];
    selecAux.phases.push(aux);

    setSelection({ ...selecAux });
  };

  const removePhase = (index) => {
    let aux = { ...selection };
    aux.phases.splice(index, 1);

    setSelection({ ...aux });
  };

  const parseDate = (date) => {
    let d = new Date(date);

    let day = d.getUTCDate() < 10 ? "0" + d.getUTCDate() : d.getUTCDate();
    let month =
      d.getUTCMonth() + 1 < 10
        ? "0" + Number(d.getUTCMonth() + 1)
        : d.getUTCMonth() + 1;

    return `${d.getUTCFullYear()}-${month}-${day}`;
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (selection.phases.length < 2) {
      toast.error("Insira pelo menos 2 fases.");
      return null;
    }

    const token = localStorage.getItem("LOGINPET_TOKEN");

    try {
      await api.put(
        `api/selection/${idSelection}`,
        {
          title: selection.title,
          phases: selection.phases,
          dateBegin: selection.dateBegin,
          dateEnd: selection.dateEnd,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      toast.success("Dados alterados com sucesso!");
      getSelections();
    } catch (err) {
      console.log(err.response.data);
      toast.error(err.response.data);
    }
  }

  return (
    <MDBModal isOpen={isOpen} toggle={toggle} size="lg">
      <MDBModalHeader toggle={toggle}>
        Edição de Processo Seletivo
      </MDBModalHeader>
      <form onSubmit={handleSubmit}>
        <MDBModalBody>
          <MDBContainer fluid>
            <MDBRow>
              <MDBCol md="12">
                <label htmlFor="ititle">Título do PS:</label>
                <br />
                <input
                  style={inputStyle}
                  id="ititle"
                  name="title"
                  value={selection?.title || ""}
                  onChange={handleChange}
                  type="text"
                  required
                />
              </MDBCol>
            </MDBRow>
            <br />
            <fieldset>
              <legend>Período de Inscrições</legend>
              <MDBRow>
                <MDBCol md="4">
                  <label htmlFor="idateBegin">Início:</label>
                  <br />
                  <input
                    style={{ width: "100%", height: 34 }}
                    id="idateBegin"
                    name="dateBegin"
                    type="date"
                    defaultValue={
                      selection ? parseDate(selection.dateBegin) : ""
                    }
                    onChange={handleChange}
                    required
                  />
                </MDBCol>
                <MDBCol md="4">
                  <label htmlFor="idateEnd">
                    Fim <small>(data não inclusa)</small>:
                  </label>
                  <br />
                  <input
                    style={{ width: "100%", height: 34 }}
                    id="idateEnd"
                    name="dateEnd"
                    type="date"
                    defaultValue={selection ? parseDate(selection.dateEnd) : ""}
                    onChange={handleChange}
                    required
                  />
                </MDBCol>
              </MDBRow>
            </fieldset>
            <br />
            <fieldset>
              <legend>Fases da seleção</legend>
              <MDBRow>
                <MDBCol md="4">
                  <label htmlFor="idatePhase">Data:</label>
                  <br />
                  <input
                    style={{ width: "100%", height: 34 }}
                    id="idatePhase"
                    name="datePhase"
                    type="date"
                    onChange={(e) => setDatePhase(e.target.value)}
                  />
                </MDBCol>
                <MDBCol md="2">
                  <label htmlFor="ihourPhase">Horário:</label>
                  <br />
                  <input
                    style={{ width: "100%", height: 34 }}
                    id="ihourPhase"
                    name="hourPhase"
                    type="time"
                    onChange={(e) => setHourPhase(e.target.value)}
                  />
                </MDBCol>
                <MDBCol md="5">
                  <label htmlFor="ipickColor">Local:</label>
                  <br />
                  <input
                    style={inputStyle}
                    id="ilocalPhase"
                    name="localPhase"
                    value={localPhase}
                    onChange={(e) => setLocalPhase(e.target.value)}
                  />
                </MDBCol>
                <MDBCol md="1">
                  <label htmlFor="idate">Add:</label>
                  <br />
                  <MDBIcon
                    className="cyan-text pr-3"
                    icon="plus"
                    size="lg"
                    style={{ cursor: "pointer" }}
                    onClick={() => addPhase()}
                  />
                </MDBCol>
              </MDBRow>
            </fieldset>
            <MDBRow>
              <DivPhases>
                {selection?.phases.map((phase, index) => (
                  <Phase key={index}>
                    <span>{`${new Date(phase.date).getUTCDate()}/${
                      new Date(phase.date).getMonth() + 1
                    }/${new Date(phase.date).getFullYear()}`}</span>
                    <span className="infoPhase">{phase.hour}</span>
                    <span className="infoPhase">{phase.local}</span>
                    <MDBIcon
                      className="removePhase"
                      onClick={() => removePhase(index)}
                      icon="times"
                    />
                  </Phase>
                ))}
              </DivPhases>
            </MDBRow>
          </MDBContainer>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn type="reset" onClick={toggle}>
            Cancelar
          </MDBBtn>
          <MDBBtn color="primary" type="submit">
            Enviar
          </MDBBtn>
        </MDBModalFooter>{" "}
      </form>
    </MDBModal>
  );
};

export default EditSelection;
