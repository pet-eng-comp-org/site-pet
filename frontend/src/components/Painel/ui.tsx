"use client";

import {
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import Icone from "../Icone/Icone";
import { painel, erroDe } from "./painelApi";
import { API as ENDERECO_DA_API } from "../../services/apiUrl";

// Erros de um formulário, por campo.
export type Erros = Record<string, string>;

// ---- Avisos ------------------------------------------------------------------

// Confirmação some sozinha em 5 s; erro fica até a pessoa fechar. O leitor de
// tela anuncia os dois (status e alert).
type Avisar = (texto: string, tipo?: "ok" | "erro") => void;
const Avisos = createContext<Avisar>(() => {});
export const useAvisar = () => useContext(Avisos);

interface Aviso {
  id: number;
  texto: string;
  tipo: "ok" | "erro";
}

// Cada aviso: fundo escuro (vermelho no erro), cantos de 12 px e a sombra das folhas.
const AVISO = "pointer-events-auto m-0 mb-2 flex items-center justify-between gap-2 rounded-[12px] px-4 py-3 shadow-[0_15px_37.5px_rgba(0,0,0,0.18)]";

export const ComAvisos = ({ children }: { children: ReactNode }) => {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const tirar = (id: number) => setAvisos((a) => a.filter((x) => x.id !== id));
  const avisar = useCallback<Avisar>((texto, tipo = "ok") => {
    const id = Math.random();
    setAvisos((a) => [...a, { id, texto, tipo }]);
    if (tipo === "ok") setTimeout(() => tirar(id), 5000);
  }, []);

  // Popover: fica na camada de cima, acima de uma janela aberta (que deixa o
  // resto da página inerte). Fica sempre aberto, para o leitor de tela já
  // conhecer as regiões antes do primeiro aviso, e é reaberto a cada aviso,
  // para ficar acima de uma janela aberta depois.
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el?.showPopover) return;
    if (el.matches(":popover-open")) el.hidePopover();
    el.showPopover();
  }, [avisos]);

  return (
    <Avisos.Provider value={avisar}>
      {children}
      {/* No canto de baixo, em cima de tudo. Vazio, não pega clique: só os avisos. */}
      <div
        className="pointer-events-none fixed inset-auto right-[max(1rem,calc((100%-1140px)/2))] bottom-4 z-[2000] m-0 flex w-[min(100%-2rem,26rem)] flex-col gap-2 overflow-visible border-0 bg-transparent p-0"
        popover="manual"
        ref={ref}
      >
        <div role="status">
          {avisos.filter((a) => a.tipo === "ok").map((a) => (
            <p key={a.id} className={`${AVISO} bg-rodape text-white`}>
              {a.texto}
            </p>
          ))}
        </div>
        <div role="alert">
          {avisos.filter((a) => a.tipo === "erro").map((a) => (
            <p key={a.id} className={`${AVISO} bg-erro text-texto-sobre-erro`}>
              {a.texto}
              <button
                type="button"
                className="-my-2 -mr-2 inline-flex size-11 flex-none cursor-pointer items-center justify-center border-0 bg-transparent text-inherit"
                onClick={() => tirar(a.id)}
                aria-label="Fechar aviso"
              >
                <Icone nome="fechar" className="h-4" />
              </button>
            </p>
          ))}
        </div>
      </div>
    </Avisos.Provider>
  );
};

// ---- Janela ------------------------------------------------------------------

// Fechar pela pessoa (Esc, X, Cancelar) passa por aqui: com algo mudado no
// formulário, pergunta antes de descartar. Fechar depois de salvar não passa.
const FecharJanela = createContext<() => void>(() => {});

// O estado dos campos de um formulário, para saber se algo mudou desde que a
// pessoa começou a mexer nele (voltar ao texto original conta como sem mudança).
const estadoDosCampos = (form: HTMLFormElement) =>
  JSON.stringify(
    [...(form.elements as unknown as HTMLInputElement[])].map((el) =>
      el.type === "file" ? el.files?.length : el.type === "checkbox" || el.type === "radio" ? el.checked : el.value
    )
  );

// O <dialog> do navegador: prende o foco dentro dele, fecha com Esc e devolve
// o foco ao botão que o abriu.
// O foco ao abrir vai ao elemento marcado com data-foco-inicial; sem ele, ao
// primeiro campo ou, numa pergunta, ao "Cancelar"; com focoNoTitulo, ao título
// (janela que não começa por um campo, como a de fotos).
interface PropsJanela {
  titulo: string;
  aberta: boolean;
  aoFechar: () => void;
  children: ReactNode;
  larga?: boolean;
  focoNoTitulo?: boolean;
}

