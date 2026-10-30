// Só lê o conteúdo do token para saber se há sessão; quem confere a
// assinatura é o servidor. A biblioteca jsonwebtoken, usada antes para isso,
// trazia para todo visitante um polyfill de criptografia do Node (~40% do JS).
function isAuth() {
  const token = localStorage.getItem("LOGINPET_TOKEN");
  if (token == null) return null;
  try {
    const conteudo = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(conteudo));
  } catch (err) {
    return null;
  }
}

export default isAuth;
