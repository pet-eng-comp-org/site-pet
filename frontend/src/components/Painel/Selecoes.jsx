import React, { useState } from "react";
import useTitulo from "../../utils/useTitulo";
import { painel } from "./painelApi";
import {
  Acoes,
  Campo,
  Carregando,
  Confirmar,
  Janela,
  dataPorExtenso,
  deCampoHora,
  paraCampoHora,
  useAvisar,
  useEnvio,
  useLista,
} from "./ui";

// Uma seleção por vez: enquanto uma não for encerrada, é ela que o site mostra
// (aberta entre as duas datas, fechada fora delas).
const situacao = (s) => {
  const agora = Date.now();
  if (!s.open) return "Encerrada";
  if (agora < Date.parse(s.dateBegin)) return `Agendada: abre em ${dataPorExtenso(s.dateBegin, true)}`;
  if (agora < Date.parse(s.dateEnd)) return `Aberta até ${dataPorExtenso(s.dateEnd, true)}`;
  return "Prazo terminado. Encerre para poder criar a próxima.";
};

function Selecoes() {
  useTitulo("Seleções · Painel");
  const selecoes = useLista("api/selection", (d) =>
    [...(d.selections || d)].sort((a, b) => Date.parse(b.dateBegin) - Date.parse(a.dateBegin))
  );
  const [aberto, setAberto] = useState(null);
  const fechar = () => setAberto(null);
  const avisar = useAvisar();
  const ativa = selecoes.dados?.find((s) => s.open);

  return (
    <section aria-labelledby="titulo-secao">
      <div className="painel-cabecalho">
        <h2 id="titulo-secao">Seleções</h2>
        <button
          type="button"
          className="botao-principal"
          disabled={Boolean(ativa)}
          aria-describedby={ativa ? "selecao-uma-por-vez" : undefined}
          onClick={() => setAberto({ tipo: "nova" })}
        >
          Criar seleção
        </button>
      </div>
      <p className="painel-intro" id="selecao-uma-por-vez">
        {ativa
          ? `Só cabe uma seleção por vez: encerre “${ativa.title}” para criar a próxima.`
          : "Durante o período de inscrição, o site mostra o aviso e o botão para o formulário."}
      </p>
      <Carregando estado={selecoes}>
        {(lista) =>
          lista.length ? (
            <ul className="painel-lista">
              {lista.map((s) => (
                <li key={s._id} className="painel-item painel-item-sem-foto">
                  <div className="painel-item-texto">
                    <strong>{s.title}</strong>
                    <span>{situacao(s)}</span>
                  </div>
                  <div className="painel-item-acoes">
                    {s.open && (
                      <>
                        <button type="button" className="botao-secundario" onClick={() => setAberto({ tipo: "editar", selecao: s })}>
                          Editar<span className="sr-only"> {s.title}</span>
                        </button>
                        <button type="button" className="botao-secundario" onClick={() => setAberto({ tipo: "encerrar", selecao: s })}>
                          Encerrar<span className="sr-only"> {s.title}</span>
                        </button>
                      </>
                    )}
                    {!s.open && (
                      <button type="button" className="botao-texto-perigo" onClick={() => setAberto({ tipo: "excluir", selecao: s })}>
                        Excluir<span className="sr-only"> {s.title}</span>
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="painel-vazio">Nenhuma seleção cadastrada.</p>
          )
        }
      </Carregando>

      {(aberto?.tipo === "nova" || aberto?.tipo === "editar") && (
        <FormSelecao selecao={aberto.selecao} aoFechar={fechar} aoSalvar={selecoes.recarregar} />
      )}
      {aberto?.tipo === "encerrar" && (
        <Confirmar
          titulo={`Encerrar ${aberto.selecao.title}?`}
          texto="O site passa a dizer que as inscrições estão fechadas, mesmo antes da data final, e a seleção não volta a abrir."
          acao="Encerrar seleção"
          aoFechar={fechar}
          aoConfirmar={async () => {
            await painel.patch(`api/selection/finalizeSelection/${aberto.selecao._id}`);
            avisar(`${aberto.selecao.title} foi encerrada.`);
            selecoes.recarregar();
          }}
        />
      )}
      {aberto?.tipo === "excluir" && (
        <Confirmar
          titulo={`Excluir ${aberto.selecao.title}?`}
          texto="Ela sai da lista do painel. O site não muda: seleção encerrada não aparece lá."
          acao="Excluir seleção"
          aoFechar={fechar}
          aoConfirmar={async () => {
            await painel.delete(`api/selection/${aberto.selecao._id}`);
            avisar(`${aberto.selecao.title} foi excluída.`);
            selecoes.recarregar();
          }}
        />
      )}
    </section>
  );
}

function FormSelecao({ selecao, aoFechar, aoSalvar }) {
  const nova = !selecao;
  const [f, setF] = useState({
    title: selecao?.title || "",
    inicio: paraCampoHora(selecao?.dateBegin),
    fim: paraCampoHora(selecao?.dateEnd),
    formLink: selecao?.formLink || "",
  });
  const muda = (campo) => (e) => setF({ ...f, [campo]: e.target.value });
  const { erros, enviando, aoEnviar } = useEnvio({
    prefixo: "selecao",
    validar: () => {
      const e = {};
      const t = f.title.trim().length;
      if (t < 5 || t > 30) e.title = "Escreva o nome, com 5 a 30 caracteres, como “Seleção 2026/2”.";
      if (!f.inicio) e.inicio = "Escolha quando as inscrições abrem.";
      if (!f.fim) e.fim = "Escolha quando as inscrições fecham.";
      else if (f.inicio && f.fim <= f.inicio) e.fim = "O fim precisa ser depois do início.";
      if (!/^https:\/\/\S+$/.test(f.formLink.trim())) e.formLink = "Cole o link do formulário, começando com https://.";
      return e;
    },
    sucesso: nova ? "Seleção criada." : "Alterações salvas.",
    aoTerminar: () => {
      aoSalvar();
      aoFechar();
    },
    enviar: () => {
      const corpo = {
        title: f.title.trim(),
        dateBegin: deCampoHora(f.inicio),
        dateEnd: deCampoHora(f.fim),
        formLink: f.formLink.trim(),
      };
      return nova ? painel.post("api/selection", corpo) : painel.put(`api/selection/${selecao._id}`, corpo);
    },
  });
  return (
    <Janela titulo={nova ? "Criar seleção" : `Editar ${selecao.title}`} aberta aoFechar={aoFechar}>
      <form onSubmit={aoEnviar} noValidate className="painel-form">
        <Campo id="selecao-title" rotulo="Nome" erro={erros.title}>
          <input value={f.title} maxLength="30" onChange={muda("title")} />
        </Campo>
        <div className="painel-form-dupla">
          <Campo id="selecao-inicio" rotulo="Inscrições abrem em" dica="Horário de Brasília." erro={erros.inicio}>
            <input type="datetime-local" value={f.inicio} onChange={muda("inicio")} />
          </Campo>
          <Campo id="selecao-fim" rotulo="Inscrições fecham em" dica="Horário de Brasília." erro={erros.fim}>
            <input type="datetime-local" value={f.fim} onChange={muda("fim")} />
          </Campo>
        </div>
        <Campo id="selecao-formLink" rotulo="Link do formulário de inscrição" dica="O botão “Inscreva-se” do site leva para ele." erro={erros.formLink}>
          <input type="url" value={f.formLink} onChange={muda("formLink")} placeholder="https://forms.gle/…" />
        </Campo>
        <Acoes enviando={enviando} rotulo={nova ? "Criar seleção" : "Salvar alterações"} aoCancelar={aoFechar} />
      </form>
    </Janela>
  );
}

export default Selecoes;
