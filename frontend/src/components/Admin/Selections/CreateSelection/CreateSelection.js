import React, { useState } from "react";
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

const CreateSelection = ({ isOpen, toggle, getSelections }) => {
  const [title, setTitle] = useState("");
  const [phases, setPhases] = useState([]);
  const [hourPhase, setHourPhase] = useState("");
  const [datePhase, setDatePhase] = useState("");
  const [localPhase, setLocalPhase] = useState("");
  const [dateBegin, setDateBegin] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  const addPhase = () => {
    let aux = {
      date: datePhase,
      hour: hourPhase,
      local: localPhase,
    };

    setPhases([...phases, aux]);
  };

  const removePhase = (index) => {
    let aux = [...phases];
    aux.splice(index, 1);

    setPhases([...aux]);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (phases.length < 1) {
      toast.error("Insira pelo menos 2 fases.");
      return null;
    }

    const token = localStorage.getItem("LOGINPET_TOKEN");

    try {
      await api.post(
        "api/selection",
        {
          title,
          phases,
          dateBegin,
          dateEnd,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      toast.success("Pocesso seletivo cadastrado com sucesso!");
      getSelections();
      toggle();
    } catch (err) {
      console.log(err.response.data);
      toast.error(err.response.data);
    }
  }

  return (
    <MDBModal isOpen={isOpen} toggle={toggle} size="lg">
      <MDBModalHeader toggle={toggle}>Cadastro de novo Petiano</MDBModalHeader>
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                    onChange={(e) => setDateBegin(e.target.value)}
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
                    onChange={(e) => setDateEnd(e.target.value)}
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
                {phases.map((phase, index) => (
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
        </MDBModalFooter>
      </form>
    </MDBModal>
  );
};

export default CreateSelection;
