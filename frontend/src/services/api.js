import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  // baseURL: "http://localhost:3333/",
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.data === "Invalid Token") {
      // Só o painel cai aqui; o aviso é baixado quando precisa.
      import("../components/SessionExpired/SessionExpired").then(
        ({ default: SessionExpired }) =>
          ReactDOM.render(<SessionExpired />, document.querySelector("#root"))
      );
    } else {
      return Promise.reject(error);
    }
  }
);

export default api;
