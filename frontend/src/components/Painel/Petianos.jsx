import React, { useEffect, useState } from "react";
import useTitulo from "../../utils/useTitulo";
import slug from "../../utils/slug";
import Icone from "../Icone/Icone";
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
} from "./ui";

const REDES = [
  ["instagram", "Instagram"],
  ["linkedin", "LinkedIn"],
  ["youtube", "YouTube"],
  ["twitter", "X (Twitter)"],
  ["twitch", "Twitch"],
  ["facebook", "Facebook"],
];

// "Game Jam" e "PET Game Jam" são o mesmo projeto (como em Quem somos).
const chave = (t) => slug(t).replace(/pet/g, "").replace(/-/g, "").replace(/s$/, "");

const soDigitos = (t) => t.replace(/\D/g, "");
// 27999998888 -> (27) 99999-8888
const formatarTelefone = (t) => {
  const d = soDigitos(t);
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return t;
};

// "@usuario" vira o link do perfil; link sem protocolo ganha https://.
const PERFIS = {
  instagram: "https://instagram.com/",
  linkedin: "https://linkedin.com/in/",
  youtube: "https://youtube.com/@",
  twitter: "https://x.com/",
  twitch: "https://twitch.tv/",
  facebook: "https://facebook.com/",
};
const linkDaRede = ({ name, link }) => {
  const t = link.trim();
  if (/^@\w[\w.-]*$/.test(t)) return PERFIS[name] + t.slice(1);
  if (/^https?:\/\//.test(t)) return t;
  return t && !/\s/.test(t) && t.includes(".") ? `https://${t}` : t;
};

const fotoDe = (p) => p.profilePhoto && `${API}api/file/getProfilePhoto/${p.profilePhoto._id}`;

const ordenar = (lista) =>
  [...lista].sort(
    (a, b) => (b.tutor ? 1 : 0) - (a.tutor ? 1 : 0) || new Date(b.startPet) - new Date(a.startPet)
  );

function Petianos() {
  useTitulo("Petianos · Painel");
  const membros = useLista("api/members/all", (d) => d.members);
  const projetos = useLista("api/comissions", (d) => d.comissions);
  const [aberto, setAberto] = useState(null); // { tipo, petiano }
  const fechar = () => setAberto(null);
  const avisar = useAvisar();

  return (
    <section aria-labelledby="titulo-secao">
      <div className="painel-cabecalho">
        <h2 id="titulo-secao">Petianos</h2>
        <button type="button" className="botao-principal" onClick={() => setAberto({ tipo: "novo" })}>
          Cadastrar petiano
        </button>
      </div>

      <Carregando estado={membros}>
        {(lista) => {
          const atuais = ordenar(lista.filter((p) => p.active));
          const egressos = ordenar(lista.filter((p) => !p.active));
          const linha = (p) => (
            <li key={p._id} className="painel-item">
              {fotoDe(p) ? (
                <img className="painel-foto" src={fotoDe(p)} alt="" width="56" height="56" loading="lazy" />
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
              <h3 className="painel-subtitulo">Atuais ({atuais.length})</h3>
              <ul className="painel-lista">{atuais.map(linha)}</ul>
              <details className="painel-egressos">
                <summary>Egressos ({egressos.length})</summary>
                <ul className="painel-lista">{egressos.map(linha)}</ul>
              </details>
            </>
          );
        }}
      </Carregando>

      {(aberto?.tipo === "novo" || aberto?.tipo === "editar") && (
        <FormPetiano
          petiano={aberto.petiano}
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

function FormPetiano({ petiano, projetos, aoFechar, aoSalvar }) {
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
  const ativo = novo || petiano.active;
  const [foto, setFoto] = useState(null);
  const [previa, setPrevia] = useState(petiano && fotoDe(petiano));
  useEffect(() => () => foto && URL.revokeObjectURL(previa), [foto, previa]);
  const muda = (campo) => (e) =>
    setF({ ...f, [campo]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const avisar = useAvisar();

  const validar = () => {
    const e = {};
    if (f.memberName.trim().length < 2) e.memberName = "Escreva o nome completo.";
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = "Escreva um e-mail válido.";
    if (![10, 11].includes(soDigitos(f.phone).length)) e.phone = "Escreva o telefone com DDD, só números ou como (27) 99999-8888.";
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
    if (novo && !foto) e.foto = "Escolha uma foto: ela aparece em Quem somos.";
    return e;
  };

  const { erros, enviando, aoEnviar } = useEnvio({
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
        phone: formatarTelefone(f.phone),
        startPet: f.startPet,
        tutor: f.tutor,
        description: f.description.trim(),
        tags: [...f.projetos.map((title) => ({ title })), ...semCaixa.map(({ title }) => ({ title }))],
        socialMidia: f.redes.map((r) => ({ name: r.name, link: linkDaRede(r) })),
      };
      let id = petiano?._id;
      if (novo) id = (await painel.post("api/members", { ...corpo, password: f.password, active: true })).data;
      else await painel.put(`api/members/${id}`, corpo);
      if (foto) {
        const dados = new FormData();
        dados.append("profilePhoto", foto);
        try {
          await painel.patch(`api/members/${novo ? "firstProfilePhoto" : "updateProfilePhoto"}/${id}`, dados);
        } catch (err) {
          // O cadastro ficou; só a foto não foi.
          avisar("O petiano foi salvo, mas a foto não foi enviada. Abra “Editar” e envie de novo.", "erro");
        }
      }
    },
  });

  const id = (c) => `petiano-${c}`;
  return (
    <Janela titulo={novo ? "Cadastrar petiano" : `Editar ${petiano.memberName}`} aberta aoFechar={aoFechar} larga>
      <form onSubmit={aoEnviar} noValidate className="painel-form">
        <div className="painel-form-foto">
          {previa ? <img src={previa} alt="" width="96" height="96" /> : <span className="painel-foto-vazia" aria-hidden="true" />}
          <Campo id={id("foto")} rotulo={novo ? "Foto" : "Trocar a foto"} dica="Rosto bem visível; ela aparece redonda, com 140 px." erro={erros.foto}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const arq = e.target.files[0];
                setFoto(arq || null);
                setPrevia(arq ? URL.createObjectURL(arq) : petiano && fotoDe(petiano));
              }}
            />
          </Campo>
        </div>
        <Campo id={id("memberName")} rotulo="Nome" erro={erros.memberName}>
          <input value={f.memberName} onChange={muda("memberName")} autoComplete="off" data-foco-inicial />
        </Campo>
        <div className="painel-form-dupla">
          <Campo id={id("email")} rotulo="E-mail" dica="Também é o login no painel." erro={erros.email}>
            <input type="email" value={f.email} onChange={muda("email")} autoComplete="off" />
          </Campo>
          <Campo id={id("phone")} rotulo="Telefone" erro={erros.phone}>
            <input type="tel" inputMode="tel" value={f.phone} onChange={muda("phone")} autoComplete="off" />
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
          <textarea rows="3" maxLength="160" value={f.description} onChange={muda("description")} />
        </Campo>

        <fieldset className="painel-grupo">
          <legend>Projetos de que participa</legend>
          {!projetos.length && (
            <p className="campo-dica">
              A lista de projetos não carregou; os projetos de hoje ficam como estão.
            </p>
          )}
          <div className="painel-caixas">
            {projetos.map((c) => (
              <label key={c._id} className="painel-caixa">
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

        <Acoes enviando={enviando} rotulo={novo ? "Cadastrar petiano" : "Salvar alterações"} aoCancelar={aoFechar} />
      </form>
    </Janela>
  );
}

function Saida({ petiano, aoFechar, aoSalvar }) {
  const hoje = new Date().toISOString().slice(0, 10);
  const [data, setData] = useState(hoje);
  const { erros, enviando, aoEnviar } = useEnvio({
    prefixo: "saida",
    validar: () => (data ? {} : { data: "Escolha a data de saída." }),
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
        <Acoes enviando={enviando} rotulo="Registrar saída" aoCancelar={aoFechar} />
      </form>
    </Janela>
  );
}

export default Petianos;
