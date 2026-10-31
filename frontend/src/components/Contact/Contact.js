import React, { useState, useEffect, useRef } from "react";
import "./Contact.css";
import api from "../../services/api";
import goUp from "../../utils/goUp";
import useTitulo from "../../utils/useTitulo";

// As mesmas regras e mensagens do servidor (backend/utils/validation.js), para
// o erro aparecer ao lado do campo assim que ele é preenchido, sem esperar o envio.
const regras = {
  name: [2, 100, "Escreva o seu nome, com 2 a 100 caracteres."],
  email: [3, 254, "Escreva um e-mail válido, para podermos responder."],
  subject: [3, 120, "Escreva o assunto, com 3 a 120 caracteres."],
  message: [3, 5000, "Escreva a mensagem, com 3 a 5000 caracteres."],
};

const erroDe = (id, valor) => {
  const [min, max, mensagem] = regras[id];
  const v = valor.trim();
  const valido =
    v.length >= min &&
    v.length <= max &&
    (id !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
  return valido ? undefined : mensagem;
};

const ContactPage = () => {
  useTitulo("Contato");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviada, setEnviada] = useState(false);
  const aviso = useRef();
  // Erro de um campo aparece ao lado dele; o resto (rede, limite), acima do botão.
  const [erroCampo, setErroCampo] = useState({});
  const [erroGeral, setErroGeral] = useState("");

  useEffect(() => {
    goUp();
  }, []);

  // Depois do envio, o foco vai para a confirmação, que o leitor de tela lê.
  useEffect(() => {
    if (enviada) aviso.current.focus();
  }, [enviada]);

  const valores = { name, email, subject, message };

  async function sendMessage(e) {
    e.preventDefault();
    setEnviada(false);
    setErroGeral("");
    const erros = {};
    for (const id of Object.keys(regras)) {
      const erro = erroDe(id, valores[id]);
      if (erro) erros[id] = erro;
    }
    setErroCampo(erros);
    const primeiro = Object.keys(erros)[0];
    if (primeiro) {
      // Rótulo e campo no meio da tela: rolando só até o campo, o Safari o
      // deixava colado no topo fixo, com o rótulo escondido atrás dele.
      document.getElementById(`contato-${primeiro}`).focus({ preventScroll: true });
      document.querySelector(`label[for="contato-${primeiro}"]`).scrollIntoView({ block: "center" });
      return;
    }
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
            : "Não conseguimos enviar agora. Tente de novo em alguns minutos."
        );
    }
    setLoading(false);
  }

  // Confere o campo ao sair dele, se já foi preenchido; e, enquanto houver
  // erro, a cada tecla, para o aviso sumir assim que o texto ficar certo.
  const confere = (id, valor) =>
    setErroCampo((atual) => ({ ...atual, [id]: erroDe(id, valor) }));

  // Props comuns de cada campo: borda vermelha e texto do erro ligados a ele.
  const campo = (id, setValor) => ({
    id: `contato-${id}`,
    className: `form-control ${erroCampo[id] ? "is-invalid" : ""}`,
    "aria-invalid": Boolean(erroCampo[id]),
    "aria-describedby": erroCampo[id] ? `contato-${id}-erro` : undefined,
    required: true,
    value: valores[id],
    onChange: (e) => {
      setValor(e.target.value);
      if (erroCampo[id]) confere(id, e.target.value);
    },
    onBlur: (e) => {
      if (e.target.value.trim()) confere(id, e.target.value);
    },
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
        <form className="contato-formulario" onSubmit={sendMessage} noValidate>
          {enviada && (
            <p className="contato-enviada" role="status" tabIndex={-1} ref={aviso}>
              Mensagem enviada. Respondemos pelo e-mail que você informou.
            </p>
          )}

          <label htmlFor="contato-name">Nome</label>
          <input
            {...campo("name", setName)}
            type="text"
            autoComplete="name"
            maxLength={100}
          />
          {erroDo("name")}

          <label htmlFor="contato-email">E-mail</label>
          <input
            {...campo("email", setEmail)}
            type="email"
            autoComplete="email"
            maxLength={254}
          />
          {erroDo("email")}

          <label htmlFor="contato-subject">Assunto</label>
          <input
            {...campo("subject", setSubject)}
            type="text"
            maxLength={120}
          />
          {erroDo("subject")}

          <label htmlFor="contato-message">Mensagem</label>
          <textarea
            {...campo("message", setMessage)}
            rows="5"
            maxLength={5000}
          />
          {erroDo("message")}
          {message.length > 4000 && (
            <p className="contato-contador">{message.length} de 5000 caracteres</p>
          )}

          {erroGeral && (
            <p className="alerta-erro" role="alert">
              {erroGeral}
            </p>
          )}

          {/* O botão fica no lugar durante o envio, só muda o texto. */}
          <button type="submit" className="botao-principal" disabled={loading}>
            {loading ? "Enviando…" : "Enviar mensagem"}
          </button>
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
