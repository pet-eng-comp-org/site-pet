"use client";

import { Fragment, type CSSProperties } from "react";
import Link from "next/link";
import useApi from "../../../services/useApi";
import slug from "../../../utils/slug";
import iconeProjeto from "../../../utils/iconeProjeto";
import CargaFalhou from "../../CargaFalhou/CargaFalhou";
import Loader from "../../Loader/Loader";
import NaoEncontrada from "../../NaoEncontrada/NaoEncontrada";
import { marcarVolta } from "../Projects";
import { ICONE } from "../Project/Project";
import { API } from "../../../services/apiUrl";
import type { Comissao } from "../../../tipos";

const foto = (id: string) => `${API}api/file/getComissionPhoto/${id}`;

// Cada foto aparece inteira, na proporção dela, em linhas de mesma altura.
// A API manda largura e altura, então o espaço é reservado antes de a foto
// chegar e a página não pula.
const medidas = (comission: Comissao, id: string) => {
  const m = (comission.medidas || []).find((f) => f._id === id);
  return m?.width && m.height ? { width: m.width, height: m.height, alt: m.alt } : { width: 1600, height: 1067, alt: undefined };
};

// Versões que o servidor faz (fileController): 400 e 800 px, mais o original.
const srcSet = (id: string, largura: number) =>
  [400, 800]
    .filter((l) => l < largura)
    .map((l) => `${foto(id)}?largura=${l} ${l}w`)
    .concat(`${foto(id)} ${largura}w`)
    .join(", ");

// Largura em que a foto aparece: a fração da linha que cabe a ela, na coluna
// de até 980 px, que até 1068 px é 87,5% da tela (1 rem de espaço entre
// fotos); no celular, a coluna toda.
const tamanho = (fracao: number, nalinha: number) =>
  `(max-width: 734px) 87.5vw, calc((min(87.5vw, 980px) - ${nalinha - 1}rem) * ${fracao.toFixed(3)})`;

// Divide as fotos, na ordem, em linhas de soma de proporções parecida (cerca
// de 3,5 por linha, uns 300 px de altura na tela larga), para nenhuma linha
// ficar com uma foto sozinha ao lado de um vazio.
interface Foto {
  id: string;
  width: number;
  alt?: string;
  proporcao: number;
}

const linhas = (fotos: Foto[]) => {
  const total = fotos.reduce((s, f) => s + f.proporcao, 0);
  const k = Math.min(fotos.length, Math.max(1, Math.round(total / 3.5)));
  const alvo = total / k;
  // custo[i][j]: melhor divisão das i primeiras fotos em j linhas.
  const custo: number[][] = [...Array(fotos.length + 1)].map(() => Array(k + 1).fill(Infinity));
  const corte: number[][] = [...Array(fotos.length + 1)].map(() => Array(k + 1).fill(0));
  custo[0][0] = 0;
  for (let i = 1; i <= fotos.length; i++)
    for (let j = 1; j <= Math.min(i, k); j++)
      for (let a = j - 1; a < i; a++) {
        const soma = fotos.slice(a, i).reduce((s, f) => s + f.proporcao, 0);
        const c = custo[a][j - 1] + (soma - alvo) ** 2;
        if (c < custo[i][j]) [custo[i][j], corte[i][j]] = [c, a];
      }
  const resultado: Foto[][] = [];
  for (let i = fotos.length, j = k; j > 0; i = corte[i][j], j--)
    resultado.unshift(fotos.slice(corte[i][j], i));
  return resultado;
};

