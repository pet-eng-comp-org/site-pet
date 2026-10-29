import React, { useState, useEffect } from "react";
import { MDBAlert } from "mdbreact";
import "./Contact.css";
import api from "../../services/api";
import goUp from "../../utils/goUp";
import Loader from "../Loader/Loader";
import useTitulo from "../../utils/useTitulo";

const ContactPage = () => {
  useTitulo("Contato");
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
    <div className="pagina">
      <h1>Fale com a gente</h1>
      <p className="pagina-intro">
        Dúvidas, convites e parcerias: mande uma mensagem pelo formulário ou
        escreva para{" "}
        <a className="link-texto" href="mailto:petengcomp.ufes@gmail.com">
          petengcomp.ufes@gmail.com
        </a>
        .
      </p>

      <div className="contato-grade">
        <form className="contato-formulario" onSubmit={sendMessage}>
          {messageSend && (
            <MDBAlert color="success">
              Mensagem enviada. Obrigado pelo contato!
            </MDBAlert>
          )}
          {errorSendMessage && (
            <MDBAlert color="danger">{errorMessage}</MDBAlert>
          )}

          <label htmlFor="contato-nome">Nome</label>
          <input
            id="contato-nome"
            type="text"
            className={`form-control ${validLogin}`}
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="contato-email">E-mail</label>
          <input
            id="contato-email"
            type="email"
            className={`form-control ${validLogin}`}
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="contato-assunto">Assunto</label>
          <input
            id="contato-assunto"
            type="text"
            className={`form-control ${validLogin}`}
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <label htmlFor="contato-mensagem">Mensagem</label>
          <textarea
            id="contato-mensagem"
            className={`form-control ${validLogin}`}
            rows="5"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {loading ? (
            <Loader />
          ) : (
            <button type="submit" className="botao-principal">
              Enviar mensagem
            </button>
          )}
        </form>

        <div className="contato-local">
          <h2>Onde estamos</h2>
          <p>
            Sala 18, 2º andar do CT XIII
            <br />
            Ufes, campus de Goiabeiras, Vitória (ES)
            <br />
            CEP 29075-073
          </p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14970.596826259594!2d-40.305981!3d-20.2733782!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x7c50a8cb2f88472c!2sPET%20Engenharia%20da%20Computa%C3%A7%C3%A3o%20UFES!5e0!3m2!1spt-BR!2sbr!4v1587417017850!5m2!1spt-BR!2sbr"
            title="Mapa com a sala do PET Engenharia de Computação na Ufes"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
