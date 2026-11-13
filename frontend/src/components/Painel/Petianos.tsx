"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import slug from "../../utils/slug";
import linkDaRede from "../../utils/redes";
import { fotoEhDupla, montarFoto, type Parte } from "../../utils/fotoDupla";
import { digitarCelular, formatarCelular } from "../../utils/celular";
import { painel } from "./painelApi";
import {
  API,
  Acoes,
  Campo,
  Carregando,
  Confirmar,
  Janela,
  dataPorExtenso,
  paraCampoData,
  useAvisar,
  useEnvio,
  useLista,
  type Erros,
} from "./ui";
import type { Comissao, Membro } from "../../tipos";

// No painel, o cadastro vem com o e-mail e o celular, que o site não mostra.
type Petiano = Membro & { email?: string; phone?: string };

type Aberto = { tipo: "novo" } | { tipo: "editar" | "saida" | "excluir"; petiano: Petiano } | null;

const REDES: [string, string][] = [
  ["instagram", "Instagram"],
  ["linkedin", "LinkedIn"],
  ["youtube", "YouTube"],
  ["twitter", "X (Twitter)"],
  ["twitch", "Twitch"],
  ["facebook", "Facebook"],
];

// "Game Jam" e "PET Game Jam" são o mesmo projeto (como em Quem somos).
const chave = (t: string) => slug(t).replace(/pet/g, "").replace(/-/g, "").replace(/s$/, "");

const soDigitos = (t: string) => t.replace(/\D/g, "");

// A troca de foto mantém o _id do arquivo e muda a key: com ela no endereço, o
// navegador não reaproveita a imagem antiga.
const fotoDe = (p: Petiano) =>
  p.profilePhoto && `${API}api/file/getProfilePhoto/${p.profilePhoto._id}?v=${p.profilePhoto.key}`;

// Endereço para mostrar o arquivo escolhido, liberado quando ele muda.
const useObjectUrl = (arquivo: File | null) => {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!arquivo) {
      setUrl(null);
      return;
    }
    const u = URL.createObjectURL(arquivo);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [arquivo]);
  return url;
};

const ordenar = (lista: Petiano[]) =>
  [...lista].sort(
    (a, b) => (b.tutor ? 1 : 0) - (a.tutor ? 1 : 0) || Date.parse(b.startPet) - Date.parse(a.startPet)
  );