export const Janela = ({ titulo, aberta, aoFechar, children, larga, focoNoTitulo }: PropsJanela) => {
  const ref = useRef<HTMLDialogElement>(null);
  const idTitulo = useId();
  // Retrato de cada formulário antes do primeiro toque nele; ao fechar, se
  // algum mudou, a pergunta "Descartar as alterações?".
  const retratos = useRef(new Map<HTMLFormElement, string>());
  const [perguntando, setPerguntando] = useState(false);
  const retratar = (e: { target: EventTarget }) => {
    const form = (e.target as Element).closest?.("form");
    if (form && ref.current?.contains(form) && !retratos.current.has(form))
      retratos.current.set(form, estadoDosCampos(form));
  };
  const mudou = () =>
    [...retratos.current].some(([form, antes]) => form.isConnected && estadoDosCampos(form) !== antes);
  const pedirFechar = () => {
    // Campo fora de formulário se salva ao perder o foco (a descrição de cada
    // foto): tira o foco antes de fechar, senão o Esc fechava sem salvar.
    const ativo = document.activeElement as HTMLElement | null;
    if (ativo && ref.current?.contains(ativo) && !ativo.closest("form")) ativo.blur();
    if (mudou()) setPerguntando(true);
    else aoFechar();
  };

  useEffect(() => {
    const d = ref.current;
    if (d && aberta && !d.open) {
      // Ao abrir: o foco vai ao primeiro campo (ou, numa pergunta, ao
      // "Cancelar"), e não ao X. Ao fechar, volta ao botão que abriu.
      const quemAbriu = document.activeElement as HTMLElement | null;
      d.showModal();
      const primeiro = focoNoTitulo
        ? d.querySelector<HTMLElement>("h2")
        : d.querySelector<HTMLElement>("[data-foco-inicial]") ||
          d.querySelector<HTMLElement>("input, select, textarea") ||
          d.querySelector<HTMLElement>(".janela-acoes button");
      primeiro?.focus();
      return () => {
        retratos.current.clear();
        if (d.open) d.close();
        if (quemAbriu?.isConnected) quemAbriu.focus();
      };
    }
    return undefined;
  }, [aberta]);

  return (
    <dialog
      ref={ref}
      // A folha: raio de 32 px e sombra, sobre o fundo escurecido. Rolar até
      // o fim dela não passa a rolar a página atrás.
      className={`max-h-[calc(100%-2rem)] overscroll-contain rounded-folha border-0 bg-folha p-6 text-texto shadow-[0_15px_37.5px_rgba(0,0,0,0.18)] backdrop:bg-sobreposicao ${larga ? "w-[min(100%-2rem,46rem)]" : "w-[min(100%-2rem,34rem)]"}`}
      aria-labelledby={idTitulo}
      onClose={aoFechar}
      // O Esc fecha só esta janela: sem isto, com uma pergunta aberta dentro
      // de outra janela, o navegador fechava as duas.
      onCancel={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key !== "Escape") return;
        e.preventDefault();
        e.stopPropagation();
        pedirFechar();
      }}
      onFocusCapture={retratar}
      onPointerDownCapture={retratar}
    >
      {aberta && (
        <FecharJanela.Provider value={pedirFechar}>
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 id={idTitulo} className="mt-2 mb-0 text-21 font-semibold focus:outline-none" tabIndex={-1}>
              {titulo}
            </h2>
            {/* Botão redondo, como o X das folhas. */}
            <button
              type="button"
              className="-mt-1 -mr-2 inline-flex size-11 flex-none cursor-pointer items-center justify-center rounded-full border-0 bg-preenchimento text-texto"
              onClick={pedirFechar}
              aria-label="Fechar"
            >
              <Icone nome="fechar" className="h-[1.1rem]" />
            </button>
          </div>
          {children}
          {perguntando && (
            <Confirmar
              titulo="Descartar as alterações?"
              texto="O que você mudou nesta janela ainda não foi salvo."
              acao="Descartar"
              cancelar="Continuar editando"
              aoConfirmar={aoFechar}
              aoFechar={() => setPerguntando(false)}
            />
          )}
        </FecharJanela.Provider>
      )}
    </dialog>
  );
};

// Pergunta antes de algo que não volta atrás. O botão diz o que acontece
// ("Excluir notícia"), nunca só "Sim".
interface PropsConfirmar {
  titulo: string;
  texto: ReactNode;
  acao: string;
  cancelar?: string;
  perigo?: boolean;
  aoConfirmar: () => unknown;
  aoFechar: () => void;
}

