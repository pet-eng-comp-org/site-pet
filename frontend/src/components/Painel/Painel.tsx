"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import isAuth from "../../services/Auth";
import { painel } from "./painelApi";
import { Acoes, Campo, ComAvisos, Janela, useEnvio, type Erros } from "./ui";
import Petianos from "./Petianos";
import Projetos from "./Projetos";
import Documentos from "./Documentos";
import Noticias from "./Noticias";
import Selecoes from "./Selecoes";
import "./Painel.css";

// O painel de quem mantém o site: o mesmo visual, a mesma grade e os mesmos
// botões das páginas públicas, e cada seção com endereço próprio.
export const secoes: [string, string, () => React.ReactNode][] = [
  ["petianos", "Petianos", Petianos],
  ["projetos", "Projetos", Projetos],
  ["documentos", "Documentos", Documentos],
  ["noticias", "Notícias", Noticias],
  ["selecoes", "Seleções", Selecoes],
];

// Cada petiano entra com o próprio e-mail; a senha inicial vem do cadastro,
// e a pessoa troca aqui.
function TrocarSenha({ aoFechar }: { aoFechar: () => void }) {
  const [f, setF] = useState({ atual: "", nova: "", repetida: "" });
  const muda = (c: keyof typeof f) => (e: ChangeEvent<HTMLInputElement>) => setF({ ...f, [c]: e.target.value });
  const { erros, enviando, aoEnviar, erroGeral } = useEnvio({
    prefixo: "senha",
    validar: () => {
      const e: Erros = {};
      if (!f.atual) e.atual = "Escreva a senha de agora.";
      if (f.nova.length < 6) e.nova = "A senha nova precisa de pelo menos 6 caracteres.";
      else if (f.repetida !== f.nova) e.repetida = "As duas senhas novas não são iguais.";
      return e;
    },
    sucesso: "Senha trocada.",
    aoTerminar: aoFechar,
    enviar: async () => {
      const { data } = await painel.patch<{ token?: string }>(`api/login/changePassword/${isAuth()?._id}`, {
        oldPassword: f.atual,
        newPassword: f.nova,
      });
      if (data?.token) localStorage.setItem("LOGINPET_TOKEN", data.token);
    },
  });
  return (
    <Janela titulo="Trocar minha senha" aberta aoFechar={aoFechar}>
      <form onSubmit={aoEnviar} noValidate className="painel-form">
        <Campo id="senha-atual" rotulo="Senha de agora" erro={erros.atual}>
          <input type="password" autoComplete="current-password" value={f.atual} onChange={muda("atual")} />
        </Campo>
        <Campo id="senha-nova" rotulo="Senha nova" dica="Ao menos 6 caracteres." erro={erros.nova}>
          <input type="password" autoComplete="new-password" value={f.nova} onChange={muda("nova")} />
        </Campo>
        <Campo id="senha-repetida" rotulo="Senha nova, de novo" erro={erros.repetida}>
          <input type="password" autoComplete="new-password" value={f.repetida} onChange={muda("repetida")} />
        </Campo>
        <Acoes erro={erroGeral} enviando={enviando} rotulo="Trocar senha" />
      </form>
    </Janela>
  );
}

const Painel = () => {
  const [senha, setSenha] = useState(false);
  const router = useRouter();
  const { secao } = useParams<{ secao?: string[] }>();
  const atual = secoes.find(([caminho]) => caminho === secao?.[0]);
  // Só quem entrou; sem sessão, o login. O HTML vem vazio do servidor, que
  // não sabe quem entrou.
  const [logado, setLogado] = useState(false);
  useEffect(() => {
    if (!isAuth()) router.replace("/login");
    else if (!atual || secao?.length !== 1) router.replace("/admin/petianos");
    else setLogado(true);
  }, [router, atual, secao]);
  const sair = () => {
    localStorage.removeItem("LOGINPET_TOKEN");
    router.push("/");
  };
  if (!logado || !atual) return null;
  const [, , Secao] = atual;
  return (
    <ComAvisos>
      <div className="pagina painel">
        <div className="painel-cabecalho">
          <h1>Painel</h1>
          {/* O que é da conta fica junto, aqui, e não no menu do site. */}
          <div className="painel-conta">
            <button type="button" className="botao-link" onClick={() => setSenha(true)}>
              Trocar minha senha
            </button>
            <button type="button" className="botao-link" onClick={sair}>
              Sair
            </button>
          </div>
        </div>
        {senha && <TrocarSenha aoFechar={() => setSenha(false)} />}
        <nav aria-label="Seções do painel">
          <ul className="painel-secoes">
            {secoes.map(([caminho, nome]) => (
              <li key={caminho}>
                <Link
                  href={`/admin/${caminho}`}
                  className={caminho === atual?.[0] ? "ativa" : undefined}
                  aria-current={caminho === atual?.[0] ? "page" : undefined}
                >
                  {nome}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Secao />
      </div>
    </ComAvisos>
  );
};

export default Painel;
