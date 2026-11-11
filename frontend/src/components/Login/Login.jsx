import React, { useEffect, useState } from "react";
import "./Login.css";
import { Navigate, useNavigate } from "react-router-dom";
import isAuth from "../../services/Auth";
import api from "../../services/api";
import useTitulo from "../../utils/useTitulo";

const Login = () => {
  useTitulo("Entrar no painel");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

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
      navigate("/admin");
    } catch (err) {
      setErrorMessage(
        err?.response && err.response.status < 500
          ? "E-mail ou senha incorretos."
          : "Não foi possível entrar agora. Tente de novo em alguns minutos."
      );
    }
  }

  // Quem já entrou e abre o login vai direto ao painel.
  if (isAuth()) return <Navigate to="/admin" replace />;

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
        <div className="campo">
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
        <div className="campo">
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
        <button type="submit" className="botao-principal">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
