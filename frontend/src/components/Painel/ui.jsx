import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import Icone from "../Icone/Icone";
import { painel, erroDe } from "./painelApi";

// ---- Avisos ------------------------------------------------------------------

// Confirmação some sozinha em 5 s; erro fica até a pessoa fechar. O leitor de
// tela anuncia os dois (status e alert).
const Avisos = createContext(() => {});
export const useAvisar = () => useContext(Avisos);

export const ComAvisos = ({ children }) => {
  const [avisos, setAvisos] = useState([]);
  const tirar = (id) => setAvisos((a) => a.filter((x) => x.id !== id));
  const avisar = useCallback((texto, tipo = "ok") => {
    const id = Math.random();
    setAvisos((a) => [...a, { id, texto, tipo }]);
    if (tipo === "ok") setTimeout(() => tirar(id), 5000);
  }, []);

  // Popover: fica na camada de cima, acima de uma janela aberta (que deixa o
  // resto da página inerte). Fica sempre aberto, para o leitor de tela já
  // conhecer as regiões antes do primeiro aviso, e é reaberto a cada aviso,
  // para ficar acima de uma janela aberta depois.
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    if (!el?.showPopover) return;
    if (el.matches(":popover-open")) el.hidePopover();
    el.showPopover();
  }, [avisos]);

  return (
    <Avisos.Provider value={avisar}>
      {children}
      <div className="painel-avisos" popover="manual" ref={ref}>
        <div role="status">
          {avisos.filter((a) => a.tipo === "ok").map((a) => (
            <p key={a.id} className="painel-aviso">{a.texto}</p>
          ))}
        </div>
        <div role="alert">
          {avisos.filter((a) => a.tipo === "erro").map((a) => (
            <p key={a.id} className="painel-aviso painel-aviso-erro">
              {a.texto}
              <button type="button" onClick={() => tirar(a.id)} aria-label="Fechar aviso">
                <Icone nome="fechar" />
              </button>
            </p>
          ))}
        </div>
      </div>
    </Avisos.Provider>
  );
};

// ---- Janela ------------------------------------------------------------------

// O <dialog> do navegador: prende o foco dentro dele, fecha com Esc e devolve
// o foco ao botão que o abriu.
// O foco ao abrir vai ao elemento marcado com data-foco-inicial; sem ele, ao
// primeiro campo ou, numa pergunta, ao "Cancelar"; com focoNoTitulo, ao título
// (janela que não começa por um campo, como a de fotos).
export const Janela = ({ titulo, aberta, aoFechar, children, larga, focoNoTitulo }) => {
  const ref = useRef();
  const idTitulo = useId();
  useEffect(() => {
    const d = ref.current;
    if (aberta && !d.open) {
      // Ao abrir: o foco vai ao primeiro campo (ou, numa pergunta, ao
      // "Cancelar"), e não ao X. Ao fechar, volta ao botão que abriu.
      const quemAbriu = document.activeElement;
      d.showModal();
      const primeiro = focoNoTitulo
        ? d.querySelector("h2")
        : d.querySelector("[data-foco-inicial]") ||
          d.querySelector("input, select, textarea") ||
          d.querySelector(".janela-acoes button");
      primeiro?.focus();
      return () => {
        if (d.open) d.close();
        if (quemAbriu?.isConnected) quemAbriu.focus();
      };
    }
    return undefined;
  }, [aberta]);

  return (
    <dialog
      ref={ref}
      className={`janela ${larga ? "janela-larga" : ""}`}
      aria-labelledby={idTitulo}
      onClose={aoFechar}
      // O Esc fecha só esta janela: sem isto, com uma pergunta aberta dentro
      // de outra janela, o navegador fechava as duas.
      onCancel={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key !== "Escape") return;
        e.preventDefault();
        e.stopPropagation();
        aoFechar();
      }}
    >
      {aberta && (
        <>
          <div className="janela-topo">
            <h2 id={idTitulo} tabIndex={-1}>
              {titulo}
            </h2>
            <button type="button" className="janela-fechar" onClick={aoFechar} aria-label="Fechar">
              <Icone nome="fechar" />
            </button>
          </div>
          {children}
        </>
      )}
    </dialog>
  );
};

// Pergunta antes de algo que não volta atrás. O botão diz o que acontece
// ("Excluir notícia"), nunca só "Sim".
export const Confirmar = ({ titulo, texto, acao, perigo = true, aoConfirmar, aoFechar }) => {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const confirmar = async () => {
    setEnviando(true);
    setErro("");
    try {
      await aoConfirmar();
      aoFechar();
    } catch (err) {
      setErro(erroDe(err));
    } finally {
      setEnviando(false);
    }
  };
  return (
    <Janela titulo={titulo} aberta aoFechar={aoFechar}>
      <p>{texto}</p>
      <ErroDaJanela erro={erro} />
      <div className="janela-acoes">
        <button type="button" className="botao-link" onClick={aoFechar}>
          Cancelar
        </button>
        <button
          type="button"
          className={perigo ? "botao-perigo" : "botao-principal"}
          onClick={confirmar}
          disabled={enviando}
        >
          {enviando ? "Um momento…" : acao}
        </button>
      </div>
    </Janela>
  );
};

// ---- Formulário --------------------------------------------------------------

