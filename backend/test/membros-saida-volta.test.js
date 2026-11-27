// Testes unitarios de sairDoPet e voltarAoPet: nao precisam de MongoDB e
// verificam que sairDoPet preserva descricao/tags, que voltarAoPet restaura
// active=true com endPet=null e que id inexistente responde 404.

const { describe, it, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");
const Member = require("../models/Member");
const MemberController = require("../controllers/MemberController");
const membersRouter = require("../routes/members");
const verifyToken = require("../utils/verifyToken");

const originalFindByIdAndUpdate = Member.findByIdAndUpdate;
const originalExists = Member.exists;
const originalSecret = process.env.TOKEN_SECRET;

function respostaFalsa() {
  const res = {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    send(payload) {
      this.body = payload;
      return this;
    },
  };
  return res;
}

afterEach(() => {
  Member.findByIdAndUpdate = originalFindByIdAndUpdate;
  Member.exists = originalExists;
  if (originalSecret === undefined) delete process.env.TOKEN_SECRET;
  else process.env.TOKEN_SECRET = originalSecret;
});

describe("MemberController: saida e volta ao PET", () => {
  it("rota PATCH /voltarAoPet/:memberId existe e passa pelo verifyToken", () => {
    const camada = membersRouter.stack.find(
      (l) => l.route && l.route.path === "/voltarAoPet/:memberId" && l.route.methods.patch
    );
    assert.ok(camada, "rota PATCH /voltarAoPet/:memberId nao registrada");
    assert.ok(camada.route.stack.length >= 2, "rota precisa do middleware verifyToken antes do controller");
  });

  it("sairDoPet marca active=false e endPet sem apagar description nem tags", async () => {
    let filtro;
    let atualizacao;
    Member.findByIdAndUpdate = async (f, u) => {
      filtro = f;
      atualizacao = u;
      return { _id: "000000000000000000000001" };
    };
    const res = respostaFalsa();
    await MemberController.sairDoPet(
      { params: { memberId: "000000000000000000000001" }, body: { endPet: "2026-11-27" } },
      res
    );
    assert.equal(res.statusCode, 200);
    assert.ok(filtro);
    assert.equal(atualizacao.active, false);
    assert.equal(atualizacao.endPet, "2026-11-27");
    assert.equal("description" in atualizacao, false, "sairDoPet nao deve apagar description");
    assert.equal("tags" in atualizacao, false, "sairDoPet nao deve apagar tags");

    Member.findByIdAndUpdate = async () => null;
    const ausente = respostaFalsa();
    await MemberController.sairDoPet(
      { params: { memberId: "000000000000000000000002" }, body: { endPet: "2026-11-27" } },
      ausente
    );
    assert.equal(ausente.statusCode, 404);
  });

  it("voltarAoPet reativa o membro (active=true, endPet=null) e devolve 404 se nao existir", async () => {
    assert.equal(typeof MemberController.voltarAoPet, "function", "voltarAoPet nao implementado");

    let atualizacao;
    Member.findByIdAndUpdate = async (_f, u) => {
      atualizacao = u;
      return { _id: "000000000000000000000001" };
    };
    const ok = respostaFalsa();
    await MemberController.voltarAoPet({ params: { memberId: "000000000000000000000001" } }, ok);
    assert.equal(ok.statusCode, 200);
    assert.deepEqual(atualizacao, { active: true, endPet: null });

    Member.findByIdAndUpdate = async () => null;
    const ausente = respostaFalsa();
    await MemberController.voltarAoPet({ params: { memberId: "000000000000000000000002" } }, ausente);
    assert.equal(ausente.statusCode, 404);
  });
});

describe("verifyToken: revoga sessao de egresso imediatamente", () => {
  it("aceita token de petiano ativo, recusa 401 para inativo e 400 para token invalido", async () => {
    process.env.TOKEN_SECRET = "segredo-unitario";
    const token = jwt.sign({ _id: "000000000000000000000001" }, process.env.TOKEN_SECRET, { expiresIn: 3600 });

    // Caso legitimo: membro ativo continua autorizado
    let filtroAtivo;
    let chamouNext = false;
    Member.exists = async (f) => {
      filtroAtivo = f;
      return { _id: "000000000000000000000001" };
    };
    const resAtivo = respostaFalsa();
    await verifyToken({ headers: { authorization: `Bearer ${token}` } }, resAtivo, () => {
      chamouNext = true;
    });
    assert.equal(chamouNext, true, "membro ativo deve passar");
    assert.deepEqual(filtroAtivo, { _id: "000000000000000000000001", active: true });

    // Caso de regressao: egresso com JWT ainda dentro de 24h nao passa
    chamouNext = false;
    Member.exists = async () => null;
    const resInativo = respostaFalsa();
    await verifyToken({ headers: { authorization: `Bearer ${token}` } }, resInativo, () => {
      chamouNext = true;
    });
    assert.equal(chamouNext, false, "egresso com JWT antigo nao pode passar");
    assert.equal(resInativo.statusCode, 401);
    assert.equal(resInativo.body, "Access Denied");

    // Token invalido segue respondendo 400 sem consultar o banco
    let consultouBanco = false;
    Member.exists = async () => {
      consultouBanco = true;
      return null;
    };
    const resRuim = respostaFalsa();
    await verifyToken({ headers: { authorization: "Bearer lixo" } }, resRuim, () => {
      chamouNext = true;
    });
    assert.equal(resRuim.statusCode, 400);
    assert.equal(consultouBanco, false);
  });
});
