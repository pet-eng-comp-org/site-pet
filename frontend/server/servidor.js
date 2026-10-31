// O site do PET em produção: arquivos do build e as páginas geradas a cada
// visita, já com o texto e os dados da API, pelo React (src/entry-server.jsx).
// Quem abre vê a página pronta antes do JavaScript; o link compartilhado
// mostra o título e a foto da página certa. Só usa o Node: sem dependências.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath, pathToFileURL } from "node:url";

const raiz = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const build = path.join(raiz, "build");
const { render, API, slug } = await import(
  pathToFileURL(path.join(raiz, "build-ssr", "entry-server.js"))
);
const modelo = fs.readFileSync(path.join(build, "index.html"), "utf8");
const SITE = "https://pet.inf.ufes.br";
const PORTA = Number(process.env.PORT) || 80;

// ---- Dados da API -----------------------------------------------------------

// Cada caminho fica guardado 60 s. Depois disso a página ainda sai com o que
// está guardado e a busca nova corre por trás; só a primeira visita espera a
// API, e no máximo 2 s. Sem resposta, a página sai sem os dados e o navegador
// tenta de novo, como antes.
const guardado = new Map();
const VALIDADE = 60 * 1000;

const buscarNaApi = async (caminho) => {
  try {
    const resposta = await fetch(API + caminho, { signal: AbortSignal.timeout(2000) });
    const valor = resposta.ok
      ? { data: await resposta.json() }
      : { status: resposta.status };
    guardado.set(caminho, { valor, em: Date.now() });
    return valor;
  } catch {
    return guardado.get(caminho)?.valor;
  }
};

const buscar = (caminho) => {
  const item = guardado.get(caminho);
  if (!item) return buscarNaApi(caminho);
  if (Date.now() - item.em > VALIDADE && !item.buscando) {
    item.buscando = true;
    buscarNaApi(caminho).finally(() => (item.buscando = false));
  }
  return item.valor;
};

// ---- Páginas ----------------------------------------------------------------

// A faixa de inscrições abertas aparece em todas as páginas.
const SELECAO = "api/selection/openSelection";

// rota: título, descrição (sem ela, a página não é indexada) e dados da API.
const paginas = {
  "/": { dados: ["api/news/"] },
  "/sobre": {
    titulo: "Quem somos",
    descricao: "Os petianos atuais e o professor tutor do PET Engenharia de Computação da Ufes.",
    dados: ["api/members/", "api/comissions"],
  },
  "/projetos": {
    titulo: "Projetos",
    descricao: "IntroComp, Topcom, PET Game Jam, monitorias e os outros projetos do grupo.",
    dados: ["api/comissions"],
  },
  "/documentos": {
    titulo: "Documentos",
    descricao: "Normas, planejamentos, relatórios e editais de seleção do PET Engenharia de Computação.",
    dados: ["api/documents/"],
  },
  "/contato": {
    titulo: "Contato",
    descricao: "Fale com o PET Engenharia de Computação da Ufes pelo formulário ou por e-mail.",
  },
  "/inscricoes": {
    titulo: "Faça parte do PET",
    descricao: "Requisitos, bolsa e seleção para entrar no PET Engenharia de Computação da Ufes.",
    dados: ["api/documents/"],
  },
  // Sem texto público: chegam vazios e o React os monta no navegador.
  "/login": { titulo: "Entrar no painel", casca: true },
  "/admin": { titulo: "Painel", casca: true },
};

// A primeira frase da descrição do projeto, para a prévia do link.
const primeiraFrase = (texto) =>
  (texto.match(/^.*?[.!?](\s|$)/s)?.[0] || texto).trim().slice(0, 200);

const fotoDoProjeto = (c) =>
  c.photos.length > 1
    ? `${API}api/file/getComissionPhoto/${c.photos[1]}?largura=800`
    : null;

const atributo = (texto) =>
  String(texto).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// O JSON vai dentro de <script>: "<" escapado não fecha a tag antes da hora.
const jsonNoHtml = (valor) => JSON.stringify(valor).replace(/</g, "\\u003c");

const montar = ({ url, titulo, descricao, imagem, indexar, conteudo, dados }) => {
  let html = modelo.replace("<!--app-->", conteudo);
  if (url !== "/") html = html.replace(/<link[^>]*data-so-inicio[^>]*>/, "");
  if (titulo) {
    const completo = `${titulo} · PET Eng Comp Ufes`;
    html = html
      .replace(/<title>[^<]*<\/title>/, `<title>${atributo(completo)}</title>`)
      .replace(/(property="og:title" content=")[^"]*/, `$1${atributo(completo)}`);
  }
  html = html.replace(/(property="og:url" content=")[^"]*/, `$1${SITE}${url}`);
  if (descricao)
    html = html.replace(
      /((?:name="description"|property="og:description")\s+content=")[^"]*/g,
      `$1${atributo(descricao)}`
    );
  if (imagem)
    html = html
      .replace(/(property="og:image" content=")[^"]*/, `$1${atributo(imagem)}`)
      .replace(/\s*<meta property="og:image:(width|height)"[^>]*>/g, "");
  if (!indexar) html = html.replace("<head>", '<head><meta name="robots" content="noindex" />');
  if (dados)
    html = html.replace(
      '<script type="module"',
      `<script id="dados-iniciais" type="application/json">${jsonNoHtml(dados)}</script>\n    <script type="module"`
    );
  return html;
};

