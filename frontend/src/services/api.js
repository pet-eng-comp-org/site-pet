import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // baseURL: "http://localhost:3333/",
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.data === "Invalid Token") {
      // Só o painel cai aqui: volta ao login, que avisa que a sessão expirou.
      localStorage.removeItem("LOGINPET_TOKEN");
      sessionStorage.setItem("sessaoExpirou", "1");
      window.location.assign("/login");
    } else {
      return Promise.reject(error);
    }
  }
);

export default api;
