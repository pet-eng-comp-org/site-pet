import slug from "./slug";

// Ícones de traço do Lucide (licença ISC, em assets/projetos/LICENCA-lucide.txt),
// um por projeto, todos no mesmo peso. Projeto sem ícone aqui usa o enviado
// pelo painel.
const ICONES = Object.fromEntries(
  Object.entries(
    import.meta.glob("../assets/projetos/*.svg", { eager: true, import: "default" })
  ).map(([caminho, url]) => [caminho.split("/").pop().replace(".svg", ""), url])
);

const iconeProjeto = (titulo, idDoPainel) =>
  ICONES[slug(titulo)] ||
  (idDoPainel ? `${import.meta.env.VITE_API_URL}api/file/getComissionPhoto/${idDoPainel}` : "");

export default iconeProjeto;