function Petianos() {
  const membros = useLista("api/members/all", (d: { members: Petiano[] }) => d.members);
  const projetos = useLista("api/comissions", (d: { comissions: Comissao[] }) => d.comissions);
  const [aberto, setAberto] = useState<Aberto>(null);
  const fechar = () => setAberto(null);
  const avisar = useAvisar();

  return (
    <section aria-labelledby="titulo-secao">
      <div className="painel-cabecalho">
        <h2 id="titulo-secao" tabIndex={-1}>Petianos</h2>
        <button type="button" className="botao-principal" onClick={() => setAberto({ tipo: "novo" })}>
          Cadastrar petiano
        </button>
      </div>

      <Carregando estado={membros}>
        {(lista) => {
          const atuais = ordenar(lista.filter((p) => p.active));
          const egressos = ordenar(lista.filter((p) => !p.active));
          const linha = (p: Petiano) => (
            <li key={p._id} className="painel-item">
              {fotoDe(p) ? (
                <img className="painel-foto" src={fotoDe(p) || undefined} alt="" width="56" height="56" loading="lazy" />
              ) : (
                <span className="painel-foto painel-foto-vazia" aria-hidden="true" />
              )}
              <div className="painel-item-texto">
                <strong>{p.memberName}</strong>
                <span>
                  {p.tutor ? "Tutor" : "No PET"} desde{" "}
                  {new Date(p.startPet).toLocaleDateString("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" })}
                  {!p.active && p.endPet && ` · saiu em ${dataPorExtenso(p.endPet)}`}
                </span>
              </div>
              <div className="painel-item-acoes">
                <button type="button" className="botao-secundario" onClick={() => setAberto({ tipo: "editar", petiano: p })}>
                  Editar<span className="sr-only"> {p.memberName}</span>
                </button>
                {p.active && (
                  <button type="button" className="botao-secundario" onClick={() => setAberto({ tipo: "saida", petiano: p })}>
                    Registrar saída<span className="sr-only"> de {p.memberName}</span>
                  </button>
                )}
                <button type="button" className="botao-texto-perigo" onClick={() => setAberto({ tipo: "excluir", petiano: p })}>
                  Excluir<span className="sr-only"> {p.memberName}</span>
                </button>
              </div>
            </li>
          );
          return (
            <>
              <h3 className="mt-6 mb-3 text-21 font-semibold">Atuais ({atuais.length})</h3>
              <ul className="painel-lista">{atuais.map(linha)}</ul>
              <details className="group mt-8">
                {/* A seta gira ao abrir: diz que a lista abre. */}
                <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-2 text-21 font-semibold before:size-[0.55rem] before:-rotate-45 before:border-r-2 before:border-b-2 before:border-current before:transition-transform before:duration-150 group-open:before:rotate-45 [&::-webkit-details-marker]:hidden">Egressos ({egressos.length})</summary>
                <ul className="painel-lista">{egressos.map(linha)}</ul>
              </details>
            </>
          );
        }}
      </Carregando>

      {/* O formulário só monta com a lista de projetos resolvida: as caixas
          marcadas saem dela, e montado antes elas ficavam vazias e salvar
          apagava os projetos da pessoa. */}
      {(aberto?.tipo === "novo" || aberto?.tipo === "editar") && projetos.carregando && (
        <Janela titulo={aberto.tipo === "editar" ? `Editar ${aberto.petiano.memberName}` : "Cadastrar petiano"} aberta aoFechar={fechar}>
          <p role="status">Carregando os projetos…</p>
        </Janela>
      )}
      {(aberto?.tipo === "novo" || aberto?.tipo === "editar") && !projetos.carregando && (
        <FormPetiano
          petiano={aberto.tipo === "editar" ? aberto.petiano : undefined}
          projetos={projetos.dados || []}
          aoFechar={fechar}
          aoSalvar={membros.recarregar}
        />
      )}
      {aberto?.tipo === "saida" && (
        <Saida petiano={aberto.petiano} aoFechar={fechar} aoSalvar={membros.recarregar} />
      )}
      {aberto?.tipo === "excluir" && (
        <Confirmar
          titulo={`Excluir ${aberto.petiano.memberName}?`}
          texto="O cadastro e a foto são apagados de vez. Para quem só deixou o grupo, use “Registrar saída”: o nome continua na lista de egressos."
          acao="Excluir petiano"
          aoFechar={fechar}
          aoConfirmar={async () => {
            await painel.delete(`api/members/${aberto.petiano._id}`);
            avisar(`O cadastro de ${aberto.petiano.memberName} foi excluído.`);
            membros.recarregar();
          }}
        />
      )}
    </section>
  );
}

interface PropsForm {
  petiano?: Petiano;
  projetos: Comissao[];
  aoFechar: () => void;
  aoSalvar: () => void;
}

