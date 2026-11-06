// Só lê o conteúdo do token para saber se há sessão; quem confere a
// assinatura é o servidor. A biblioteca jsonwebtoken, usada antes para isso,
// trazia para todo visitante um polyfill de criptografia do Node (~40% do JS).
function isAuth() {
  const token = localStorage.getItem("LOGINPET_TOKEN");
  if (token == null) return null;
  try {
    const conteudo = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const sessao = JSON.parse(atob(conteudo));
    // O token vale 24 h. Vencido, a sessão acabou: sem isto o menu seguia
    // mostrando o Painel, e o painel abria para depois cair no login.
    if (sessao.exp * 1000 <= Date.now()) {
      localStorage.removeItem("LOGINPET_TOKEN");
      sessionStorage.setItem("sessaoExpirou", "1");
      return null;
    }
    return sessao;
  } catch (err) {
    return null;
  }
}

export default isAuth;
