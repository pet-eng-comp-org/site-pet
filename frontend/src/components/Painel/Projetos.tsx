"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import slug from "../../utils/slug";
import { painel, erroDe } from "./painelApi";
import {
  API,
  Acoes,
  Campo,
  Carregando,
  Confirmar,
  ErroDaJanela,
  Janela,
  useAvisar,
  useEnvio,
  useLista,
  type Erros,
} from "./ui";
import type { Comissao } from "../../tipos";

type Aberto = { tipo: "novo" } | { tipo: "editar" | "fotos" | "excluir"; projeto: Comissao } | null;

const foto = (id: string, largura = 400) => `${API}api/file/getComissionPhoto/${id}?largura=${largura}`;

function Projetos() {
  const projetos = useLista("api/comissions", (d: { comissions: Comissao[] }) => d.comissions);
  const [aberto, setAberto] = useState<Aberto>(null);
  const fechar = () => setAberto(null);
  const avisar = useAvisar();
  // A janela de fotos mostra o projeto atualizado depois de cada mudança.
  const atual = aberto && "projeto" in aberto ? projetos.dados?.find((p) => p._id === aberto.projeto._id) : undefined;

  return (
    <section aria-labelledby="titulo-secao">
      <div className="painel-cabecalho">
        <h2 id="titulo-secao" tabIndex={-1}>Projetos</h2>
        <button type="button" className="botao-principal" onClick={() => setAberto({ tipo: "novo" })}>
          Cadastrar projeto
        </button>
      </div>
      <Carregando estado={projetos}>
        {(lista) => (
          <ul className="painel-lista">
            {lista.map((p) => (
              <li key={p._id} className="painel-item">
                {p.photos[0] ? (
                  <img className="painel-foto bg-acao-fundo object-contain p-[10px]" src={foto(p.photos[0])} alt="" width="56" height="56" loading="lazy" />
                ) : (
                  <span className="painel-foto painel-foto-vazia" aria-hidden="true" />
                )}
                <div className="painel-item-texto">
                  <strong>{p.title}</strong>
                  <span>
                    {(() => {
                      const n = Math.max(p.photos.length - 1, 0);
                      return n === 1 ? "1 foto" : `${n} fotos`;
                    })()}{" "}
                    na galeria ·{" "}
                    <Link className="link-texto" href={`/projetos/${slug(p.title)}`}>
                      ver no site
                    </Link>
                  </span>
                </div>
                <div className="painel-item-acoes">
                  <button type="button" className="botao-secundario" onClick={() => setAberto({ tipo: "editar", projeto: p })}>
                    Editar textos<span className="sr-only"> de {p.title}</span>
                  </button>
                  <button type="button" className="botao-secundario" onClick={() => setAberto({ tipo: "fotos", projeto: p })}>
                    Fotos<span className="sr-only"> de {p.title}</span>
                  </button>
                  <button type="button" className="botao-texto-perigo" onClick={() => setAberto({ tipo: "excluir", projeto: p })}>
                    Excluir<span className="sr-only"> {p.title}</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Carregando>

      {(aberto?.tipo === "novo" || aberto?.tipo === "editar") && (
        <FormProjeto
          projeto={aberto.tipo === "editar" ? aberto.projeto : undefined}
          aoFechar={fechar}
          aoSalvar={(criado?: Comissao) => {
            projetos.recarregar();
            // Projeto novo segue direto para as fotos: sem ícone, o cartão fica vazio.
            if (criado) setAberto({ tipo: "fotos", projeto: criado });
            else fechar();
          }}
        />
      )}
      {aberto?.tipo === "fotos" && atual && (
        <Fotos projeto={atual} aoFechar={fechar} aoMudar={projetos.recarregar} />
      )}
      {aberto?.tipo === "excluir" && (
        <Confirmar
          titulo={`Excluir o projeto ${aberto.projeto.title}?`}
          texto="O projeto sai do site, com as fotos. Não dá para desfazer."
          acao="Excluir projeto"
          aoFechar={fechar}
          aoConfirmar={async () => {
            await painel.delete(`api/comissions/${aberto.projeto._id}`);
            avisar(`O projeto ${aberto.projeto.title} foi excluído.`);
            projetos.recarregar();
          }}
        />
      )}
    </section>
  );
}

interface PropsForm {
  projeto?: Comissao;
  aoFechar: () => void;
  aoSalvar: (criado?: Comissao) => void;
}

function FormProjeto({ projeto, aoFechar, aoSalvar }: PropsForm) {
  const novo = !projeto;
  const [f, setF] = useState({
    title: projeto?.title || "",
    description: projeto?.description || "",
    etiquetas: (projeto?.tags || []).map(({ title, link }) => ({ title: title.trim(), link: link || "" })),
  });
  const muda = (campo: "title" | "description") => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF({ ...f, [campo]: e.target.value });
  const mudaEtiqueta = (i: number, campo: "title" | "link") => (e: ChangeEvent<HTMLInputElement>) =>
    setF({ ...f, etiquetas: f.etiquetas.map((x, j) => (j === i ? { ...x, [campo]: e.target.value } : x)) });
  let criado: Comissao | undefined;

  const { erros, enviando, aoEnviar, erroGeral } = useEnvio({
    prefixo: "projeto",
    validar: () => {
      const e: Erros = {};
      const t = f.title.trim().length;
      if (t < 2 || t > 30) e.title = "Escreva o nome, com 2 a 30 caracteres.";
      if (f.description.trim().length < 6) e.description = "Escreva a descrição, com pelo menos 6 caracteres.";
      if (f.etiquetas.some((x) => x.title.trim().length < 2)) e.etiquetas = "Cada link ou ferramenta precisa de um nome.";
      else if (f.etiquetas.some((x) => x.link.trim() && !/^https?:\/\/\S+$/.test(x.link.trim())))
        e.etiquetas = "Os links precisam começar com https://.";
      return e;
    },
    sucesso: novo ? "Projeto cadastrado. Agora envie o ícone e as fotos." : "Alterações salvas.",
    aoTerminar: () => aoSalvar(criado),
    enviar: async () => {
      const corpo = {
        title: f.title.trim(),
        description: f.description.trim(),
        tags: f.etiquetas.map((x) => ({ title: x.title.trim(), link: x.link.trim() })),
      };
      if (projeto) await painel.put(`api/comissions/${projeto._id}`, corpo);
      else criado = (await painel.post<Comissao>("api/comissions", corpo)).data;
    },
  });
  const id = (c: string) => `projeto-${c}`;

  return (
    <Janela titulo={projeto ? `Editar ${projeto.title}` : "Cadastrar projeto"} aberta aoFechar={aoFechar} larga>
      <form onSubmit={aoEnviar} noValidate className="painel-form">
        <Campo id={id("title")} rotulo="Nome" erro={erros.title}>
          <input value={f.title} maxLength={30} onChange={muda("title")} />
        </Campo>
        <Campo
          id={id("description")}
          rotulo="Descrição"
          dica="A primeira frase aparece no cartão da página Projetos e na prévia do link; o texto inteiro, na página do projeto."
          erro={erros.description}
        >
          <textarea rows={6} value={f.description} onChange={muda("description")} />
        </Campo>
        <fieldset className="painel-grupo">
          <legend>Links e ferramentas</legend>
          <p className="campo-dica">
            Com link e o nome do projeto no nome (“Site do Topcom”, “Instagram do Mobiliza PET”), vira botão na página do
            projeto; os outros aparecem como ferramentas.
          </p>
          {f.etiquetas.map((x, i) => (
            <div key={i} className="painel-linha-rede">
              <label className="sr-only" htmlFor={id(i === 0 ? "etiquetas" : `nome-${i}`)}>Nome {i + 1}</label>
              <input id={id(i === 0 ? "etiquetas" : `nome-${i}`)} className="form-control" placeholder="Nome" value={x.title} onChange={mudaEtiqueta(i, "title")} />
              <label className="sr-only" htmlFor={id(`link-${i}`)}>Link {i + 1} (opcional)</label>
              <input id={id(`link-${i}`)} className="form-control" type="url" placeholder="https:// (opcional)" value={x.link} onChange={mudaEtiqueta(i, "link")} />
              <button type="button" className="botao-texto-perigo" onClick={() => setF({ ...f, etiquetas: f.etiquetas.filter((_, j) => j !== i) })}>
                Tirar<span className="sr-only"> {x.title || `item ${i + 1}`}</span>
              </button>
            </div>
          ))}
          {erros.etiquetas && <p className="campo-erro">{erros.etiquetas}</p>}
          <button type="button" className="botao-secundario" onClick={() => setF({ ...f, etiquetas: [...f.etiquetas, { title: "", link: "" }] })}>
            Adicionar link ou ferramenta
          </button>
        </fieldset>
        <Acoes erro={erroGeral} enviando={enviando} rotulo={novo ? "Cadastrar e enviar fotos" : "Salvar alterações"} />
      </form>
    </Janela>
  );
}

// O que a foto mostra, para quem usa leitor de tela. O ícone não precisa:
// ele é decorativo no cartão. Salva ao sair do campo, se mudou.
interface PropsDescricao {
  id: string;
  rotulo: string;
  atual: string;
  aoSalvar: (alt: string) => Promise<void>;
}

function Descricao({ id, rotulo, atual, aoSalvar }: PropsDescricao) {
  const [texto, setTexto] = useState(atual);
  const [erro, setErro] = useState("");
  const avisar = useAvisar();
  // Fechar a janela salva o campo (ui.tsx, pedirFechar); se a gravação falha
  // com a janela já fechada, o erro vai para o aviso do painel.
  const montado = useRef(true);
  useEffect(() => {
    montado.current = true;
    return () => {
      montado.current = false;
    };
  }, []);
  useEffect(() => setTexto(atual), [atual]);
  const salvar = async () => {
    if (texto.trim() === atual) return;
    setErro("");
    try {
      await aoSalvar(texto.trim());
    } catch (err) {
      if (montado.current) setErro(erroDe(err));
      else avisar(`A descrição da ${rotulo} não foi salva: ${erroDe(err)}`, "erro");
    }
  };
  return (
    <div className="mb-2">
      <label className="mb-1 block text-14 font-semibold" htmlFor={`alt-${id}`}>O que a {rotulo} mostra</label>
      <textarea
        id={`alt-${id}`}
        className="form-control text-14"
        rows={2}
        maxLength={300}
        value={texto}
        placeholder="Por exemplo: equipes de três pessoas programando no laboratório"
        onChange={(e) => setTexto(e.target.value)}
        onBlur={salvar}
        aria-describedby={erro ? `alt-${id}-erro` : undefined}
      />
      {erro && <p className="campo-erro" id={`alt-${id}-erro`}>{erro}</p>}
    </div>
  );
}

// As fotos são salvas na hora: enviar, tirar e mudar de lugar.
interface PropsFotos {
  projeto: Comissao;
  aoFechar: () => void;
  aoMudar: () => Promise<void>;
}

function Fotos({ projeto, aoFechar, aoMudar }: PropsFotos) {
  const [ocupado, setOcupado] = useState(false);
  const [tirar, setTirar] = useState<{ id: string; i: number } | null>(null);
  // Depois de mover ou tirar, o foco fica no mesmo botão (ou no vizinho), e
  // o leitor de tela ouve o que mudou: o botão não some nem é desligado.
  const [foco, setFoco] = useState<{ id: string; acao: string } | null>(null);
  const [anuncio, setAnuncio] = useState("");
  const lista = useRef<HTMLOListElement>(null);
  useEffect(() => {
    if (!foco) return;
    const alvo =
      lista.current?.querySelector<HTMLElement>(`[data-foto="${foco.id}"] [data-acao="${foco.acao}"]`) ||
      lista.current?.querySelector<HTMLElement>(`[data-foto="${foco.id}"] [data-acao]`) ||
      document.getElementById("fotos-novas");
    alvo?.focus();
    setFoco(null);
  }, [foco, projeto.photos]);
  // Erro e confirmação ficam dentro da janela (o aviso flutuante cobria
  // parte dela no celular); a confirmação é anunciada pelo role=status.
  const [erro, setErro] = useState("");
  const fazer = async (acao: () => Promise<unknown>, sucesso?: string) => {
    if (ocupado) return false;
    setOcupado(true);
    setErro("");
    try {
      await acao();
      await aoMudar();
      if (sucesso) setAnuncio(sucesso);
      return true;
    } catch (err) {
      setErro(erroDe(err));
      return false;
    } finally {
      setOcupado(false);
    }
  };
  const papel = (i: number) => (i === 0 ? "ícone" : `foto ${i}`);
  const enviar = (arquivos: File[]) =>
    fazer(async () => {
      for (const arq of arquivos) {
        const dados = new FormData();
        dados.append("photo", arq);
        await painel.patch(`api/comissions/addPhoto/${projeto._id}`, dados);
      }
    }, arquivos.length > 1 ? `${arquivos.length} fotos enviadas.` : "Foto enviada.");
  const mover = async (de: number, para: number, acao: string) => {
    const id = projeto.photos[de];
    const ordem = [...projeto.photos];
    ordem.splice(para, 0, ordem.splice(de, 1)[0]);
    if (await fazer(() => painel.patch(`api/comissions/ordenarFotos/${projeto._id}`, { photos: ordem }))) {
      setAnuncio(`Agora é ${papel(para)}.`);
      setFoco({ id, acao });
    }
  };

  return (
    <Janela titulo={`Fotos de ${projeto.title}`} aberta aoFechar={aoFechar} larga focoNoTitulo>
      <p>
        A primeira é o <strong>ícone</strong> do cartão em Projetos (quadrada, de preferência). As outras formam a galeria,
        nessa ordem; a primeira que não está em pé também aparece quando alguém compartilha o link do projeto. Escreva em cada uma o
        que ela mostra, para quem usa leitor de tela. As mudanças valem na hora.
      </p>
      <ol className="mx-0 mt-0 mb-6 grid list-none grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-4 p-0" aria-busy={ocupado} ref={lista}>
        {projeto.photos.map((id, i) => (
          <li key={id} data-foto={id}>
            <img className="block aspect-[4/3] w-full rounded-[12px] bg-superficie-suave object-cover" src={foto(id)} alt="" loading="lazy" />
            <span className="my-[0.35rem] block font-semibold">{i === 0 ? "Ícone" : `Foto ${i}`}</span>
            {i > 0 && (
              <Descricao
                id={id}
                rotulo={papel(i)}
                atual={(projeto.medidas || []).find((m) => m._id === id)?.alt || ""}
                aoSalvar={async (alt: string) => {
                  await painel.patch(`api/comissions/descreverFoto/${projeto._id}`, { photoId: id, alt });
                  await aoMudar();
                  setAnuncio(`Descrição da ${papel(i)} salva.`);
                }}
              />
            )}
            <div className="flex flex-wrap gap-1">
              {i > 0 && (
                <button type="button" className="botao-secundario px-3" data-acao="antes" onClick={() => mover(i, i - 1, "antes")}>
                  Antes<span className="sr-only"> ({papel(i)})</span>
                </button>
              )}
              {i < projeto.photos.length - 1 && (
                <button type="button" className="botao-secundario px-3" data-acao="depois" onClick={() => mover(i, i + 1, "depois")}>
                  Depois<span className="sr-only"> ({papel(i)})</span>
                </button>
              )}
              <button type="button" className="botao-texto-perigo" data-acao="tirar" onClick={() => setTirar({ id, i })}>
                Tirar<span className="sr-only"> ({papel(i)})</span>
              </button>
            </div>
          </li>
        ))}
      </ol>
      <p className="mx-0 mt-4 mb-0 font-semibold empty:m-0" role="status">{anuncio}</p>
      <div className="campo">
        <label htmlFor="fotos-novas">{projeto.photos.length ? "Enviar mais fotos" : "Enviar o ícone e as fotos"}</label>
        <p className="campo-dica" id="fotos-dica">Pode escolher várias de uma vez; elas entram no fim, na ordem escolhida.</p>
        <input
          id="fotos-novas"
          className="form-control"
          type="file"
          accept="image/*"
          multiple
          disabled={ocupado}
          aria-describedby="fotos-dica"
          onChange={(e) => {
            const arquivos = [...(e.target.files || [])];
            e.target.value = "";
            if (arquivos.length) enviar(arquivos);
          }}
        />
      </div>
      {ocupado && <p>Salvando…</p>}
      <ErroDaJanela erro={erro} />
      <div className="janela-acoes">
        <button type="button" className="botao-principal" onClick={aoFechar}>
          Pronto
        </button>
      </div>
      {tirar && (
        <Confirmar
          titulo="Tirar esta foto?"
          texto="Ela sai do site e é apagada. Não dá para desfazer."
          acao="Tirar foto"
          aoFechar={() => setTirar(null)}
          aoConfirmar={async () => {
            // O foco vai para a foto que ocupa o lugar (ou para o envio).
            const vizinha = projeto.photos[tirar.i + 1] || projeto.photos[tirar.i - 1];
            if (await fazer(() => painel.patch(`api/comissions/removePhoto/${projeto._id}`, { photoId: tirar.id }), "Foto tirada."))
              setFoco({ id: vizinha, acao: "tirar" });
          }}
        />
      )}
    </Janela>
  );
}

export default Projetos;