const gerarPagina = async (url) => {
  const pagina = paginas[url];
  if (pagina?.casca)
    return { status: 200, html: montar({ url, titulo: pagina.titulo, conteudo: "" }) };

  const projeto = url.match(/^\/projetos\/([^/]+)$/)?.[1];
  const caminhos = [SELECAO, ...(pagina?.dados || []), ...(projeto ? ["api/comissions"] : [])];
  const dados = {};
  for (const [caminho, valor] of await Promise.all(
    caminhos.map(async (c) => [c, await buscar(c)])
  ))
    if (valor) dados[caminho] = valor;

  const conteudo = render(url, dados);
  if (pagina)
    return {
      status: 200,
      html: montar({ url, ...pagina, indexar: Boolean(pagina.descricao) || url === "/", conteudo, dados }),
    };

  if (projeto) {
    const comissoes = dados["api/comissions"]?.data?.comissions;
    const c = comissoes?.find((x) => slug(x.title) === projeto);
    // Sem a API, não dá para saber se o projeto existe: a página sai com o
    // aviso de falha do React, e não com um 404 que talvez não seja verdade.
    if (c || !comissoes)
      return {
        status: 200,
        html: montar({
          url,
          titulo: c?.title || "Projetos",
          descricao: c && primeiraFrase(c.description),
          imagem: c && fotoDoProjeto(c),
          indexar: Boolean(c),
          conteudo,
          dados,
        }),
      };
  }
  return {
    status: 404,
    html: montar({ url, titulo: "Página não encontrada", conteudo, dados }),
  };
};

// ---- Arquivos do build ------------------------------------------------------

const TIPOS = {
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};
const COMPRIMIR = /^(text\/|application\/(json|manifest)|image\/svg)/;

// O que não é página nem está em build/ (index.html fica de fora: as páginas
// saem do servidor).
const arquivoDo = (url) => {
  const alvo = path.join(build, decodeURIComponent(url));
  if (!alvo.startsWith(build + path.sep) || alvo.endsWith(".html")) return null;
  try {
    return fs.statSync(alvo).isFile() ? alvo : null;
  } catch {
    return null;
  }
};

// Cada arquivo é lido e comprimido uma vez só: o build não muda enquanto o
// servidor roda.
const lidos = new Map();
const ler = (arquivo) => {
  if (!lidos.has(arquivo)) {
    const corpo = fs.readFileSync(arquivo);
    const tipo = TIPOS[path.extname(arquivo)] || "application/octet-stream";
    const st = fs.statSync(arquivo);
    lidos.set(arquivo, {
      corpo,
      tipo,
      etag: `"${st.size.toString(16)}-${st.mtimeMs.toString(16)}"`,
      gzip: COMPRIMIR.test(tipo) ? zlib.gzipSync(corpo) : null,
      br: COMPRIMIR.test(tipo) ? zlib.brotliCompressSync(corpo) : null,
    });
  }
  return lidos.get(arquivo);
};

const enviar = (req, res, status, cabecalhos, corpo, comprimidos) => {
  const aceita = req.headers["accept-encoding"] || "";
  const [codificacao, saida] =
    comprimidos?.br && /\bbr\b/.test(aceita)
      ? ["br", comprimidos.br]
      : comprimidos?.gzip && /\bgzip\b/.test(aceita)
      ? ["gzip", comprimidos.gzip]
      : [null, corpo];
  res.writeHead(status, {
    ...cabecalhos,
    ...(codificacao && { "Content-Encoding": codificacao }),
    ...(comprimidos && { Vary: "Accept-Encoding" }),
    "Content-Length": saida.length,
  });
  res.end(req.method === "HEAD" ? undefined : saida);
};

// ---- Servidor ---------------------------------------------------------------

const servidor = http.createServer(async (req, res) => {
  try {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { Allow: "GET, HEAD" }).end();
      return;
    }
    const { pathname } = new URL(req.url, SITE);

    // Endereço antigo da página de inscrição, que ainda circula.
    if (/^\/subscription(\/|$)/i.test(pathname)) {
      res.writeHead(301, { Location: "/inscricoes" }).end();
      return;
    }

    const arquivo = arquivoDo(pathname);
    if (arquivo) {
      const a = ler(arquivo);
      if (req.headers["if-none-match"] === a.etag) {
        res.writeHead(304, { ETag: a.etag }).end();
        return;
      }
      // Os de assets/ têm o conteúdo no nome: podem ficar um ano no navegador.
      const cache = pathname.startsWith("/assets/")
        ? "public, max-age=31536000, immutable"
        : "public, max-age=3600";
      enviar(req, res, 200, { "Content-Type": a.tipo, "Cache-Control": cache, ETag: a.etag }, a.corpo, a);
      return;
    }

    // "/sobre/" é a mesma página que "/sobre".
    const url = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
    const { status, html } = await gerarPagina(url);
    const corpo = Buffer.from(html);
    const aceita = req.headers["accept-encoding"] || "";
    const comprimidos = /\bbr\b/.test(aceita)
      ? { br: zlib.brotliCompressSync(corpo, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } }) }
      : /\bgzip\b/.test(aceita)
      ? { gzip: zlib.gzipSync(corpo) }
      : null;
    enviar(
      req,
      res,
      status,
      { "Content-Type": TIPOS[".html"], "Cache-Control": "no-cache" },
      corpo,
      comprimidos
    );
  } catch (err) {
    console.error(new Date().toISOString(), req.url, err);
    if (!res.headersSent) res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Erro no servidor do site. Tente de novo em alguns minutos.");
  }
});

servidor.listen(PORTA, () => console.log(`site na porta ${PORTA}`));

// O Docker para o container com SIGTERM: termina as respostas em andamento.
process.on("SIGTERM", () => servidor.close(() => process.exit(0)));
