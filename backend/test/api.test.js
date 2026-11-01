// Testes de cenario da API: sobem o servidor (index.js, o mesmo da imagem) contra
// um MongoDB de verdade e conversam com ele por HTTP, como o site e o painel.
//
// O foco e o que ja quebrou sem ninguem ver: requisicao anonima que derrubava o
// processo, login que aceitava credencial malformada, rotas do painel sem login
// e o que as rotas publicas expoem.
//
// Rodar: `npm test` com um MongoDB acessivel. O banco de MONGO_URL_TESTE (padrao
// abaixo) e APAGADO a cada execucao; o nome precisa conter "teste".

const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { spawn } = require("node:child_process");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const RAIZ = path.join(__dirname, "..");
const URL_BANCO = process.env.MONGO_URL_TESTE || "mongodb://127.0.0.1:27017/sitepet_teste";
const TOKEN_SECRET = "segredo-de-teste";
const PORTA = 34_569;
const BASE = `http://127.0.0.1:${PORTA}`;
const MEMBRO = { email: "membro@exemplo.com", senha: "senha:com:dois-pontos" };
const INATIVO = { email: "inativo@exemplo.com", senha: "senha-do-inativo" };
const ID = "000000000000000000000000";

let conexao;
let servidor;
let saida = "";

async function preparaBanco() {
  const nome = new URL(URL_BANCO).pathname.slice(1);
  if (!/teste/.test(nome)) throw new Error(`recuso apagar o banco "${nome}": o nome precisa conter "teste"`);
  conexao = await mongoose.createConnection(URL_BANCO);
  await conexao.dropDatabase();
  await conexao.db.collection("members").insertMany([
    { memberName: "Membro Teste", email: MEMBRO.email, password: bcrypt.hashSync(MEMBRO.senha, 4), active: true },
    { memberName: "Membro Inativo", email: INATIVO.email, password: bcrypt.hashSync(INATIVO.senha, 4), active: false },
  ]);
}

function sobeServidor() {
  return new Promise((resolve, reject) => {
    const s = spawn(process.execPath, ["index.js"], {
      cwd: RAIZ,
      env: { PATH: process.env.PATH, PORT: String(PORTA), DB_CONNECT: URL_BANCO, TOKEN_SECRET },
      stdio: ["ignore", "pipe", "pipe"],
    });
    const desiste = setTimeout(() => reject(new Error(`servidor nao subiu:\n${saida}`)), 30_000);
    const le = (pedaco) => {
      saida += pedaco;
      if (saida.includes("Connected to db!") && saida.includes("Server running")) {
        clearTimeout(desiste);
        resolve(s);
      }
    };
    s.stdout.on("data", le);
    s.stderr.on("data", le);
    s.on("exit", (codigo) => {
      saida += `\n[processo saiu: ${codigo}]`;
      reject(new Error(`servidor saiu (${codigo}):\n${saida}`));
    });
  });
}

function api(metodo, caminho, { headers = {}, corpo } = {}) {
  return fetch(BASE + caminho, { method: metodo, headers, body: corpo });
}

const basic = (credencial) => ({ authorization: "Basic " + Buffer.from(credencial).toString("base64") });

async function entra() {
  const r = await api("GET", "/api/login/", { headers: basic(`${MEMBRO.email}:${MEMBRO.senha}`) });
  assert.equal(r.status, 200, "login do membro semeado");
  return (await r.json()).token;
}

// Todo teste que manda requisicao malformada termina conferindo isto: antes, uma
// so derrubava a API inteira.
async function processoVivo() {
  const r = await api("GET", "/health");
  assert.equal(r.status, 200, "o processo caiu");
  assert.ok(!saida.includes("[processo saiu"), "o processo saiu");
}

before(async () => {
  await preparaBanco();
  servidor = await sobeServidor();
});

after(async () => {
  servidor?.kill();
  await conexao?.close();
});

