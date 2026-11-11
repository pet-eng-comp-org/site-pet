"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import isAuth from "../../services/Auth";
import api from "../../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  // Quem já entrou e abre o login vai direto ao painel.
  useEffect(() => {
    if (isAuth()) router.replace("/admin");
  }, [router]);

  // O painel manda para cá quando o token vence (services/api.js).
  useEffect(() => {
    if (!sessionStorage.getItem("sessaoExpirou")) return;
    sessionStorage.removeItem("sessaoExpirou");
    setErrorMessage("Sua sessão expirou. Entre de novo.");
  }, []);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setErrorMessage("");
      const responseLogin = await api.get<{ token: string }>("api/login/", {
        auth: {
          username: email,
          password: password,
        },
      });
      localStorage.setItem("LOGINPET_TOKEN", responseLogin.data.token);
      router.push("/admin");
    } catch (err) {
      const resposta = (err as { response?: { status: number } }).response;
      setErrorMessage(
        resposta && resposta.status < 500
          ? "E-mail ou senha incorretos."
          : "Não foi possível entrar agora. Tente de novo em alguns minutos."
      );
    }
  }

  const invalido = errorMessage ? "is-invalid" : "";

  return (
    <div className="pagina">
      {/* O mesmo cartão do formulário de contato, numa coluna só: entrar é uma tarefa só. */}
      <form className="mx-auto max-w-[26rem] rounded-cartao bg-superficie p-8" onSubmit={handleLogin}>
        <h1 className="mb-6 text-[2rem]">Entrar no painel</h1>
        {errorMessage && (
          <p className="alerta-erro" role="alert">
            {errorMessage}
          </p>
        )}
        <div className="campo mb-[14px]">
          <input
            type="email"
            id="email"
            autoComplete="username"
            required
            placeholder=" "
            className={`form-control ${invalido}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="email">E-mail</label>
        </div>
        <div className="campo mb-[14px]">
          <input
            type="password"
            id="password"
            autoComplete="current-password"
            required
            placeholder=" "
            className={`form-control ${invalido}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="password">Senha</label>
        </div>
        <button type="submit" className="botao-principal w-full cursor-pointer justify-center border-0">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
