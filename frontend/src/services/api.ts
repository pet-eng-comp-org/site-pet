import axios from "axios";
import { API } from "./apiUrl";

const api = axios.create({ baseURL: API });

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data === "Invalid Token") {
      // Só o painel cai aqui: volta ao login, que avisa que a sessão expirou.
      localStorage.removeItem("LOGINPET_TOKEN");
      sessionStorage.setItem("sessaoExpirou", "1");
      window.location.assign("/login");
    }
    // Rejeita também na sessão expirada: quem chamou não segue achando que
    // deu certo enquanto a página troca.
    return Promise.reject(error);
  }
);

export default api;
