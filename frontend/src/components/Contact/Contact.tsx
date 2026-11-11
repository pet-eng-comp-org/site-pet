"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import api from "../../services/api";

// As mesmas regras e mensagens do servidor (backend/utils/validation.js), para
// o erro aparecer ao lado do campo assim que ele é preenchido, sem esperar o envio.
type IdCampo = "name" | "email" | "subject" | "message";

const regras: Record<IdCampo, [number, number, string]> = {
  name: [2, 100, "Escreva o seu nome, com 2 a 100 caracteres."],
  email: [3, 254, "Escreva um e-mail válido, para podermos responder."],
  subject: [3, 120, "Escreva o assunto, com 3 a 120 caracteres."],
  message: [3, 5000, "Escreva a mensagem, com 3 a 5000 caracteres."],
};

const erroDe = (id: IdCampo, valor: string) => {
  const [min, max, mensagem] = regras[id];
  const v = valor.trim();
  const valido =
    v.length >= min &&
    v.length <= max &&
    (id !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
  return valido ? undefined : mensagem;
};

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviada, setEnviada] = useState(false);
  const aviso = useRef<HTMLParagraphElement>(null);
  // Erro de um campo aparece ao lado dele; o resto (rede, limite), acima do botão.
  const [erroCampo, setErroCampo] = useState<Partial<Record<IdCampo, string>>>({});
  const [erroGeral, setErroGeral] = useState("");
  // Com erro no envio, o foco vai ao aviso: o botão fica desligado enquanto
  // envia, e o foco caía no começo da página.
  const erroRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (erroGeral) erroRef.current?.focus();
  }, [erroGeral]);

  // Depois do envio, o foco vai para a confirmação, que o leitor de tela lê.
  useEffect(() => {
    if (enviada) aviso.current?.focus();
  }, [enviada]);

  const valores = { name, email, subject, message };

  const ids = Object.keys(regras) as IdCampo[];

  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviada(false);
    setErroGeral("");
    const erros: Partial<Record<IdCampo, string>> = {};
    for (const id of ids) {
      const erro = erroDe(id, valores[id]);
      if (erro) erros[id] = erro;
    }
    setErroCampo(erros);
    const primeiro = ids.find((id) => erros[id]);
    if (primeiro) {
      // Rótulo e campo no meio da tela: rolando só até o campo, o Safari o
      // deixava colado no topo fixo, com o rótulo escondido atrás dele.
      document.getElementById(`contato-${primeiro}`)?.focus({ preventScroll: true });
      document.querySelector(`label[for="contato-${primeiro}"]`)?.scrollIntoView({ block: "center" });
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
      const { campo, erro } =
        (err as { response?: { data?: { campo?: IdCampo; erro?: string } } }).response?.data || {};
      if (campo) setErroCampo({ [campo]: erro });
      else
        setErroGeral(
          typeof erro === "string"
            ? erro
            : "Não conseguimos enviar agora. Tente de novo em alguns minutos ou escreva para petengcomp@inf.ufes.br."
        );
    }
    setLoading(false);
  }

  // Confere o campo ao sair dele, se já foi preenchido; e, enquanto houver
  // erro, a cada tecla, para o aviso sumir assim que o texto ficar certo.
  const confere = (id: IdCampo, valor: string) =>
    setErroCampo((atual) => ({ ...atual, [id]: erroDe(id, valor) }));

  // Props comuns de cada campo: borda vermelha e texto do erro ligados a ele.
  const campo = (id: IdCampo, setValor: (v: string) => void) => ({
    id: `contato-${id}`,
    className: `form-control ${erroCampo[id] ? "is-invalid" : ""}`,
    // Espaço em branco: o rótulo fica dentro do campo enquanto ele está vazio
    // (:placeholder-shown, em app/globals.css).
    placeholder: " ",
    "aria-invalid": Boolean(erroCampo[id]),
    "aria-describedby": erroCampo[id] ? `contato-${id}-erro` : undefined,
    required: true,
    value: valores[id],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValor(e.target.value);
      if (erroCampo[id]) confere(id, e.target.value);
    },
    onBlur: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.target.value.trim()) confere(id, e.target.value);
    },
  });

  const erroDo = (id: IdCampo) =>
    erroCampo[id] && (
      <p className="mx-0 -mt-[0.85rem] mb-5 text-[0.95rem] text-erro" id={`contato-${id}-erro`}>
        {erroCampo[id]}
      </p>
    );

  return (
    <div className="pagina">
      <h1>Fale com a gente</h1>
      <p className="pagina-intro">
        Dúvidas, convites e parcerias: use o formulário ou escreva para{" "}
        <a className="link-texto" href="mailto:petengcomp@inf.ufes.br">
          petengcomp@inf.ufes.br
        </a>
        .
      </p>

      <div className="mt-10 grid grid-cols-2 items-start gap-8 max-menu:grid-cols-1">
        <form className="rounded-cartao bg-superficie p-8" onSubmit={sendMessage} noValidate>
          {enviada && (
            <p className="mb-6 rounded-[12px] border-l-[6px] border-acao bg-ok-fundo px-5 py-4" role="status" tabIndex={-1} ref={aviso}>
              Mensagem enviada. Respondemos pelo e-mail que você informou.
            </p>
          )}

          <div className="campo mb-[14px]">
            <input
              {...campo("name", setName)}
              type="text"
              autoComplete="name"
              maxLength={100}
            />
            <label htmlFor="contato-name">Nome</label>
          </div>
          {erroDo("name")}

          <div className="campo mb-[14px]">
            <input
              {...campo("email", setEmail)}
              type="email"
              autoComplete="email"
              maxLength={254}
            />
            <label htmlFor="contato-email">E-mail</label>
          </div>
          {erroDo("email")}

          <div className="campo mb-[14px]">
            <input
              {...campo("subject", setSubject)}
              type="text"
              maxLength={120}
            />
            <label htmlFor="contato-subject">Assunto</label>
          </div>
          {erroDo("subject")}

          <div className="campo mb-[14px]">
            <textarea
              {...campo("message", setMessage)}
              rows={5}
              maxLength={5000}
            />
            <label htmlFor="contato-message">Mensagem</label>
          </div>
          {erroDo("message")}
          {message.length > 4000 && (
            <p className="-mt-[0.85rem] mb-5 text-[0.9rem]">{message.length} de 5000 caracteres</p>
          )}

          {/* Sem JavaScript, o formulário não envia: diz como falar com a gente. */}
          <p className="alerta-erro hidden [.sem-js_&]:block">
            Para enviar pelo formulário, o navegador precisa de JavaScript. Escreva para
            petengcomp@inf.ufes.br.
          </p>

          {erroGeral && (
            <p className="alerta-erro" role="alert" tabIndex={-1} ref={erroRef}>
              {erroGeral}
            </p>
          )}

          {/* O botão fica no lugar durante o envio, só muda o texto. */}
          <button type="submit" className="botao-principal cursor-pointer border-0" disabled={loading}>
            {loading ? "Enviando…" : "Enviar mensagem"}
          </button>
        </form>

        <div>
          <h2 className="titulo-bloco">Onde estamos</h2>
          <p className="text-corpo leading-[1.47059]">
            Sala 18, 2º andar do CT XIII
            <br />
            Ufes, campus de Goiabeiras, Vitória (ES)
            <br />
            CEP 29075-073
          </p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14970.596826259594!2d-40.305981!3d-20.2733782!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x7c50a8cb2f88472c!2sPET%20Engenharia%20da%20Computa%C3%A7%C3%A3o%20UFES!5e0!3m2!1spt-BR!2sbr!4v1587417017850!5m2!1spt-BR!2sbr"
            title="Mapa com a sala do PET Engenharia de Computação na Ufes"
            className="h-[320px] w-full rounded-cartao border-0 bg-superficie-suave"
            loading="lazy"
            // Fora da ordem do Tab: eram 11 paradas dentro do mapa. O
            // endereço está no texto acima e no rodapé, com link para o Maps.
            tabIndex={-1}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
