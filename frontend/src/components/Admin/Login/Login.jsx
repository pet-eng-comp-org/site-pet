import React, { useEffect, useState } from "react";
import "./Login.css";
import { useHistory } from "react-router-dom";
import api from "../../../services/api";
import useTitulo from "../../../utils/useTitulo";

const Login = () => {
  useTitulo("Entrar no painel");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  let history = useHistory();

  // O painel manda para cá quando o token vence (services/api.js).
  useEffect(() => {
    if (!sessionStorage.getItem("sessaoExpirou")) return;
    sessionStorage.removeItem("sessaoExpirou");
    setErrorMessage("Sua sessão expirou. Entre de novo.");
  }, []);

  async function handleLogin(e) {
    e.preventDefault();

    let responseLogin;

    try {
      setErrorMessage("");
      responseLogin = await api.get("api/login/", {
        auth: {
          username: email,
          password: password,
        },
      });
      localStorage.setItem("LOGINPET_TOKEN", responseLogin.data.token);
      history.push("/admin");
    } catch (err) {
      setErrorMessage(
        err?.response && err.response.status < 500
          ? "E-mail ou senha incorretos."
          : "Não foi possível entrar agora. Tente de novo em alguns minutos."
      );
    }
  }

  const invalido = errorMessage ? "is-invalid" : "";

  return (
    <div className="pagina">
      <form className="cartao-login" onSubmit={handleLogin}>
        <h1>Entrar no painel</h1>
        {errorMessage && (
          <p className="alerta-erro" role="alert">
            {errorMessage}
          </p>
        )}
        <label htmlFor="email">E-mail</label>
        <input
          type="email"
          id="email"
          autoComplete="username"
          required
          className={`form-control ${invalido}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Senha</label>
        <input
          type="password"
          id="password"
          autoComplete="current-password"
          required
          className={`form-control ${invalido}`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="botao-principal">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