export const Confirmar = ({
  titulo,
  texto,
  acao,
  cancelar = "Cancelar",
  perigo = true,
  aoConfirmar,
  aoFechar,
}: PropsConfirmar) => {
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
          {cancelar}
        </button>
        <button
          type="button"
          // Destrutivo cheio: 6,9:1 com o branco.
          className={
            perigo
              ? "inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-capsula border-0 bg-erro px-5 py-0 font-normal text-texto-sobre-erro hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-55"
              : "botao-principal"
          }
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

// Campo com o nome dentro, como no formulário de contato; a dica e o erro vêm
// embaixo da caixa, ligados por id. Em cima, a dica empurrava a caixa e o
// nome, preso ao topo do bloco, caía em cima dela.
interface PropsCampo {
  id: string;
  rotulo: ReactNode;
  dica?: ReactNode;
  erro?: string;
  children: ReactElement<{ className?: string; placeholder?: string }>;
}

export const Campo = ({ id, rotulo, dica, erro, children }: PropsCampo) => (
  <div className="painel-campo">
    <div className="campo">
      <label htmlFor={id}>{rotulo}</label>
      {cloneElement(children as ReactElement<Record<string, unknown>>, {
        id,
        "aria-invalid": erro ? "true" : undefined,
        "aria-describedby":
          erro ? `${id}-erro` : dica ? `${id}-dica` : undefined,
        className: `form-control ${children.props.className || ""}`,
        // Sem exemplo, um espaço: com o campo vazio, o nome fica no meio da
        // caixa. Lista não tem placeholder.
        ...(children.type !== "select" && { placeholder: children.props.placeholder ?? " " }),
      })}
    </div>
    {/* O erro toma o lugar da dica. */}
    {dica && !erro && (
      <p className="campo-dica" id={`${id}-dica`}>
        {dica}
      </p>
    )}
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
interface Envio {
  validar: () => Erros;
  enviar: () => Promise<unknown>;
  prefixo: string;
  aoTerminar: () => void;
  sucesso: string;
}

export const useEnvio = ({ validar, enviar, prefixo, aoTerminar, sucesso }: Envio) => {
  const [erros, setErros] = useState<Erros>({});
  const [enviando, setEnviando] = useState(false);
  const [erroGeral, setErroGeral] = useState("");
  const avisar = useAvisar();

  const aoEnviar = async (e: FormEvent) => {
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
export const ErroDaJanela = ({ erro }: { erro?: string }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (!erro || !ref.current) return;
    ref.current.focus({ preventScroll: true });
    // A mensagem e os botões logo abaixo dela à vista, para tentar de novo.
    (ref.current.nextElementSibling || ref.current).scrollIntoView({ block: "end" });
  }, [erro]);
  return (
    <p className="mx-0 mt-4 mb-0 scroll-m-4 font-semibold text-erro empty:m-0 focus:outline-none" role="alert" tabIndex={-1} ref={ref}>
      {erro}
    </p>
  );
};

// O Cancelar fecha a janela como o Esc e o X: perguntando antes, se algo mudou.
export const Acoes = ({ enviando, rotulo, erro }: { enviando: boolean; rotulo: string; erro?: string }) => {
  const fechar = useContext(FecharJanela);
  return (
    <>
      <ErroDaJanela erro={erro} />
      <div className="janela-acoes">
        <button type="button" className="botao-link" onClick={fechar}>
          Cancelar
        </button>
        <button type="submit" className="botao-principal" disabled={enviando}>
          {enviando ? "Salvando…" : rotulo}
        </button>
      </div>
    </>
  );
};

// ---- Dados -------------------------------------------------------------------

// Uma lista da API, com recarregar depois de cada mudança.
export interface Lista<T> {
  carregando?: boolean;
  dados?: T;
  erro?: string;
  recarregar: () => Promise<void>;
  tentarDeNovo: () => void;
}

// extrair tira da resposta da API a lista que a seção mostra.
export const useLista = <T, D>(caminho: string, extrair: (data: D) => T): Lista<T> => {
  const [estado, setEstado] = useState<{ carregando?: boolean; dados?: T; erro?: string }>({ carregando: true });
  const recarregar = useCallback(
    () =>
      painel
        .get<D>(caminho)
        .then(({ data }) => setEstado({ dados: extrair(data) }))
        .catch((err: unknown) => setEstado({ erro: erroDe(err) })),
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

export const Carregando = <T,>({ estado, children }: { estado: Lista<T>; children: (dados: T) => ReactNode }) => {
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
  return children(estado.dados as T);
};

// ---- Datas -------------------------------------------------------------------

export const API = ENDERECO_DA_API;

// "2026-03-01T00:00:00.000Z" -> "2026-03-01", para <input type="date">.
export const paraCampoData = (iso?: string) => (iso ? iso.slice(0, 10) : "");

// Data e hora de Brasília para <input type="datetime-local"> e de volta.
const FUSO = "America/Sao_Paulo";
export const paraCampoHora = (iso?: string) => {
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
export const deCampoHora = (valor: string) => (valor ? new Date(`${valor}:00-03:00`).toISOString() : "");

export const dataPorExtenso = (iso: string, comHora?: boolean) =>
  new Date(iso).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(comHora && { hour: "2-digit", minute: "2-digit" }),
    timeZone: comHora ? FUSO : "UTC",
  });
