// Depois do build: um HTML por página, com título e descrição próprios (para o
// link compartilhado mostrar a página certa) e com o texto da página já dentro,
// gerado pelo React (src/entry-server.jsx). Quem abre vê o conteúdo antes de o
// JavaScript chegar, e o React só assume a página. O 404.html o serve devolve
// com status 404 em endereço que não existe.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const raiz = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const build = path.join(raiz, "build");
const ssr = path.join(raiz, "build-ssr");
const { render } = await import(pathToFileURL(path.join(ssr, "entry-server.js")));
const modelo = fs.readFileSync(path.join(build, "index.html"), "utf8");
const site = "https://pet.inf.ufes.br";

// rota: [título, descrição, arquivo]. Sem descrição, a página não é indexada.
// Login e painel não têm texto público: chegam vazios e o React os monta.
// /projetos/_projeto é a casca das páginas de projeto (public/serve.json).
const paginas = {
  "/": [null, null],
  "/sobre": ["Quem somos", "Os petianos atuais e o professor tutor do PET Engenharia de Computação da Ufes."],
  "/projetos": ["Projetos", "IntroComp, Topcom, PET Game Jam, monitorias e os outros projetos do grupo."],
  "/projetos/_projeto": ["Projetos", "IntroComp, Topcom, PET Game Jam, monitorias e os outros projetos do grupo."],
  "/documentos": ["Documentos", "Normas, planejamentos, relatórios e editais de seleção do PET Engenharia de Computação."],
  "/contato": ["Contato", "Fale com o PET Engenharia de Computação da Ufes pelo formulário ou por e-mail."],
  "/inscricoes": ["Faça parte do PET", "Requisitos, bolsa e seleção para entrar no PET Engenharia de Computação da Ufes."],
  "/login": ["Entrar no painel", null],
  "/admin": ["Painel", null],
  "/404": ["Página não encontrada", null],
};
const semTexto = new Set(["/login", "/admin"]);

const atributo = (texto) => texto.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

for (const [rota, [titulo, descricao]] of Object.entries(paginas)) {
  let html = modelo.replace("<!--app-->", semTexto.has(rota) ? "" : render(rota));
  if (rota !== "/") {
    const completo = `${titulo} · PET Eng Comp Ufes`;
    html = html
      .replace(/<link[^>]*data-so-inicio[^>]*>/, "")
      .replace(/<title>[^<]*<\/title>/, `<title>${completo}</title>`)
      .replace(/(property="og:title" content=")[^"]*/, `$1${atributo(completo)}`)
      .replace(/(property="og:url" content=")[^"]*/, `$1${site}${rota.replace("/_projeto", "")}`);
    if (descricao)
      html = html.replace(/((?:name="description"|property="og:description")\s+content=")[^"]*/g, `$1${atributo(descricao)}`);
    else html = html.replace("<head>", '<head><meta name="robots" content="noindex" />');
  }

  const destino =
    rota === "/404" ? path.join(build, "404.html") : path.join(build, rota.slice(1), "index.html");
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, html);
}
fs.rmSync(ssr, { recursive: true, force: true });
console.log("páginas:", Object.keys(paginas).join(" "));
