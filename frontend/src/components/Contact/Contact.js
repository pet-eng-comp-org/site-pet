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
  const [enviada, setEnviada] = useState(false);
  // Erro de um campo aparece ao lado dele; o resto (rede, limite), acima do botão.
  const [erroCampo, setErroCampo] = useState({});
  const [erroGeral, setErroGeral] = useState("");

  useEffect(() => {
    goUp();
  }, []);

  async function sendMessage(e) {
    e.preventDefault();
    setEnviada(false);
    setErroCampo({});
    setErroGeral("");
    setLoading(true);
    try {
      await api.post("api/contact/", { name, email, subject, message });
      setEnviada(true);
      setName("");
      setEmail("");
      setMessage("");
      setSubject("");
    } catch (err) {
      const { campo, erro } = err?.response?.data || {};
      if (campo) setErroCampo({ [campo]: erro });
      else
        setErroGeral(
          typeof erro === "string"
            ? erro
            : "Não conseguimos enviar agora. Confira a sua conexão e tente de novo."
        );
    }
    setLoading(false);
  }

  // Props comuns de cada campo: borda vermelha e texto do erro ligados a ele.
  const campo = (id) => ({
    id: `contato-${id}`,
    className: `form-control ${erroCampo[id] ? "is-invalid" : ""}`,
    "aria-invalid": Boolean(erroCampo[id]),
    "aria-describedby": erroCampo[id] ? `contato-${id}-erro` : undefined,
    required: true,
  });

  const erroDo = (id) =>
    erroCampo[id] && (
      <p className="contato-erro" id={`contato-${id}-erro`}>
        {erroCampo[id]}
      </p>
    );

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
          {enviada && (
            <MDBAlert color="success" role="status">
              Mensagem enviada. Respondemos pelo e-mail que você informou.
            </MDBAlert>
          )}

          <label htmlFor="contato-name">Nome</label>
          <input
            {...campo("name")}
            type="text"
            autoComplete="name"
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {erroDo("name")}

          <label htmlFor="contato-email">E-mail</label>
          <input
            {...campo("email")}
            type="email"
            autoComplete="email"
            maxLength={254}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {erroDo("email")}

          <label htmlFor="contato-subject">Assunto</label>
          <input
            {...campo("subject")}
            type="text"
            maxLength={120}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          {erroDo("subject")}

          <label htmlFor="contato-message">Mensagem</label>
          <textarea
            {...campo("message")}
            rows="5"
            maxLength={5000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {erroDo("message")}
          {message.length > 4000 && (
            <p className="contato-contador">{message.length} de 5000 caracteres</p>
          )}

          {erroGeral && (
            <MDBAlert color="danger" role="alert">
              {erroGeral}
            </MDBAlert>
          )}

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
