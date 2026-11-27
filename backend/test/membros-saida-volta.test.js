// Testes unitarios de sairDoPet e voltarAoPet: nao precisam de MongoDB e
// verificam que sairDoPet preserva descricao/tags, que voltarAoPet restaura
// active=true com endPet=null e que id inexistente responde 404.

const { describe, it, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const Member = require("../models/Member");
const MemberController = require("../controllers/MemberController");
const membersRouter = require("../routes/members");

const originalFindByIdAndUpdate = Member.findByIdAndUpdate;

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
