import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useTitulo from "../../utils/useTitulo";
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
} from "./ui";

const foto = (id, largura = 400) => `${API}api/file/getComissionPhoto/${id}?largura=${largura}`;

function Projetos() {
  useTitulo("Projetos · Painel");
  const projetos = useLista("api/comissions", (d) => d.comissions);
  const [aberto, setAberto] = useState(null);
  const fechar = () => setAberto(null);
  const avisar = useAvisar();
  // A janela de fotos mostra o projeto atualizado depois de cada mudança.
  const atual = aberto?.projeto && projetos.dados?.find((p) => p._id === aberto.projeto._id);

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
                  <img className="painel-foto painel-foto-icone" src={foto(p.photos[0])} alt="" width="56" height="56" loading="lazy" />
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
                    <Link className="link-texto" to={`/projetos/${slug(p.title)}`}>
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
          projeto={aberto.projeto}
          aoFechar={fechar}
          aoSalvar={(criado) => {
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

function FormProjeto({ projeto, aoFechar, aoSalvar }) {
  const novo = !projeto;
  const [f, setF] = useState({
    title: projeto?.title || "",
    description: projeto?.description || "",
    etiquetas: (projeto?.tags || []).map(({ title, link }) => ({ title: title.trim(), link: link || "" })),
  });
  const muda = (campo) => (e) => setF({ ...f, [campo]: e.target.value });
  const mudaEtiqueta = (i, campo) => (e) =>
    setF({ ...f, etiquetas: f.etiquetas.map((x, j) => (j === i ? { ...x, [campo]: e.target.value } : x)) });
  let criado;

  const { erros, enviando, aoEnviar, erroGeral } = useEnvio({
    prefixo: "projeto",
    validar: () => {
      const e = {};
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
      if (novo) criado = (await painel.post("api/comissions", corpo)).data;
      else await painel.put(`api/comissions/${projeto._id}`, corpo);
    },
  });
  const id = (c) => `projeto-${c}`;

  return (
    <Janela titulo={novo ? "Cadastrar projeto" : `Editar ${projeto.title}`} aberta aoFechar={aoFechar} larga>
      <form onSubmit={aoEnviar} noValidate className="painel-form">
        <Campo id={id("title")} rotulo="Nome" erro={erros.title}>
          <input value={f.title} maxLength="30" onChange={muda("title")} />
        </Campo>
        <Campo
          id={id("description")}
          rotulo="Descrição"
          dica="A primeira frase aparece no cartão da página Projetos e na prévia do link; o texto inteiro, na página do projeto."
          erro={erros.description}
        >
          <textarea rows="6" value={f.description} onChange={muda("description")} />
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
function Descricao({ id, rotulo, atual, aoSalvar }) {
  const [texto, setTexto] = useState(atual);
  const [erro, setErro] = useState("");
  useEffect(() => setTexto(atual), [atual]);
  const salvar = async () => {
    if (texto.trim() === atual) return;
    setErro("");
    try {
      await aoSalvar(texto.trim());
    } catch (err) {
      setErro(erroDe(err));
    }
  };
  return (
    <div className="painel-fotos-descricao">
      <label htmlFor={`alt-${id}`}>O que a {rotulo} mostra</label>
      <textarea
        id={`alt-${id}`}
        className="form-control"
        rows="2"
        maxLength="300"
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
function Fotos({ projeto, aoFechar, aoMudar }) {
  const [ocupado, setOcupado] = useState(false);
  const [tirar, setTirar] = useState(null);
  // Depois de mover ou tirar, o foco fica no mesmo botão (ou no vizinho), e
  // o leitor de tela ouve o que mudou: o botão não some nem é desligado.
  const [foco, setFoco] = useState(null);
  const [anuncio, setAnuncio] = useState("");
  const lista = useRef();
  useEffect(() => {
    if (!foco) return;
    const alvo =
      lista.current?.querySelector(`[data-foto="${foco.id}"] [data-acao="${foco.acao}"]`) ||
      lista.current?.querySelector(`[data-foto="${foco.id}"] [data-acao]`) ||
      document.getElementById("fotos-novas");
    alvo?.focus();
    setFoco(null);
  }, [foco, projeto.photos]);
  // Erro e confirmação ficam dentro da janela (o aviso flutuante cobria
  // parte dela no celular); a confirmação é anunciada pelo role=status.
  const [erro, setErro] = useState("");
  const fazer = async (acao, sucesso) => {
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
  const papel = (i) => (i === 0 ? "ícone" : `foto ${i}`);
  const enviar = (arquivos) =>
    fazer(async () => {
      for (const arq of arquivos) {
        const dados = new FormData();
        dados.append("photo", arq);
        await painel.patch(`api/comissions/addPhoto/${projeto._id}`, dados);
      }
    }, arquivos.length > 1 ? `${arquivos.length} fotos enviadas.` : "Foto enviada.");
  const mover = async (de, para, acao) => {
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
      <ol className="painel-fotos" aria-busy={ocupado} ref={lista}>
        {projeto.photos.map((id, i) => (
          <li key={id} data-foto={id}>
            <img src={foto(id)} alt="" loading="lazy" />
            <span className="painel-fotos-papel">{i === 0 ? "Ícone" : `Foto ${i}`}</span>
            {i > 0 && (
              <Descricao
                projeto={projeto}
                id={id}
                rotulo={papel(i)}
                atual={(projeto.medidas || []).find((m) => m._id === id)?.alt || ""}
                aoSalvar={async (alt) => {
                  await painel.patch(`api/comissions/descreverFoto/${projeto._id}`, { photoId: id, alt });
                  await aoMudar();
                  setAnuncio(`Descrição da ${papel(i)} salva.`);
                }}
              />
            )}
            <div className="painel-fotos-acoes">
              {i > 0 && (
                <button type="button" className="botao-secundario" data-acao="antes" onClick={() => mover(i, i - 1, "antes")}>
                  Antes<span className="sr-only"> ({papel(i)})</span>
                </button>
              )}
              {i < projeto.photos.length - 1 && (
                <button type="button" className="botao-secundario" data-acao="depois" onClick={() => mover(i, i + 1, "depois")}>
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
      <p className="janela-status" role="status">{anuncio}</p>
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
            const arquivos = [...e.target.files];
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