function FormPetiano({ petiano, projetos, aoFechar, aoSalvar }: PropsForm) {
  const novo = !petiano;
  const [f, setF] = useState(() => ({
    memberName: petiano?.memberName || "",
    email: petiano?.email || "",
    phone: petiano?.phone || "",
    password: "",
    startPet: paraCampoData(petiano?.startPet),
    tutor: Boolean(petiano?.tutor),
    description: petiano?.description || "",
    projetos: projetos
      .filter((c) => petiano?.tags?.some((t) => chave(t.title) === chave(c.title)))
      .map((c) => c.title),
    redes: (petiano?.socialMidia || []).map(({ name, link }) => ({ name, link })),
  }));
  // Etiquetas que não correspondem a nenhum projeto da lista (ou todas, se a
  // lista não carregou) são mantidas como estão: salvar não apaga o que a
  // tela não mostra.
  const semCaixa = (petiano?.tags || []).filter(
    (t) => !projetos.some((c) => chave(c.title) === chave(t.title))
  );
  const ativo = !petiano || petiano.active;
  // A foto é dupla quando tem a descontraída embaixo (utils/fotoDupla): o
  // painel recebe as duas em separado e monta o arquivo único na hora de salvar.
  const atual = (petiano && fotoDe(petiano)) || undefined;
  const [atualDupla, setAtualDupla] = useState(false);
  useEffect(() => {
    if (atual) fotoEhDupla(atual).then(setAtualDupla, () => {});
  }, [atual]);
  const [foto, setFoto] = useState<File | null>(null);
  const [descontraida, setDescontraida] = useState<File | null>(null);
  const [semDescontraida, setSemDescontraida] = useState(false);
  // Muda ao tirar a foto descontraída: recria o campo de arquivo, que senão
  // guardaria o arquivo e não avisaria se o mesmo fosse escolhido de novo.
  const [campoDescontraida, setCampoDescontraida] = useState(0);
  const previaFoto = useObjectUrl(foto);
  const previaDescontraida = useObjectUrl(descontraida);
  const temDescontraida = descontraida || (atualDupla && !semDescontraida);
  const muda = (campo: keyof typeof f) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF({ ...f, [campo]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value });
  const avisar = useAvisar();

  const validar = () => {
    const e: Erros = {};
    if (f.memberName.trim().length < 2) e.memberName = "Escreva o nome completo.";
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = "Escreva um e-mail válido.";
    // Celular: o contato é pelo WhatsApp, então o fixo não serve.
    if (!/^\d\d9\d{8}$/.test(soDigitos(f.phone))) e.phone = "Escreva o celular com DDD, 11 números, como (27) 99999-8888.";
    if (novo && f.password.length < 6) e.password = "A senha precisa de pelo menos 6 caracteres.";
    if (!f.startPet) e.startPet = "Escolha a data de entrada.";
    // A descrição aparece em Quem somos: obrigatória para quem está no PET.
    const desc = f.description.trim().length;
    if (desc > 160 || (ativo && desc < 6)) e.description = "Escreva de 6 a 160 caracteres.";
    f.redes.forEach((r, i) => {
      if (!e.redes && !/^https?:\/\/\S+\.\S+$/.test(linkDaRede(r))) {
        // A chave do campo vem antes: é nela que o foco cai.
        e[`link-${i}`] = "Cole o link do perfil (https://…) ou o @usuário.";
        e.redes = e[`link-${i}`];
      }
    });
    if (!foto && !atual && (novo || descontraida)) e.foto = "Escolha uma foto: ela aparece em Quem somos.";
    return e;
  };

  const { erros, enviando, aoEnviar, erroGeral } = useEnvio({
    prefixo: "petiano",
    validar,
    sucesso: novo ? `Cadastro de ${f.memberName.trim()} criado.` : "Alterações salvas.",
    aoTerminar: () => {
      aoSalvar();
      aoFechar();
    },
    enviar: async () => {
      const corpo = {
        memberName: f.memberName.trim(),
        email: f.email.trim(),
        phone: formatarCelular(f.phone),
        startPet: f.startPet,
        tutor: f.tutor,
        description: f.description.trim(),
        tags: [...f.projetos.map((title) => ({ title })), ...semCaixa.map(({ title }) => ({ title }))],
        socialMidia: f.redes.map((r) => ({ name: r.name, link: linkDaRede(r) })),
      };
      let id = petiano?._id;
      if (novo) id = (await painel.post<string>("api/members", { ...corpo, password: f.password, active: true })).data;
      else await painel.put(`api/members/${id}`, corpo);
      if ((foto || descontraida || semDescontraida) && (foto || atual)) {
        // A parte que não mudou sai da foto atual, medida de novo aqui: a
        // medição da tela pode não ter terminado, e errar apagaria a descontraída.
        const dados = new FormData();
        try {
          const dupla = atual ? await fotoEhDupla(atual) : false;
          dados.append(
            "profilePhoto",
            await montarFoto(
              foto || { url: atual!, metade: dupla ? "cima" : undefined },
              descontraida || (dupla && !semDescontraida ? ({ url: atual!, metade: "baixo" } as Parte) : null)
            )
          );
          await painel.patch(`api/members/${atual ? "updateProfilePhoto" : "firstProfilePhoto"}/${id}`, dados);
        } catch {
          // O cadastro ficou; só a foto não foi.
          avisar("O petiano foi salvo, mas a foto não foi enviada. Abra “Editar” e envie de novo.", "erro");
        }
      }
    },
  });

  const id = (c: string) => `petiano-${c}`;
  return (
    <Janela titulo={petiano ? `Editar ${petiano.memberName}` : "Cadastrar petiano"} aberta aoFechar={aoFechar} larga>
      <form onSubmit={aoEnviar} noValidate className="painel-form">
        {/* Foto e foto descontraída, uma embaixo da outra. */}
        <div className="mb-5 grid gap-4">
          <div className="painel-form-foto">
            {previaFoto || atual ? (
              <img src={previaFoto || atual || undefined} alt="" width="96" height="96" />
            ) : (
              <span className="painel-foto-vazia" aria-hidden="true" />
            )}
            <Campo id={id("foto")} rotulo={atual ? "Trocar a foto" : "Foto"} dica="Rosto bem visível; ela aparece redonda." erro={erros.foto}>
              <input type="file" accept="image/*" onChange={(e) => setFoto(e.target.files?.[0] || null)} />
            </Campo>
          </div>
          <div className="painel-form-foto">
            {temDescontraida ? (
              <img src={previaDescontraida || atual || undefined} alt="" width="96" height="96" style={descontraida ? undefined : { objectPosition: "bottom" }} />
            ) : (
              <span className="painel-foto-vazia" aria-hidden="true" />
            )}
            <div className="flex-1">
              <Campo id={id("descontraida")} rotulo="Foto descontraída" dica="Opcional. Aparece quando passam o mouse ou tocam na foto.">
                <input
                  key={campoDescontraida}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setDescontraida(e.target.files?.[0] || null);
                    setSemDescontraida(false);
                  }}
                />
              </Campo>
              {temDescontraida && (
                <button
                  type="button"
                  className="botao-texto-perigo mt-1 pl-0"
                  onClick={() => {
                    setDescontraida(null);
                    setSemDescontraida(true);
                    setCampoDescontraida(campoDescontraida + 1);
                  }}
                >
                  Tirar esta foto
                </button>
              )}
            </div>
          </div>
        </div>
        <Campo id={id("memberName")} rotulo="Nome" erro={erros.memberName}>
          <input value={f.memberName} onChange={muda("memberName")} autoComplete="off" data-foco-inicial />
        </Campo>
        <div className="painel-form-dupla">
          <Campo id={id("email")} rotulo="E-mail" dica="Também é o login no painel." erro={erros.email}>
            <input type="email" value={f.email} onChange={muda("email")} autoComplete="off" />
          </Campo>
          <Campo id={id("phone")} rotulo="Celular" erro={erros.phone}>
            <input
              type="tel"
              inputMode="tel"
              value={f.phone}
              onChange={(e) => digitarCelular(e, f.phone, (phone) => setF({ ...f, phone }))}
              placeholder="(27) 99999-8888"
              autoComplete="off"
            />
          </Campo>
        </div>
        {novo && (
          <Campo id={id("password")} rotulo="Senha inicial" dica="Ao menos 6 caracteres. A pessoa troca depois, em “Trocar minha senha”, no painel." erro={erros.password}>
            <input type="text" value={f.password} onChange={muda("password")} autoComplete="new-password" />
          </Campo>
        )}
        <div className="painel-form-dupla">
          <Campo id={id("startPet")} rotulo="Entrada no PET" erro={erros.startPet}>
            <input type="date" value={f.startPet} onChange={muda("startPet")} />
          </Campo>
          <label className="painel-caixa">
            <input type="checkbox" checked={f.tutor} onChange={muda("tutor")} /> É o professor tutor
          </label>
        </div>
        <Campo
          id={id("description")}
          rotulo="Descrição"
          dica={`${ativo ? "Uma ou duas frases sobre a pessoa, em terceira pessoa; aparece em Quem somos." : "Opcional para egressos: não aparece no site."} ${160 - f.description.length} caracteres restantes.`}
          erro={erros.description}
        >
          <textarea rows={3} maxLength={160} value={f.description} onChange={muda("description")} />
        </Campo>

        <fieldset className="painel-grupo">
          <legend>Projetos de que participa</legend>
          {!projetos.length && (
            <p className="campo-dica">
              A lista de projetos não carregou; os projetos de hoje ficam como estão.
            </p>
          )}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))]">
            {projetos.map((c) => (
              <label key={c._id} className="painel-caixa m-0">
                <input
                  type="checkbox"
                  checked={f.projetos.includes(c.title)}
                  onChange={(e) =>
                    setF({
                      ...f,
                      projetos: e.target.checked ? [...f.projetos, c.title] : f.projetos.filter((t) => t !== c.title),
                    })
                  }
                />{" "}
                {c.title}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="painel-grupo" aria-describedby={erros.redes ? id("redes-erro") : undefined}>
          <legend>Redes (até 3)</legend>
          <p className="campo-dica">O link do perfil ou só o @usuário.</p>
          {f.redes.map((r, i) => (
            <div key={i} className="painel-linha-rede">
              <label className="sr-only" htmlFor={id(`rede-${i}`)}>Rede {i + 1}</label>
              <select
                id={id(`rede-${i}`)}
                className="form-control"
                value={r.name}
                onChange={(e) => setF({ ...f, redes: f.redes.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)) })}
              >
                {REDES.map(([v, n]) => (
                  <option key={v} value={v}>{n}</option>
                ))}
              </select>
              <label className="sr-only" htmlFor={id(`link-${i}`)}>Link ou @usuário da rede {i + 1}</label>
              <input
                id={id(`link-${i}`)}
                className="form-control"
                aria-invalid={erros[`link-${i}`] ? "true" : undefined}
                placeholder="https:// ou @usuário"
                value={r.link}
                onChange={(e) => setF({ ...f, redes: f.redes.map((x, j) => (j === i ? { ...x, link: e.target.value } : x)) })}
              />
              <button type="button" className="botao-texto-perigo" onClick={() => setF({ ...f, redes: f.redes.filter((_, j) => j !== i) })}>
                Tirar<span className="sr-only"> a rede {i + 1}</span>
              </button>
            </div>
          ))}
          {erros.redes && <p className="campo-erro" id={id("redes-erro")}>{erros.redes}</p>}
          {f.redes.length < 3 && (
            <button type="button" className="botao-secundario" onClick={() => setF({ ...f, redes: [...f.redes, { name: "instagram", link: "" }] })}>
              Adicionar rede
            </button>
          )}
        </fieldset>

        <Acoes erro={erroGeral} enviando={enviando} rotulo={novo ? "Cadastrar petiano" : "Salvar alterações"} />
      </form>
    </Janela>
  );
}