// Cada projeto tem endereço próprio, para dar para mandar o link a alguém.
// A primeira imagem da comissão é o ícone do cartão; as outras são fotos
// (na lista da API, cada foto vem só como o id do arquivo).
function ProjetoPagina({ projeto }: { projeto: string }) {
  const resposta = useApi("api/comissions");
  // undefined: carregando; null: não existe; "falhou": a API não respondeu.
  const comission = resposta.data
    ? resposta.data.comissions.find((c) => slug(c.title) === projeto) || null
    : resposta.carregando
    ? undefined
    : "falhou";

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
  // Canal é link do próprio projeto: o nome dele no rótulo ("Site do
  // Topcom"), ou uma ação ("Solicitar impressão 3D") ou o lugar onde os
  // projetos estão publicados ("Instructables").
  const doProjeto = (t: Comissao["tags"][number]) =>
    t.link &&
    (slug(t.title).includes(slug(comission.title)) ||
      /^(solicitar|inscrever|instructables)/i.test(t.title.trim()));
  const canais = comission.tags.filter(doProjeto);
  const ferramentas = comission.tags.filter((t) => !doProjeto(t));
  // O site do projeto é a ação principal; sem site, o primeiro canal.
  const temSite = canais.some((t) => /^site\b/i.test(t.title.trim()));

  return (
    <div className="pagina">
      {/* A abertura no centro; a galeria, logo abaixo, ocupa a coluna toda. */}
      {/* Título e texto de 21 px (19 no celular) numa coluna de 600 px, no centro. */}
      <div className="mx-auto max-w-[600px] text-center">
        <Link
          className="link-voltar mb-2 inline-flex min-h-[44px] items-center"
          href="/projetos"
          onClick={marcarVolta}
        >
          <span>Todos os projetos</span>
        </Link>
        <h1>{comission.title}</h1>
        {/* Cada linha do texto do painel é um parágrafo. */}
        {/* No celular, em 480 px, para a linha não passar de uns 60 caracteres.
            Linhas equilibradas da tela média para cima, onde o texto tem até
            6 linhas; no celular fica o pretty, que não deixa uma palavra
            sozinha no fim. */}
        <div className="text-[1.3125rem] leading-[1.381] max-tablet:mx-auto max-tablet:max-w-[480px] max-tablet:text-[1.1875rem] max-tablet:leading-[1.421] tablet:[&_p]:text-balance [&_p+p]:mt-[0.75em]">
          {comission.description
            .split(/\n+/)
            .filter((t) => t.trim())
            .map((t, i) => (
              <p key={i}>{t.trim()}</p>
            ))}
        </div>

        {canais.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-[17px] gap-y-[14px]">
            {canais.map((tag, i) => (
              <a
                key={tag._id}
                className={(temSite ? /^site\b/i.test(tag.title.trim()) : i === 0) ? "botao-principal" : "botao-contorno"}
                href={tag.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {tag.title.trim()}
              </a>
            ))}
          </div>
        )}

        {/* Ferramentas numa linha de texto: não são ações, não têm cara de botão. */}
        {ferramentas.length > 0 && (
          <p className="mx-0 mt-6 mb-0 text-14 text-texto-suave">
            <span>Ferramentas: </span>
            {ferramentas.map((tag, i) => (
              <Fragment key={tag._id}>
                {i > 0 && ", "}
                {tag.link ? (
                  <a href={tag.link} target="_blank" rel="noopener noreferrer">
                    {tag.title.trim()}
                  </a>
                ) : (
                  tag.title.trim()
                )}
              </Fragment>
            ))}
          </p>
        )}
      </div>

      {/* Sem fotos, um bloco cinza com o ícone grande, para a página não
          terminar num parágrafo solto. */}
      {fotos.length === 0 && (
        <div className="mt-10 flex h-[360px] items-center justify-center rounded-cartao bg-superficie max-tablet:h-[240px]" aria-hidden="true">
          <span
            className={`size-40 max-tablet:size-28 ${ICONE}`}
            style={{ "--icone": `url("${iconeProjeto(comission.title, comission.photos[0])}")` } as CSSProperties}
          />
        </div>
      )}
      {fotos.length > 0 && (
        // Cada linha ocupa a largura toda, com as fotos inteiras na proporção
        // delas: a largura cresce com a proporção, e a altura sai da largura,
        // igual para a linha toda. No celular, uma foto por linha.
        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-4 max-tablet:gap-3">
          {linhas(
            fotos.map((id) => {
              const { width, height, alt } = medidas(comission, id);
              return { id, width, alt, proporcao: width / height };
            })
          ).map((linha, n) => {
            const soma = linha.reduce((s, f) => s + f.proporcao, 0);
            // A primeira linha costuma estar na primeira tela: vem logo.
            const primeira = n === 0;
            return (
              <div className="flex items-start gap-4 max-tablet:flex-col max-tablet:gap-3" key={linha[0].id}>
                {linha.map((f) => (
                  <img
                    key={f.id}
                    src={foto(f.id)}
                    srcSet={srcSet(f.id, f.width)}
                    sizes={tamanho(f.proporcao / soma, linha.length)}
                    className="block aspect-(--proporcao) h-auto min-w-0 flex-[var(--proporcao)_1_0] rounded-cartao bg-superficie-suave max-tablet:w-full max-tablet:flex-none"
                    alt={f.alt || ""}
                    loading={primeira ? "eager" : "lazy"}
                    fetchPriority={primeira ? "high" : undefined}
                    style={{ "--proporcao": f.proporcao } as CSSProperties}
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
