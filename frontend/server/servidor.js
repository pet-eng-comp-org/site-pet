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

// Dado bom fica guardado 30 s. Vencido, a visita espera a busca nova por até
// 1 s e, sem resposta, sai com o que está guardado; sem nada guardado, espera
// até 2 s. Erro da API não é guardado como dado: fica só a lembrança de que
// ela falhou, por 15 s, para as visitas seguintes não esperarem de novo. Sem
// dado, a página sai com o carregando e o navegador busca sozinho.
const guardado = new Map();
const falhouEm = new Map();
const VALIDADE = 30 * 1000;
const PAUSA_DEPOIS_DE_FALHA = 15 * 1000;

// Só o que a página mostra: a lista de membros traz também os que já saíram.
const enxugar = (caminho, data) =>
  caminho === "api/members/"
    ? { ...data, members: data.members.filter((m) => m.active) }
    : data;

const buscarNaApi = async (caminho, limite) => {
  try {
    const resposta = await fetch(API + caminho, { signal: AbortSignal.timeout(limite) });
    if (!resposta.ok) throw new Error(`API respondeu ${resposta.status}`);
    const valor = { data: enxugar(caminho, await resposta.json()) };
    guardado.set(caminho, { valor, em: Date.now() });
    falhouEm.delete(caminho);
    return valor;
  } catch {
    falhouEm.set(caminho, Date.now());
    return undefined;
  }
};

// fresco: ignora o guardado (projeto que não está na lista pode ser novo).
const buscar = async (caminho, { fresco = false } = {}) => {
  const item = guardado.get(caminho);
  if (item && !fresco && Date.now() - item.em < VALIDADE) return item.valor;
  if (Date.now() - (falhouEm.get(caminho) || 0) < PAUSA_DEPOIS_DE_FALHA) return item?.valor;
  return (await buscarNaApi(caminho, item ? 1000 : 2000)) || item?.valor;
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
// Passando de 200 caracteres, corta no fim de uma palavra, com reticências:
// cortada no meio, "Tutorial" virava "Tutoria" e parecia erro.
const primeiraFrase = (texto) => {
  const frase = (texto.match(/^.*?[.!?](\s|$)/s)?.[0] || texto).trim();
  if (frase.length <= 200) return frase;
  return `${frase.slice(0, 200).replace(/\s+\S*$/, "").replace(/[\s,;:]+$/, "")}…`;
};

// A primeira foto deitada ou quadrada da galeria: a prévia do link é larga, e
// foto em pé sai cortada. Sem nenhuma, fica a imagem padrão do site. A ordem
// das fotos se muda no painel.
const fotoDoProjeto = (c) => {
  const deitada = c.photos
    .slice(1)
    .find((id) => {
      const m = (c.medidas || []).find((f) => f._id === id);
      return m && m.width >= m.height;
    });
  return deitada ? `${API}api/file/getComissionPhoto/${deitada}?largura=800` : null;
};

const atributo = (texto) =>
  String(texto)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

// O JSON vai dentro de <script>: "<" escapado não fecha a tag antes da hora.
const jsonNoHtml = (valor) => JSON.stringify(valor).replace(/</g, "\\u003c");

// Toda troca usa função, e não texto: num texto de substituição o JavaScript
// interpreta $&, $', $` e $1, e um "R$1.000" ou um "$'" vindo da API
// quebraria a página ou abriria uma tag.
const montar = ({ url, titulo, descricao, imagem, indexar, conteudo, dados }) => {
  let html = modelo.replace("<!--app-->", () => conteudo);
  if (url !== "/") html = html.replace(/<link[^>]*data-so-inicio[^>]*>/, "");
  if (titulo) {
    const completo = `${titulo} · PET Eng Comp Ufes`;
    html = html
      .replace(/<title>[^<]*<\/title>/, () => `<title>${atributo(completo)}</title>`)
      .replace(/(property="og:title" content=")[^"]*/, (_, a) => a + atributo(completo));
  }
  html = html.replace(/(property="og:url" content=")[^"]*/, (_, a) => a + atributo(SITE + url));
  if (descricao)
    html = html.replace(
      /((?:name="description"|property="og:description")\s+content=")[^"]*/g,
      (_, a) => a + atributo(descricao)
    );
  if (imagem)
    html = html
      .replace(/(property="og:image" content=")[^"]*/, (_, a) => a + atributo(imagem))
      .replace(/\s*<meta property="og:image:(width|height)"[^>]*>/g, "");
  if (!indexar) html = html.replace("<head>", '<head><meta name="robots" content="noindex" />');
  if (dados)
    html = html.replace(
      '<script type="module"',
      () => `<script id="dados-iniciais" type="application/json">${jsonNoHtml(dados)}</script>\n    <script type="module"`
    );
  return html;
};

const gerarPagina = async (url) => {
  // Cada seção do painel tem endereço próprio; todas chegam vazias.
  const pagina = paginas[url] || (url.startsWith("/admin/") ? paginas["/admin"] : undefined);
  if (pagina?.casca)
    return { status: 200, html: montar({ url, titulo: pagina.titulo, conteudo: "" }) };

  const projeto = url.match(/^\/projetos\/([^/]+)$/)?.[1];
  const caminhos = [SELECAO, ...(pagina?.dados || []), ...(projeto ? ["api/comissions"] : [])];
  const dados = {};
  for (const [caminho, valor] of await Promise.all(
    caminhos.map(async (c) => [c, await buscar(c)])
  ))
    if (valor) dados[caminho] = valor;

  // Projeto fora da lista guardada pode ter sido criado agora: confere na
  // API antes de responder 404.
  const naLista = (d) =>
    d["api/comissions"]?.data?.comissions.some((x) => slug(x.title) === projeto);
  if (projeto && dados["api/comissions"] && !naLista(dados)) {
    const nova = await buscar("api/comissions", { fresco: true });
    if (nova) dados["api/comissions"] = nova;
  }

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
  let caminho;
  try {
    caminho = decodeURIComponent(url);
  } catch {
    return null; // codificação inválida: segue como página, e dá 404
  }
  const alvo = path.join(build, caminho);
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

    // "/sobre/" é a mesma página que "/sobre". Endereço com codificação
    // inválida (%E0%A4%A) não é página nenhuma: vira o 404.
    let url = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
    try {
      decodeURI(url);
    } catch {
      url = "/pagina-nao-encontrada";
    }
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
