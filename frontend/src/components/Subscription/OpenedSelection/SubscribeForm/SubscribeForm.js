import React, { useState } from "react";
import { MDBAnimation, MDBBtn, MDBCol, MDBContainer, MDBRow } from "mdbreact";
import Upload from "./Upload/Upload";
import Loader from "../../../Loader/Loader";
import api from "../../../../services/api";
import styled from "styled-components";
import "./SubscribeForm.css";
import { maskCellphone } from "../../../../utils/masks";

const InvalidFeedback = styled.div.attrs({
  className: "invalid-feedback",
})`
  color: white;
`;

function SubscribeForm(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState();
  const [sendingInscription, setSendingInscription] = useState(false);
  const [feedback, setFeedback] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    e.target.class += " was-validated";
    if (file && phone.length >= 14) {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);

      try {
        setSendingInscription(true);
        await api.post("api/inscriptions/", formData);
        setSendingInscription(false);
        setName("");
        setEmail("");
        setPhone("");
        setFile();
        setFeedback(
          <div className="alert alert-success" role="alert">
            <h4 className="alert-heading">Inscrição enviada!</h4>
            <h6>
              Entraremos em contato em breve informando se sua inscrição foi
              aceita
            </h6>
          </div>
        );
      } catch (err) {
        setFeedback(
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Erro ao enviar inscrição!</h4>
            <h6>
              Observe atentamente os campos e tente novamente, o campo de
              telefone deve ser do tipo (99) 99999-9999 e o arquivo no formato
              ZIP.
            </h6>
          </div>
        );
        setSendingInscription(false);
        console.log(err);
      }
    }
  }

  return (
    <MDBAnimation type="fadeIn">
      <div className="green-bg inscription">
        <div className="about-us">
          <MDBContainer>
            <MDBRow center>
              <MDBCol xs="11" lg="10">
                <h1 className="mt-2" style={{ padding: 0 }}>
                  Inscrição
                </h1>
              </MDBCol>
            </MDBRow>
            <MDBRow center>
              <MDBCol xs="11" lg="10">
                <h6 className="form-instructions">
                  Preencha com seus dados pessoais TODOS os campos abaixo. Na
                  área de arquivos, o candidato deve enviar um único arquivo no
                  formato ZIP contendo todos os documentos explicitados no item
                  4 do edital acima.
                </h6>
                <br />
              </MDBCol>
            </MDBRow>

            {feedback ? (
              feedback
            ) : (
              <form
                onSubmit={handleSubmit}
                className="selection-form needs-validation"
                noValidate
              >
                <MDBRow center>
                  <MDBCol xs="11" lg="10">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nome *"
                      id="iname"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <InvalidFeedback> Digite seu nome.</InvalidFeedback>
                    <br />
                  </MDBCol>
                </MDBRow>
                <MDBRow center>
                  <MDBCol xs="11" lg="10">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email *"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <InvalidFeedback> Digite um email válido</InvalidFeedback>
                    <br />
                  </MDBCol>
                </MDBRow>
                <MDBRow center>
                  <MDBCol xs="11" lg="10">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Telefone * (99) 99999-9999"
                      minLength="14"
                      maxLength="15"
                      required
                      value={phone}
                      onChange={(e) => setPhone(maskCellphone(e.target.value))}
                    />
                    <InvalidFeedback>
                      {" "}
                      Digite um telefone válido
                    </InvalidFeedback>
                    <br />
                  </MDBCol>
                </MDBRow>
                <br />
                <MDBRow center>
                  <MDBCol xs="11" sm="7" md="5">
                    <Upload file={file} setFile={setFile} />
                  </MDBCol>
                </MDBRow>
                <MDBRow center>
                  <MDBCol xs="11" lg="10">
                    <div className="text-center mt-4">
                      {sendingInscription ? (
                        <Loader color="#03989f" />
                      ) : (
                        <MDBBtn color="secondary" type="submit">
                          <strong>Inscrever</strong>
                        </MDBBtn>
                      )}
                    </div>
                  </MDBCol>
                </MDBRow>
              </form>
            )}
          </MDBContainer>
        </div>
      </div>
    </MDBAnimation>
  );
}

export default SubscribeForm;
