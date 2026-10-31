import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import useApi from "../../../services/useApi";
import goUp from "../../../utils/goUp";
import slug from "../../../utils/slug";
import useTitulo from "../../../utils/useTitulo";
import CargaFalhou from "../../CargaFalhou/CargaFalhou";
import Loader from "../../Loader/Loader";
import NaoEncontrada from "../../NaoEncontrada/NaoEncontrada";
import "./ProjetoPagina.css";

const foto = (id) =>
  `${import.meta.env.VITE_API_URL}api/file/getComissionPhoto/${id}`;

// Cada foto aparece inteira, na proporção dela, em linhas de mesma altura.
// A API manda largura e altura, então o espaço é reservado antes de a foto
// chegar e a página não pula.
const medidas = (comission, id) =>
  (comission.medidas || []).find((f) => f._id === id) || { width: 1600, height: 1067 };

// Versões que o servidor faz (fileController): 400 e 800 px, mais o original.
const srcSet = (id, largura) =>
  [400, 800]
    .filter((l) => l < largura)
    .map((l) => `${foto(id)}?largura=${l} ${l}w`)
    .concat(`${foto(id)} ${largura}w`)
    .join(", ");

// Largura em que a foto aparece: a fração da linha que cabe a ela, na coluna
// de até 1140 px (1 rem de espaço entre fotos); no celular, a coluna toda.
const tamanho = (fracao, nalinha) =>
  `(max-width: 767.98px) calc(100vw - 2rem), calc((min(100vw, 1172px) - 2rem - ${nalinha - 1}rem) * ${fracao.toFixed(3)})`;

// Divide as fotos, na ordem, em linhas de soma de proporções parecida (cerca
// de 3,5 por linha, uns 300 px de altura na tela larga), para nenhuma linha
// ficar com uma foto sozinha ao lado de um vazio.
const linhas = (fotos) => {
  const total = fotos.reduce((s, f) => s + f.proporcao, 0);
  const k = Math.min(fotos.length, Math.max(1, Math.round(total / 3.5)));
  const alvo = total / k;
  // custo[i][j]: melhor divisão das i primeiras fotos em j linhas.
  const custo = [...Array(fotos.length + 1)].map(() => Array(k + 1).fill(Infinity));
  const corte = [...Array(fotos.length + 1)].map(() => Array(k + 1).fill(0));
  custo[0][0] = 0;
  for (let i = 1; i <= fotos.length; i++)
    for (let j = 1; j <= Math.min(i, k); j++)
      for (let a = j - 1; a < i; a++) {
        const soma = fotos.slice(a, i).reduce((s, f) => s + f.proporcao, 0);
        const c = custo[a][j - 1] + (soma - alvo) ** 2;
        if (c < custo[i][j]) [custo[i][j], corte[i][j]] = [c, a];
      }
  const resultado = [];
  for (let i = fotos.length, j = k; j > 0; i = corte[i][j], j--)
    resultado.unshift(fotos.slice(corte[i][j], i));
  return resultado;
};

// Cada projeto tem endereço próprio, para dar para mandar o link a alguém.
// A primeira imagem da comissão é o ícone do cartão; as outras são fotos
// (na lista da API, cada foto vem só como o id do arquivo).
function ProjetoPagina() {
  const { projeto } = useParams();
  const resposta = useApi("api/comissions");
  // undefined: carregando; null: não existe; "falhou": a API não respondeu.
  const comission = resposta.data
    ? resposta.data.comissions.find((c) => slug(c.title) === projeto) || null
    : resposta.carregando
    ? undefined
    : "falhou";

  useEffect(() => {
    goUp();
  }, [projeto]);

  useTitulo(comission?.title || "Projetos");

  if (comission === undefined)
    return (
      <div className="divloader">
        <Loader />
      </div>
    );
  if (comission === null) return <NaoEncontrada />;
  if (comission === "falhou") return <CargaFalhou titulo="Projetos" />;

  const fotos = comission.photos.slice(1);
  // Os canais do próprio projeto ("Site do Topcom", "Instagram do Mobiliza
  // PET") são ações: o site é o botão principal; os outros, links. O resto
  // das etiquetas são ferramentas, mostradas como rótulo, com ou sem link.
  const doProjeto = (t) =>
    t.link && slug(t.title).includes(slug(comission.title));
  const canais = comission.tags.filter(doProjeto);
  const ferramentas = comission.tags.filter((t) => !doProjeto(t));

  return (
    <div className="pagina">
      <Link
        className="projeto-voltar link-texto"
        to={{ pathname: "/projetos", state: { voltar: true } }}
      >
        <span>Todos os projetos</span>
      </Link>
      <h1>{comission.title}</h1>
      <p className="pagina-intro projeto-descricao">{comission.description}</p>

      {canais.length > 0 && (
        <div className="projeto-acoes">
          {canais.map((tag) => (
            <a
              key={tag._id}
              className={/^site\b/i.test(tag.title.trim()) ? "botao-principal" : "botao-link"}
              href={tag.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {tag.title.trim()}
            </a>
          ))}
        </div>
      )}

      {ferramentas.length > 0 && (
        <ul className="projeto-tags" aria-label="Ferramentas">
          {ferramentas.map((tag) => (
            <li key={tag._id}>
              {tag.link ? (
                <a href={tag.link} target="_blank" rel="noopener noreferrer">
                  {tag.title.trim()}
                </a>
              ) : (
                <span>{tag.title.trim()}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {fotos.length > 0 && (
        <div className="projeto-fotos">
          {linhas(
            fotos.map((id) => {
              const { width, height } = medidas(comission, id);
              return { id, width, proporcao: width / height };
            })
          ).map((linha, n) => {
            const soma = linha.reduce((s, f) => s + f.proporcao, 0);
            // A primeira linha costuma estar na primeira tela: vem logo.
            const primeira = n === 0;
            return (
              <div className="projeto-fotos-linha" key={linha[0].id}>
                {linha.map((f) => (
                  <img
                    key={f.id}
                    src={foto(f.id)}
                    srcSet={srcSet(f.id, f.width)}
                    sizes={tamanho(f.proporcao / soma, linha.length)}
                    alt=""
                    loading={primeira ? "eager" : "lazy"}
                    fetchpriority={primeira ? "high" : undefined}
                    style={{ "--proporcao": f.proporcao }}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProjetoPagina;