function Saida({ petiano, aoFechar, aoSalvar }: { petiano: Petiano; aoFechar: () => void; aoSalvar: () => void }) {
  const hoje = new Date().toISOString().slice(0, 10);
  const [data, setData] = useState(hoje);
  const { erros, enviando, aoEnviar, erroGeral } = useEnvio({
    prefixo: "saida",
    validar: () => {
      const e: Erros = {};
      if (!data) e.data = "Escolha a data de saída.";
      return e;
    },
    sucesso: `${petiano.memberName} passou para os egressos.`,
    aoTerminar: () => {
      aoSalvar();
      aoFechar();
    },
    enviar: () => painel.patch(`api/members/sairDoPet/${petiano._id}`, { endPet: data }),
  });
  return (
    <Janela titulo={`Registrar a saída de ${petiano.memberName}`} aberta aoFechar={aoFechar}>
      <form onSubmit={aoEnviar} noValidate className="painel-form">
        <p>A pessoa sai de Quem somos e passa para a lista de egressos do painel. O cadastro continua.</p>
        <Campo id="saida-data" rotulo="Data de saída" erro={erros.data}>
          <input type="date" value={data} max={hoje} onChange={(e) => setData(e.target.value)} />
        </Campo>
        <Acoes erro={erroGeral} enviando={enviando} rotulo="Registrar saída" />
      </form>
    </Janela>
  );
}

export default Petianos;
