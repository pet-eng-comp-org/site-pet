// Depois do build: uma cópia do index.html por página, com título e descrição
// próprios, para o link compartilhado (WhatsApp, Instagram) mostrar a página
// certa; e o 404.html, que o serve devolve com status 404 em endereço que não existe.
const fs = require("fs");
const path = require("path");

const build = path.join(__dirname, "..", "build");
const modelo = fs.readFileSync(path.join(build, "index.html"), "utf8");
const site = "https://pet.inf.ufes.br";

const paginas = {
  "/sobre": ["Quem somos", "Os petianos atuais e o professor tutor do PET Engenharia de Computação da Ufes."],
  "/projetos": ["Projetos", "IntroComp, Topcom, PET Game Jam, monitorias e os outros projetos do grupo."],
  "/documentos": ["Documentos", "Normas, planejamentos, relatórios e editais de seleção do PET Engenharia de Computação."],
  "/contato": ["Contato", "Fale com o PET Engenharia de Computação da Ufes pelo formulário ou por e-mail."],
  "/inscricoes": ["Faça parte do PET", "Requisitos, bolsa e seleção para entrar no PET Engenharia de Computação da Ufes."],
  "/login": ["Entrar no painel", null],
  "/admin": ["Painel", null],
  "/404": ["Página não encontrada", null],
};

const atributo = (texto) => texto.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

for (const [rota, [titulo, descricao]] of Object.entries(paginas)) {
  const completo = `${titulo} · PET Eng Comp Ufes`;
  let html = modelo
    .replace(/<link[^>]*data-so-inicio[^>]*>/, "")
    .replace(/<title>[^<]*<\/title>/, `<title>${completo}</title>`)
    .replace(/(property="og:title" content=")[^"]*/, `$1${atributo(completo)}`)
    .replace(/(property="og:url" content=")[^"]*/, `$1${site}${rota}`);
  if (descricao)
    html = html.replace(/((?:name="description"|property="og:description")\s+content=")[^"]*/g, `$1${atributo(descricao)}`);
  else html = html.replace("<head>", '<head><meta name="robots" content="noindex" />');

  const destino = rota === "/404" ? path.join(build, "404.html") : path.join(build, rota.slice(1), "index.html");
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, html);
}
console.log("páginas:", Object.keys(paginas).join(" "));
