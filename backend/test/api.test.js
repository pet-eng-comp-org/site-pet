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
    ["DELETE", `/api/comissions/${ID}`],
    ["POST", "/api/documents/"],
    ["PATCH", `/api/documents/addFile/${ID}`],
    ["PATCH", `/api/documents/removeFile/${ID}`],
    ["PUT", `/api/documents/${ID}`],
    ["DELETE", `/api/documents/${ID}`],
    ["GET", `/api/file/downloadInscription/${ID}`],
    ["DELETE", `/api/file/${ID}`],
    ["GET", "/api/inscriptions/"],
    ["GET", `/api/inscriptions/${ID}`],
    ["DELETE", `/api/inscriptions/${ID}`],
    ["PATCH", `/api/inscriptions/acceptInscription/${ID}`],
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
    ["PATCH", `/api/selection/removeInscription/${ID}`],
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
});
