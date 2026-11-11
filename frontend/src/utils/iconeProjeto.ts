import slug from "./slug";
import { API } from "../services/apiUrl";

// Ícones de traço do Lucide (licença ISC, em public/icones-projetos/LICENCA-lucide.txt),
// um por projeto, todos no mesmo peso. Projeto sem ícone aqui usa o enviado
// pelo painel.
const COM_ICONE = new Set([
  "dev",
  "eletropet",
  "interpet",
  "introcomp",
  "manutencao",
  "mobiliza-pet",
  "monitorias",
  "pesquisa",
  "pet-game-jam",
  "pulga",
  "topcom",
]);

const iconeProjeto = (titulo: string, idDoPainel?: string): string => {
  const s = slug(titulo);
  if (COM_ICONE.has(s)) return `/icones-projetos/${s}.svg`;
  return idDoPainel ? `${API}api/file/getComissionPhoto/${idDoPainel}` : "";
};

export default iconeProjeto;
