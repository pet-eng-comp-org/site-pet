import type { MetadataRoute } from "next";
import { buscar } from "../services/dadosDoServidor";
import { SITE } from "../services/metadados";
import slug from "../utils/slug";

// As páginas indexadas e um endereço por projeto.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const comissoes = (await buscar("api/comissions"))?.comissions || [];
  return ["/", "/sobre", "/projetos", "/documentos", "/contato", "/inscricoes"]
    .concat(comissoes.map((c) => `/projetos/${slug(c.title)}`))
    .map((caminho) => ({ url: SITE + caminho }));
}