describe("login", () => {
  const RECUSADOS = {
    "sem cabecalho": {},
    "esquema Bearer": { authorization: "Bearer x" },
    "Basic sem valor": { authorization: "Basic" },
    "Basic sem dois-pontos": basic(MEMBRO.email),
    "Basic com senha vazia": basic(`${MEMBRO.email}:`),
    "Basic com e-mail vazio": basic(`:${MEMBRO.senha}`),
    "senha errada": basic(`${MEMBRO.email}:errada`),
    "e-mail inexistente": basic(`ninguem@exemplo.com:${MEMBRO.senha}`),
    "membro inativo": basic(`${INATIVO.email}:${INATIVO.senha}`),
  };

  for (const [caso, headers] of Object.entries(RECUSADOS)) {
    it(`recusa: ${caso}`, async () => {
      const r = await api("GET", "/api/login/", { headers });
      assert.equal(r.status, 401);
      await processoVivo();
    });
  }

  it("aceita a credencial certa, inclusive senha com dois-pontos", async () => {
    const token = await entra();
    const r = await api("GET", "/api/members/all/", { headers: { authorization: `Bearer ${token}` } });
    assert.equal(r.status, 200, "o token abre o painel");
  });

  // Rota morta que derrubava o processo com qualquer e-mail cadastrado.
  it("forgotPassword nao existe mais", async () => {
    const r = await api("PATCH", "/api/login/forgotPassword", {
      headers: { "content-type": "application/json" },
      corpo: JSON.stringify({ email: MEMBRO.email }),
    });
    assert.equal(r.status, 404);
    await processoVivo();
  });
});

describe("rotas do painel", () => {
  // Toda rota com verify. Criar documento e anexar arquivo eram publicas.
  const PROTEGIDAS = [
    ["POST", "/api/comissions/"],
    ["PUT", `/api/comissions/${ID}`],
    ["PATCH", `/api/comissions/insertProject/${ID}`],
    ["PATCH", `/api/comissions/removeProject/${ID}`],
    ["PATCH", `/api/comissions/addPhoto/${ID}`],
    ["PATCH", `/api/comissions/removePhoto/${ID}`],
    ["PATCH", `/api/comissions/ordenarFotos/${ID}`],
    ["DELETE", `/api/comissions/${ID}`],
    ["POST", "/api/documents/"],
    ["PATCH", `/api/documents/addFile/${ID}`],
    ["PATCH", `/api/documents/removeFile/${ID}`],
    ["PUT", `/api/documents/${ID}`],
    ["DELETE", `/api/documents/${ID}`],
    ["DELETE", `/api/file/${ID}`],
    ["PATCH", `/api/login/changePassword/${ID}`],
    ["POST", "/api/members/"],
    ["GET", "/api/members/all/"],
    ["GET", `/api/members/${ID}`],
    ["GET", "/api/members/showEgressAll"],
    ["PUT", `/api/members/${ID}`],
    ["PATCH", `/api/members/sairDoPet/${ID}`],
    ["PATCH", `/api/members/firstProfilePhoto/${ID}`],
    ["PATCH", `/api/members/updateProfilePhoto/${ID}`],
    ["DELETE", `/api/members/${ID}`],
    ["POST", "/api/news/"],
    ["PATCH", `/api/news/updateTexts/${ID}`],
    ["PATCH", `/api/news/updateImage/${ID}`],
    ["DELETE", `/api/news/${ID}`],
    ["POST", "/api/projects/"],
    ["PUT", `/api/projects/${ID}`],
    ["DELETE", `/api/projects/${ID}`],
    ["GET", "/api/selection/"],
    ["GET", `/api/selection/${ID}`],
    ["POST", "/api/selection/"],
    ["PUT", `/api/selection/${ID}`],
    ["PATCH", `/api/selection/finalizeSelection/${ID}`],
    ["DELETE", `/api/selection/${ID}`],
  ];

  const TOKENS_RUINS = {
    "token que nao e JWT": "lixo",
    "assinado com outro segredo": jwt.sign({ _id: ID }, "outro-segredo"),
    vencido: jwt.sign({ _id: ID, exp: Math.floor(Date.now() / 1000) - 60 }, TOKEN_SECRET),
  };

  for (const [metodo, caminho] of PROTEGIDAS) {
    it(`${metodo} ${caminho} exige login`, async () => {
      const sem = await api(metodo, caminho);
      assert.equal(sem.status, 401, "sem token");
      for (const [caso, token] of Object.entries(TOKENS_RUINS)) {
        const r = await api(metodo, caminho, { headers: { authorization: `Bearer ${token}` } });
        assert.equal(r.status, 400, caso);
      }
    });
  }
});

describe("rotas publicas", () => {
  it("a lista de membros nao traz e-mail nem senha", async () => {
    const r = await api("GET", "/api/members/");
    assert.equal(r.status, 200);
    const corpo = await r.text();
    assert.ok(!corpo.includes(MEMBRO.email), "e-mail na lista publica");
    assert.ok(!corpo.includes('"password"') && !corpo.includes("$2"), "senha na lista publica");
  });

  it("JSON malformado responde 400, nao 500, e nao derruba", async () => {
    const r = await api("POST", "/api/contact/", {
      headers: { "content-type": "application/json" },
      corpo: "{isto nao e json",
    });
    assert.equal(r.status, 400);
    assert.ok(!(await r.text()).includes("SyntaxError"), "detalhe do erro na resposta");
    await processoVivo();
  });

  it("contato invalido diz qual campo e o que fazer, em portugues", async () => {
    const r = await api("POST", "/api/contact/", {
      headers: { "content-type": "application/json" },
      corpo: JSON.stringify({ name: "Ana", email: "ana@exemplo.com", subject: "Parceria", message: "x".repeat(5001) }),
    });
    assert.equal(r.status, 400);
    const corpo = await r.json();
    assert.equal(corpo.campo, "message");
    assert.match(corpo.erro, /mensagem/);
  });
});

