// O que a API do site (backend/) devolve, do jeito que o site usa.

export type Id = string;

export interface Arquivo {
  _id: Id;
  name: string;
  size: number;
  key: string;
  width?: number;
  height?: number;
  alt?: string;
  createdAt: string;
}

export interface Etiqueta {
  _id: Id;
  title: string;
  color?: string;
  backgroundColor?: string;
  link?: string;
}

export interface Comissao {
  _id: Id;
  title: string;
  description: string;
  // A primeira é o ícone do cartão; as outras, as fotos da página.
  photos: Id[];
  // Largura, altura e descrição de cada foto, para reservar o espaço.
  medidas?: Pick<Arquivo, "_id" | "width" | "height" | "alt">[];
  tags: Etiqueta[];
}

export interface RedeSocial {
  _id?: Id;
  name: string;
  link: string;
}

export interface Membro {
  _id: Id;
  memberName: string;
  description: string;
  startPet: string;
  endPet?: string;
  active: boolean;
  tutor: boolean;
  socialMidia: RedeSocial[];
  profilePhoto?: Pick<Arquivo, "_id" | "key">;
  tags?: Etiqueta[];
}

export interface GrupoDeDocumentos {
  _id: Id;
  title: string;
  files: Arquivo[];
}

export interface Noticia {
  _id: Id;
  title: string;
  text: string;
  date: string;
  file: Arquivo;
}

export interface Selecao {
  _id: Id;
  title: string;
  dateBegin: string;
  dateEnd: string;
  formLink: string;
  open: boolean;
}

// As respostas, por caminho da API.
export interface Respostas {
  "api/comissions": { comissions: Comissao[] };
  "api/members/": { members: Membro[] };
  "api/documents/": { documents: GrupoDeDocumentos[] };
  "api/news/": { news: Noticia[] };
  "api/selection/openSelection": { selection: Selecao | null };
}

export type Caminho = keyof Respostas;
