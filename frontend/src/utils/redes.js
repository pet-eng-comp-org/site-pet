// Link de rede social como a pessoa escreveu no painel: "@usuario" vira o
// link do perfil, e link sem protocolo ganha https://. Vale no painel (ao
// salvar) e em Quem somos (cadastros antigos guardaram só o @).
const PERFIS = {
  instagram: "https://instagram.com/",
  linkedin: "https://linkedin.com/in/",
  youtube: "https://youtube.com/@",
  twitter: "https://x.com/",
  twitch: "https://twitch.tv/",
  facebook: "https://facebook.com/",
};

const linkDaRede = ({ name, link }) => {
  const t = (link || "").trim();
  if (/^@\w[\w.-]*$/.test(t)) return (PERFIS[name] || "https://instagram.com/") + t.slice(1);
  if (/^https?:\/\//.test(t)) return t;
  return t && !/\s/.test(t) && t.includes(".") ? `https://${t}` : t;
};

export default linkDaRede;