describe("selecao", () => {
  const selecao = {
    title: "Seleção de teste",
    dateBegin: "2026-01-01T00:00:00-03:00",
    dateEnd: "2099-01-01T23:59:59-03:00",
    formLink: "https://forms.gle/exemplo",
  };
  const envia = (token, corpo) =>
    api("POST", "/api/selection/", {
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      corpo: JSON.stringify(corpo),
    });

  it("recusa link do formulario que nao e https", async () => {
    const r = await envia(await entra(), { ...selecao, formLink: "http://forms.gle/exemplo" });
    assert.equal(r.status, 400);
  });

  it("a selecao aberta mostra ao site so titulo, datas e o link do formulario", async () => {
    assert.equal((await envia(await entra(), selecao)).status, 200);
    const r = await api("GET", "/api/selection/openSelection");
    assert.equal(r.status, 200);
    const { selection } = await r.json();
    assert.deepEqual(Object.keys(selection).sort(), ["_id", "dateBegin", "dateEnd", "formLink", "title"]);
    assert.equal(selection.formLink, selecao.formLink);
  });

  it("o site nao recebe mais inscricao: ela e feita no Google Forms", async () => {
    const r = await api("POST", "/api/inscriptions/");
    assert.equal(r.status, 404);
  });
});

describe("documentos", () => {
  const PDF = Buffer.from("%PDF-1.4\n%%EOF\n");
  const envia = async (token, idDoc, nome, arquivo) => {
    const corpo = new FormData();
    if (nome) corpo.append("name", nome);
    corpo.append("file", new Blob([PDF], { type: "application/pdf" }), arquivo);
    return fetch(`${BASE}/api/documents/addFile/${idDoc}`, {
      method: "PATCH",
      headers: { authorization: `Bearer ${token}` },
      body: corpo,
    });
  };

  it("o arquivo novo entra no topo, com o nome escolhido no painel", async () => {
    const token = await entra();
    const criado = await api("POST", "/api/documents/", {
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      corpo: JSON.stringify({ title: "Editais de teste" }),
    });
    assert.equal(criado.status, 200, await criado.clone().text());
    const lista = await (await api("GET", "/api/documents/")).json();
    const idDoc = lista.documents.find((d) => d.title === "Editais de teste")._id;

    assert.equal((await envia(token, idDoc, "Edital nº 001/2026", "edital_001_assinado.pdf")).status, 200);
    assert.equal((await envia(token, idDoc, "Edital nº 002/2026", "edital_002_assinado.pdf")).status, 200);
    assert.equal((await envia(token, idDoc, "", "sem_nome.pdf")).status, 200);

    const doc = (await (await api("GET", "/api/documents/")).json()).documents.find((d) => d._id === idDoc);
    assert.deepEqual(doc.files.map((f) => f.name), ["sem_nome.pdf", "Edital nº 002/2026", "Edital nº 001/2026"]);
  });
});

