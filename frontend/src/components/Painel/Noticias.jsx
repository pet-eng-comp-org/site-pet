import React, { useEffect, useState } from "react";
import useTitulo from "../../utils/useTitulo";
import { painel } from "./painelApi";
import { API, Acoes, Campo, Carregando, Confirmar, Janela, dataPorExtenso, useAvisar, useEnvio, useLista } from "./ui";

const imagem = (n) => `${API}api/file/getImageNews/${n.file._id}`;
// Como na página inicial: notícia com mais de seis meses não aparece.
const SEIS_MESES = 183 * 24 * 60 * 60 * 1000;
const noSite = (n) => Date.now() - Date.parse(n.date) < SEIS_MESES;

function Noticias() {
  useTitulo("Notícias · Painel");
  const noticias = useLista("api/news/", (d) => [...d.news].sort((a, b) => Date.parse(b.date) - Date.parse(a.date)));
  const [aberto, setAberto] = useState(null);
  const fechar = () => setAberto(null);
  const avisar = useAvisar();

  return (
    <section aria-labelledby="titulo-secao">
      <div className="painel-cabecalho">
        <h2 id="titulo-secao" tabIndex={-1}>Notícias</h2>
        <button type="button" className="botao-principal" onClick={() => setAberto({ tipo: "nova" })}>
          Publicar notícia
        </button>
      </div>
      <p className="painel-intro">A página inicial mostra as notícias dos últimos seis meses; as mais antigas ficam só aqui.</p>
      <Carregando estado={noticias}>
        {(lista) =>
          lista.length ? (
            <ul className="painel-lista">
              {lista.map((n) => (
                <li key={n._id} className="painel-item">
                  {n.file ? (
                    <img className="painel-foto painel-foto-quadrada" src={imagem(n)} alt="" width="56" height="56" loading="lazy" />
                  ) : (
                    <span className="painel-foto painel-foto-vazia painel-foto-quadrada" aria-hidden="true" />
                  )}
                  <div className="painel-item-texto">
                    <strong>{n.title}</strong>
                    <span>
                      {dataPorExtenso(n.date)} · {noSite(n) ? "na página inicial" : "fora do site (mais de seis meses)"}
                    </span>
                  </div>
                  <div className="painel-item-acoes">
                    <button type="button" className="botao-secundario" onClick={() => setAberto({ tipo: "editar", noticia: n })}>
                      Editar<span className="sr-only"> {n.title}</span>
                    </button>
                    <button type="button" className="botao-texto-perigo" onClick={() => setAberto({ tipo: "excluir", noticia: n })}>
                      Excluir<span className="sr-only"> {n.title}</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="painel-vazio">Nenhuma notícia publicada.</p>
          )
        }
      </Carregando>

      {(aberto?.tipo === "nova" || aberto?.tipo === "editar") && (
        <FormNoticia noticia={aberto.noticia} aoFechar={fechar} aoSalvar={noticias.recarregar} />
      )}
      {aberto?.tipo === "excluir" && (
        <Confirmar
          titulo={`Excluir a notícia “${aberto.noticia.title}”?`}
          texto="A notícia e a imagem dela são apagadas. Não dá para desfazer."
          acao="Excluir notícia"
          aoFechar={fechar}
          aoConfirmar={async () => {
            await painel.delete(`api/news/${aberto.noticia._id}`);
            avisar("Notícia excluída.");
            noticias.recarregar();
          }}
        />
      )}
    </section>
  );
}

function FormNoticia({ noticia, aoFechar, aoSalvar }) {
  const nova = !noticia;
  const [f, setF] = useState({ title: noticia?.title || "", text: noticia?.text || "" });
  const [arquivo, setArquivo] = useState(null);
  const [previa, setPrevia] = useState(noticia?.file ? imagem(noticia) : null);
  useEffect(() => () => arquivo && URL.revokeObjectURL(previa), [arquivo, previa]);
  const muda = (campo) => (e) => setF({ ...f, [campo]: e.target.value });

  const { erros, enviando, aoEnviar, erroGeral } = useEnvio({
    prefixo: "noticia",
    validar: () => {
      const e = {};
      const t = f.title.trim().length;
      if (t < 5 || t > 100) e.title = "Escreva o título, com 5 a 100 caracteres.";
      if (f.text.trim().length < 5) e.text = "Escreva o texto, com pelo menos 5 caracteres.";
      if (nova && !arquivo) e.imagem = "Escolha uma imagem: ela abre o cartão da notícia.";
      return e;
    },
    sucesso: nova ? "Notícia publicada na página inicial." : "Alterações salvas.",
    aoTerminar: () => {
      aoSalvar();
      aoFechar();
    },
    enviar: async () => {
      const titulo = { title: f.title.trim(), text: f.text.trim() };
      if (nova) {
        const dados = new FormData();
        dados.append("title", titulo.title);
        dados.append("text", titulo.text);
        dados.append("file", arquivo);
        await painel.post("api/news", dados);
        return;
      }
      await painel.patch(`api/news/updateTexts/${noticia._id}`, titulo);
      if (arquivo) {
        const dados = new FormData();
        dados.append("file", arquivo);
        await painel.patch(`api/news/updateImage/${noticia._id}`, dados);
      }
    },
  });

  return (
    <Janela titulo={nova ? "Publicar notícia" : "Editar notícia"} aberta aoFechar={aoFechar} larga>
      <form onSubmit={aoEnviar} noValidate className="painel-form">
        <Campo id="noticia-title" rotulo="Título" erro={erros.title}>
          <input value={f.title} maxLength="100" onChange={muda("title")} />
        </Campo>
        <Campo id="noticia-text" rotulo="Texto" dica="Endereço que comece com https:// vira link sozinho." erro={erros.text}>
          <textarea rows="6" value={f.text} onChange={muda("text")} />
        </Campo>
        <div className="painel-form-foto">
          {previa && <img src={previa} alt="" width="160" height="90" className="painel-previa-larga" />}
          <Campo id="noticia-imagem" rotulo={nova ? "Imagem" : "Trocar a imagem"} dica="Deitada, como 16:9; ela abre o cartão." erro={erros.imagem}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const arq = e.target.files[0] || null;
                setArquivo(arq);
                setPrevia(arq ? URL.createObjectURL(arq) : noticia?.file ? imagem(noticia) : null);
              }}
            />
          </Campo>
        </div>
        <Acoes erro={erroGeral} enviando={enviando} rotulo={nova ? "Publicar notícia" : "Salvar alterações"} aoCancelar={aoFechar} />
      </form>
    </Janela>
  );
}

export default Noticias;
