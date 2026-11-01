import React, { useState } from "react";
import useTitulo from "../../utils/useTitulo";
import { painel } from "./painelApi";
import { API, Acoes, Campo, Carregando, Confirmar, Janela, useAvisar, useEnvio, useLista } from "./ui";

const arquivoUrl = (id) => `${API}api/file/downloadDocument/${id}`;

function Documentos() {
  useTitulo("Documentos · Painel");
  const grupos = useLista("api/documents/", (d) => d.documents);
  const [aberto, setAberto] = useState(null);
  const fechar = () => setAberto(null);
  const avisar = useAvisar();
  const depois = () => grupos.recarregar();

  return (
    <section aria-labelledby="titulo-secao">
      <div className="painel-cabecalho">
        <h2 id="titulo-secao">Documentos</h2>
        <button type="button" className="botao-principal" onClick={() => setAberto({ tipo: "grupo" })}>
          Criar grupo
        </button>
      </div>
      <p className="painel-intro">
        Os grupos aparecem como cartões na página Documentos, nesta ordem. O edital mais novo do grupo “Editais de
        seleção” é o que o Faça parte indica.
      </p>
      <Carregando estado={grupos}>
        {(lista) => (
          <div className="painel-grupos">
            {lista.map((g) => (
              <section key={g._id} className="painel-cartao" aria-labelledby={`grupo-${g._id}`}>
                <div className="painel-cartao-topo">
                  <h3 id={`grupo-${g._id}`}>{g.title}</h3>
                  <div className="painel-item-acoes">
                    <button type="button" className="botao-secundario" onClick={() => setAberto({ tipo: "grupo", grupo: g })}>
                      Renomear<span className="sr-only"> {g.title}</span>
                    </button>
                    <button type="button" className="botao-texto-perigo" onClick={() => setAberto({ tipo: "excluirGrupo", grupo: g })}>
                      Excluir grupo<span className="sr-only"> {g.title}</span>
                    </button>
                  </div>
                </div>
                {g.files.length ? (
                  <ul className="painel-arquivos">
                    {g.files.map((a) => (
                      <li key={a._id}>
                        <a className="link-texto" href={arquivoUrl(a._id)} target="_blank" rel="noopener noreferrer">
                          {a.name}
                        </a>
                        <button type="button" className="botao-texto-perigo" onClick={() => setAberto({ tipo: "tirar", grupo: g, arquivo: a })}>
                          Tirar<span className="sr-only"> {a.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="painel-vazio">Nenhum arquivo ainda. O grupo não aparece no site enquanto estiver vazio.</p>
                )}
                <button type="button" className="botao-secundario" onClick={() => setAberto({ tipo: "arquivo", grupo: g })}>
                  Adicionar arquivo<span className="sr-only"> em {g.title}</span>
                </button>
              </section>
            ))}
          </div>
        )}
      </Carregando>

      {aberto?.tipo === "grupo" && <FormGrupo grupo={aberto.grupo} aoFechar={fechar} aoSalvar={depois} />}
      {aberto?.tipo === "arquivo" && <FormArquivo grupo={aberto.grupo} aoFechar={fechar} aoSalvar={depois} />}
      {aberto?.tipo === "excluirGrupo" && (
        <Confirmar
          titulo={`Excluir o grupo ${aberto.grupo.title}?`}
          texto={`O grupo sai do site${aberto.grupo.files.length ? ` e os ${aberto.grupo.files.length} arquivos dele são apagados` : ""}. Não dá para desfazer.`}
          acao="Excluir grupo"
          aoFechar={fechar}
          aoConfirmar={async () => {
            await painel.delete(`api/documents/${aberto.grupo._id}`);
            avisar(`O grupo ${aberto.grupo.title} foi excluído.`);
            depois();
          }}
        />
      )}
      {aberto?.tipo === "tirar" && (
        <Confirmar
          titulo={`Tirar ${aberto.arquivo.name}?`}
          texto="O arquivo sai do site e é apagado. Não dá para desfazer."
          acao="Tirar arquivo"
          aoFechar={fechar}
          aoConfirmar={async () => {
            await painel.patch(`api/documents/removeFile/${aberto.grupo._id}`, { idFile: aberto.arquivo._id });
            avisar(`${aberto.arquivo.name} foi tirado.`);
            depois();
          }}
        />
      )}
    </section>
  );
}

function FormGrupo({ grupo, aoFechar, aoSalvar }) {
  const [titulo, setTitulo] = useState(grupo?.title || "");
  const { erros, enviando, aoEnviar } = useEnvio({
    prefixo: "grupo",
    validar: () => {
      const n = titulo.trim().length;
      return n < 5 || n > 30 ? { titulo: "Escreva o nome, com 5 a 30 caracteres." } : {};
    },
    sucesso: grupo ? "Grupo renomeado." : "Grupo criado. Agora adicione os arquivos.",
    aoTerminar: () => {
      aoSalvar();
      aoFechar();
    },
    enviar: () =>
      grupo
        ? painel.put(`api/documents/${grupo._id}`, { title: titulo.trim() })
        : painel.post("api/documents", { title: titulo.trim() }),
  });
  return (
    <Janela titulo={grupo ? `Renomear ${grupo.title}` : "Criar grupo de documentos"} aberta aoFechar={aoFechar}>
      <form onSubmit={aoEnviar} noValidate className="painel-form">
        <Campo id="grupo-titulo" rotulo="Nome do grupo" dica="Por exemplo, “Editais de seleção”." erro={erros.titulo}>
          <input value={titulo} maxLength="30" onChange={(e) => setTitulo(e.target.value)} />
        </Campo>
        <Acoes enviando={enviando} rotulo={grupo ? "Renomear" : "Criar grupo"} aoCancelar={aoFechar} />
      </form>
    </Janela>
  );
}

// O nome sugerido sai do arquivo ("edital-018-2026.pdf" -> "edital 018 2026"),
// para a pessoa só ajustar.
const nomeDoArquivo = (arq) => arq.name.replace(/\.pdf$/i, "").replace(/[-_]+/g, " ").trim();

function FormArquivo({ grupo, aoFechar, aoSalvar }) {
  const [arquivo, setArquivo] = useState(null);
  const [nome, setNome] = useState("");
  const { erros, enviando, aoEnviar } = useEnvio({
    prefixo: "arquivo",
    validar: () => {
      const e = {};
      if (!arquivo) e.pdf = "Escolha o PDF.";
      else if (arquivo.type !== "application/pdf") e.pdf = "O arquivo precisa ser PDF.";
      if (!nome.trim()) e.nome = "Escreva o nome como ele deve aparecer no site.";
      return e;
    },
    sucesso: "Arquivo adicionado.",
    aoTerminar: () => {
      aoSalvar();
      aoFechar();
    },
    enviar: () => {
      const dados = new FormData();
      dados.append("name", nome.trim());
      dados.append("file", arquivo);
      return painel.patch(`api/documents/addFile/${grupo._id}`, dados);
    },
  });
  return (
    <Janela titulo={`Adicionar arquivo em ${grupo.title}`} aberta aoFechar={aoFechar}>
      <form onSubmit={aoEnviar} noValidate className="painel-form">
        <Campo id="arquivo-pdf" rotulo="Arquivo (PDF)" erro={erros.pdf}>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              const arq = e.target.files[0] || null;
              setArquivo(arq);
              if (arq && !nome) setNome(nomeDoArquivo(arq));
            }}
          />
        </Campo>
        <Campo id="arquivo-nome" rotulo="Nome no site" dica="Por exemplo, “Edital nº 018/2026”. O novo entra no topo do grupo." erro={erros.nome}>
          <input value={nome} maxLength="120" onChange={(e) => setNome(e.target.value)} />
        </Campo>
        <Acoes enviando={enviando} rotulo="Adicionar arquivo" aoCancelar={aoFechar} />
      </form>
    </Janela>
  );
}

export default Documentos;
