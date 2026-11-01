import api from "../../services/api";

// Chamadas do painel: todas levam o token de quem entrou.
const comToken = (config = {}) => ({
  ...config,
  headers: {
    ...config.headers,
    Authorization: `Bearer ${localStorage.getItem("LOGINPET_TOKEN")}`,
  },
});

export const painel = {
  get: (url) => api.get(url, comToken()),
  post: (url, dados) => api.post(url, dados, comToken()),
  put: (url, dados) => api.put(url, dados, comToken()),
  patch: (url, dados) => api.patch(url, dados, comToken()),
  delete: (url, dados) => api.delete(url, comToken({ data: dados })),
};

// O que a API responde em inglês, dito em português para quem usa o painel.
const traducoes = [
  [/email already exists/i, "Já existe um petiano com esse e-mail."],
  [/"file" is required/i, "Escolha um arquivo."],
  [/finalized before/i, "Encerre a seleção antes de excluí-la."],
  [/Já existe uma seleção aberta/i, "Já existe uma seleção aberta. Encerre-a antes de criar outra."],
  [/Invalid Token|Access Denied/i, "Sua sessão expirou. Entre de novo."],
];

export const erroDe = (err) => {
  if (!err.response) return "A API não respondeu. Confira a conexão e tente de novo.";
  const texto = typeof err.response.data === "string" ? err.response.data : "";
  const conhecido = traducoes.find(([padrao]) => padrao.test(texto));
  if (conhecido) return conhecido[1];
  if (err.response.status >= 500)
    return "O servidor do site falhou. Tente de novo em alguns minutos.";
  return texto
    ? `A API recusou: ${texto}`
    : "Não deu para salvar. Confira os campos e tente de novo.";
};
