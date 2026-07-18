import React, { useState, useEffect } from "react";
import {
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBAlert,
  MDBIcon,
  MDBBtn,
  MDBContainer,
  MDBAnimation,
} from "mdbreact";
import "./Contact.css";
import api from "../../services/api";
import goUp from "../../utils/goUp";
import Loader from "../Loader/Loader";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageSend, setMessageSend] = useState(false);
  const [errorSendMessage, setErrorSendMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validLogin, setValidLogin] = useState("");

  useEffect(() => {
    goUp();
  }, []);

  async function sendMessage(e) {
    e.preventDefault();

    try {
      setErrorSendMessage(false);
      setMessageSend(false);
      setLoading(true);
      await api.post("api/contact/", { name, email, subject, message });
      setLoading(false);
      setValidLogin("");
      setMessageSend(true);
      setName("");
      setEmail("");
      setMessage("");
      setSubject("");
    } catch (err) {
      console.log(err);
      setLoading(false);
      setErrorSendMessage(true);
      setErrorMessage(err?.response?.data);
      setValidLogin("is-invalid");
    }
  }

  return (
    <>
      <MDBAnimation type="fadeIn">
        <div className="text-content ft-normal">
          <MDBContainer>
            <MDBRow center>
              <MDBCol xs="11" lg="10">
                <h1 className="text-align-left">Entre com Contato!</h1>
              </MDBCol>
            </MDBRow>
            <MDBRow center>
              <MDBCol xs="11" lg="10">
                <section>
                  <MDBRow className="marginTitle">
                    <MDBCol lg="5" className="lg-0 mb-4">
                      <MDBCard>
                        <MDBCardBody>
                          <div className="form-header title accent-1">
                            <h3 className="text-center">
                              <MDBIcon icon="envelope" />{" "}
                              <div>Mande uma Mensagem:</div>
                            </h3>
                          </div>
                          {messageSend && (
                            <MDBAlert color="success">
                              Email enviado com sucesso!
                            </MDBAlert>
                          )}
                          {errorSendMessage && (
                            <MDBAlert color="danger">{errorMessage}</MDBAlert>
                          )}
                          <form
                            className="contactForm needs-validation"
                            noValidate
                            onSubmit={sendMessage}
                          >
                            <input
                              type="text"
                              className={`form-control ${validLogin}`}
                              placeholder="Nome "
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                            <br />

                            <input
                              type="email"
                              className={`form-control ${validLogin}`}
                              placeholder="Seu email "
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                            <br />

                            <input
                              type="text"
                              className={`form-control ${validLogin}`}
                              placeholder="Assunto "
                              required
                              value={subject}
                              onChange={(e) => setSubject(e.target.value)}
                            />
                            <br />

                            <textarea
                              type="text"
                              className={`form-control ${validLogin}`}
                              rows="3"
                              placeholder="Mensagem "
                              required
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                            />
                            <div className="text-center mt-4">
                              {loading ? (
                                <Loader />
                              ) : (
                                <MDBBtn outline type="submit">
                                  Enviar
                                </MDBBtn>
                              )}
                            </div>
                          </form>
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                    <MDBCol lg="7">
                      <div
                        id="map-container"
                        className="rounded z-depth-1-half map-container"
                        style={{ height: "505px" }}
                      >
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14970.596826259594!2d-40.305981!3d-20.2733782!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x7c50a8cb2f88472c!2sPET%20Engenharia%20da%20Computa%C3%A7%C3%A3o%20UFES!5e0!3m2!1spt-BR!2sbr!4v1587417017850!5m2!1spt-BR!2sbr"
                          title="This is a unique title"
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          style={{ border: 0 }}
                        />
                      </div>
                      <br />
                      <MDBRow className="text-center">
                        <MDBCol md="6">
                          <MDBBtn
                            tag="a"
                            style={{ cursor: "auto" }}
                            floating="true"
                            className="accent-1"
                          >
                            <MDBIcon icon="map-marker-alt" />
                          </MDBBtn>
                          <p>PET Engenharia de Computação</p>
                          <p className="mb-md-0">
                            CT XIII – UFES – Goiabeiras, Vitória – ES,
                            29075-073. Sala 18, 2º andar
                          </p>
                        </MDBCol>
                        <MDBCol md="6">
                          <MDBBtn
                            tag="a"
                            floating="true"
                            style={{ cursor: "auto" }}
                            className="accent-1"
                          >
                            <MDBIcon icon="envelope" />
                          </MDBBtn>
                          <p className="mb-md-0">petengcomp.ufes@gmail.com</p>
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                  </MDBRow>
                </section>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </div>
      </MDBAnimation>
    </>
  );
};

export default ContactPage;