// Campo com rótulo, dica e erro ligados por id, como no formulário de contato.
export const Campo = ({ id, rotulo, dica, erro, children }) => (
  <div className="campo">
    <label htmlFor={id}>{rotulo}</label>
    {dica && (
      <p className="campo-dica" id={`${id}-dica`}>
        {dica}
      </p>
    )}
    {React.cloneElement(children, {
      id,
      "aria-invalid": erro ? "true" : undefined,
      "aria-describedby":
        [dica && `${id}-dica`, erro && `${id}-erro`].filter(Boolean).join(" ") || undefined,
      className: `form-control ${children.props.className || ""}`,
    })}
    {erro && (
      <p className="campo-erro" id={`${id}-erro`}>
        {erro}
      </p>
    )}
  </div>
);

// Envio de formulário: confere as regras (validar devolve { campo: mensagem }),
// leva o foco ao primeiro campo com erro, envia e avisa. prefixo é o começo
// dos ids dos campos.
export const useEnvio = ({ validar, enviar, prefixo, aoTerminar, sucesso }) => {
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [erroGeral, setErroGeral] = useState("");
  const avisar = useAvisar();

  const aoEnviar = async (e) => {
    e.preventDefault();
    setErroGeral("");
    const achados = validar();
    setErros(achados);
    const primeiro = Object.keys(achados)[0];
    if (primeiro) {
      document.getElementById(`${prefixo}-${primeiro}`)?.focus();
      return;
    }
    setEnviando(true);
    try {
      await enviar();
      avisar(sucesso);
      aoTerminar();
    } catch (err) {
      setErroGeral(erroDe(err));
    } finally {
      setEnviando(false);
    }
  };
  return { erros, enviando, aoEnviar, erroGeral };
};

// Erro de quem está numa janela aparece dentro dela, junto dos botões: um
// aviso flutuante cobria parte da janela no celular.
// Com erro, o foco vai à mensagem: o botão que enviou fica desligado enquanto
// salva e o foco caía fora da janela.
export const ErroDaJanela = ({ erro }) => {
  const ref = useRef();
  useEffect(() => {
    if (!erro) return;
    ref.current.focus({ preventScroll: true });
    // A mensagem e os botões logo abaixo dela à vista, para tentar de novo.
    (ref.current.nextElementSibling || ref.current).scrollIntoView({ block: "end" });
  }, [erro]);
  return (
    <p className="janela-erro" role="alert" tabIndex={-1} ref={ref}>
      {erro}
    </p>
  );
};

export const Acoes = ({ enviando, rotulo, aoCancelar, erro }) => (
  <>
    <ErroDaJanela erro={erro} />
    <div className="janela-acoes">
      <button type="button" className="botao-link" onClick={aoCancelar}>
        Cancelar
      </button>
      <button type="submit" className="botao-principal" disabled={enviando}>
        {enviando ? "Salvando…" : rotulo}
      </button>
    </div>
  </>
);

// ---- Dados -------------------------------------------------------------------

// Uma lista da API, com recarregar depois de cada mudança.
export const useLista = (caminho, extrair) => {
  const [estado, setEstado] = useState({ carregando: true });
  const recarregar = useCallback(
    () =>
      painel
        .get(caminho)
        .then(({ data }) => setEstado({ dados: extrair(data) }))
        .catch((err) => setEstado({ erro: erroDe(err) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [caminho]
  );
  useEffect(() => {
    recarregar();
  }, [recarregar]);
  // Depois de uma falha, "Tentar de novo" mostra o carregando: sem isso, a
  // mesma mensagem voltava e o botão parecia não fazer nada.
  const tentarDeNovo = () => {
    // O botão some: o foco vai ao título da seção, e não ao começo da página.
    document.getElementById("titulo-secao")?.focus();
    setEstado({ carregando: true });
    recarregar();
  };
  return { ...estado, recarregar, tentarDeNovo };
};

export const Carregando = ({ estado, children }) => {
  if (estado.carregando) return <p className="painel-vazio">Carregando…</p>;
  if (estado.erro)
    return (
      <p className="alerta-erro" role="alert">
        {estado.erro}{" "}
        <button type="button" className="botao-link" onClick={estado.tentarDeNovo}>
          Tentar de novo
        </button>
      </p>
    );
  return children(estado.dados);
};

// ---- Datas -------------------------------------------------------------------

export const API = import.meta.env.VITE_API_URL;

// "2026-03-01T00:00:00.000Z" -> "2026-03-01", para <input type="date">.
export const paraCampoData = (iso) => (iso ? iso.slice(0, 10) : "");

// Data e hora de Brasília para <input type="datetime-local"> e de volta.
const FUSO = "America/Sao_Paulo";
export const paraCampoHora = (iso) => {
  if (!iso) return "";
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: FUSO,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date(iso))
      .map((x) => [x.type, x.value])
  );
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
};
// Brasília não tem horário de verão desde 2019: sempre -03:00.
export const deCampoHora = (valor) => (valor ? new Date(`${valor}:00-03:00`).toISOString() : "");

export const dataPorExtenso = (iso, comHora) =>
  new Date(iso).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(comHora && { hour: "2-digit", minute: "2-digit" }),
    timeZone: comHora ? FUSO : "UTC",
  });
