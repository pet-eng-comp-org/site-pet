import React, { useState } from "react";
import { MDBContainer, MDBAlert, MDBRow, MDBCol, MDBBtn } from "mdbreact";
import { DivLogin } from "./style.js";
import { useHistory } from "react-router-dom";
import api from "../../../services/api";
import useTitulo from "../../../utils/useTitulo";

const Login = () => {
  useTitulo("Entrar no painel");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validLogin, setValidLogin] = useState("");
  const [messageSend, setMessageSend] = useState(false);
  const [errorSendMessage, setErrorSendMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  let history = useHistory();

  async function handleLogin(e) {
    e.preventDefault();

    let responseLogin;

    try {
      setErrorSendMessage(false);
      setMessageSend(false);
      responseLogin = await api.get("api/login/", {
        auth: {
          username: email,
          password: password,
        },
      });
      setValidLogin("");
      localStorage.setItem("LOGINPET_TOKEN", responseLogin.data.token);
      setMessageSend(true);
      setEmail("");
      setPassword("");
      history.push("/admin");
    } catch (err) {
      setErrorSendMessage(true);
      setErrorMessage(
        err?.response && err.response.status < 500
          ? "E-mail ou senha incorretos."
          : "Não foi possível entrar agora. Tente de novo em alguns minutos."
      );
      setValidLogin("is-invalid");
    }
  }

  return (
    <DivLogin className="login">
      <MDBContainer>
        <MDBRow center style={{ paddingTop: "20vh" }}>
          <MDBCol md="6">
            {messageSend && <MDBAlert color="success">Bem-vindo(a)!</MDBAlert>}
            {errorSendMessage && (
              <MDBAlert color="danger">{errorMessage}</MDBAlert>
            )}
            <form
              className="needs-validation"
              noValidate
              onSubmit={handleLogin}
            >
              <h1 className="h4 text-center mb-4">Entrar no painel</h1>
              <label htmlFor="email">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                autoComplete="username"
                className={`form-control ${validLogin}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <br />
              <label htmlFor="password">
                Senha
              </label>
              <input
                type="password"
                id="password"
                autoComplete="current-password"
                className={`form-control ${validLogin}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="text-center mt-4">
                <MDBBtn color="primary" type="submit">
                  Entrar
                </MDBBtn>
              </div>
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </DivLogin>
  );
};

export default Login;