describe("imagens", () => {
  const fs = require("node:fs");
  const sharp = require("sharp");

  // WebP e o formato que o proprio site salva; o painel aceita qualquer imagem.
  it("foto em WebP vira a foto da noticia, como JPEG e PNG", async () => {
    const webp = await sharp({ create: { width: 2000, height: 1000, channels: 3, background: "#186a6c" } })
      .webp()
      .toBuffer();
    const corpo = new FormData();
    corpo.append("title", "Noticia de teste");
    corpo.append("text", "Texto de teste");
    corpo.append("file", new Blob([webp], { type: "image/webp" }), "foto.webp");
    const r = await fetch(`${BASE}/api/news/`, {
      method: "POST",
      headers: { authorization: `Bearer ${await entra()}` },
      body: corpo,
    });
    assert.equal(r.status, 200, await r.clone().text());

    const { news } = await (await api("GET", "/api/news/")).json();
    const arquivo = path.join(RAIZ, "uploads", "news", news.find((n) => n.title === "Noticia de teste").file.key);
    try {
      assert.equal((await sharp(arquivo).metadata()).width, 1200);
    } finally {
      fs.rmSync(arquivo, { force: true });
    }
  });

  // A galeria do site monta cada foto na proporção dela antes de ela chegar.
  it("a lista de comissoes traz largura e altura de cada foto, inclusive das antigas", async () => {
    const token = await entra();
    const auth = { authorization: `Bearer ${token}` };
    const criada = await api("POST", "/api/comissions/", {
      headers: { ...auth, "content-type": "application/json" },
      corpo: JSON.stringify({ title: "Comissao teste", description: "Descricao de teste", tags: [] }),
    });
    assert.equal(criada.status, 200, await criada.clone().text());
    const { _id } = await criada.json();

    // Foto enviada pelo painel: as medidas saem da conversao.
    const emPe = await sharp({ create: { width: 600, height: 900, channels: 3, background: "#fff2e1" } }).png().toBuffer();
    const corpo = new FormData();
    corpo.append("photo", new Blob([emPe], { type: "image/png" }), "em-pe.png");
    const r = await fetch(`${BASE}/api/comissions/addPhoto/${_id}`, { method: "PATCH", headers: auth, body: corpo });
    assert.equal(r.status, 200, await r.clone().text());

    // Foto de antes das medidas: o arquivo existe, o registro nao tem medidas.
    const antiga = "teste-antiga.webp";
    const caminho = path.join(RAIZ, "uploads", "comissions", antiga);
    fs.writeFileSync(caminho, await sharp({ create: { width: 800, height: 400, channels: 3, background: "#186a6c" } }).webp().toBuffer());
    const arquivo = await conexao.db.collection("files").insertOne({ name: antiga, size: 1, key: antiga });
    await conexao.db.collection("comissions").updateOne(
      { _id: new mongoose.Types.ObjectId(_id) },
      { $push: { photos: arquivo.insertedId } }
    );

    try {
      const { comissions } = await (await api("GET", "/api/comissions/")).json();
      const medidas = comissions.find((c) => c._id === _id).medidas.map((m) => [m.width, m.height]);
      assert.deepEqual(medidas, [[600, 900], [800, 400]]);
      const salva = await conexao.db.collection("files").findOne({ _id: arquivo.insertedId });
      assert.equal(salva.width, 800, "a medida da foto antiga fica salva");

      // O site pede versões menores (srcset); maior que o original, vem o original.
      const largura = async (id, l) =>
        (await sharp(Buffer.from(await (await fetch(`${BASE}/api/file/getComissionPhoto/${id}?largura=${l}`)).arrayBuffer())).metadata()).width;
      const [emPeId] = comissions.find((c) => c._id === _id).medidas.map((m) => m._id);
      assert.equal(await largura(emPeId, 400), 400);
      assert.equal(await largura(emPeId, 800), 600);
      assert.equal(await largura(emPeId, 123), 600, "largura fora da lista vem o original");
    } finally {
      fs.rmSync(caminho, { force: true });
      fs.rmSync(path.join(RAIZ, "uploads", "comissions", "tamanhos"), { recursive: true, force: true });
      const { photos } = await conexao.db.collection("comissions").findOne({ _id: new mongoose.Types.ObjectId(_id) });
      for (const f of await conexao.db.collection("files").find({ _id: { $in: photos } }).toArray())
        fs.rmSync(path.join(RAIZ, "uploads", "comissions", f.key), { force: true });
    }
  });

  // A primeira foto é o ícone do cartão: o painel muda a ordem sem reenviar.
  it("muda a ordem das fotos da comissao, sem perder nem ganhar foto", async () => {
    const auth = { authorization: `Bearer ${await entra()}`, "content-type": "application/json" };
    const ids = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];
    const { insertedId } = await conexao.db.collection("comissions").insertOne({ title: "Ordem", description: "Descricao", photos: ids, tags: [] });
    const ordenar = (photos) =>
      api("PATCH", `/api/comissions/ordenarFotos/${insertedId}`, { headers: auth, corpo: JSON.stringify({ photos }) });

    const nova = [ids[2], ids[0], ids[1]].map(String);
    assert.equal((await ordenar(nova)).status, 200);
    const salva = await conexao.db.collection("comissions").findOne({ _id: insertedId });
    assert.deepEqual(salva.photos.map(String), nova);

    assert.equal((await ordenar(nova.slice(1))).status, 400, "faltando foto");
    assert.equal((await ordenar([...nova, String(new mongoose.Types.ObjectId())])).status, 400, "foto a mais");
    assert.equal((await ordenar([nova[0], nova[0], nova[1]])).status, 400, "foto repetida");
    await conexao.db.collection("comissions").deleteOne({ _id: insertedId });
  });
});
