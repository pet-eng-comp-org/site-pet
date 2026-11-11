import { API } from "./apiUrl";
import type { Caminho, Respostas } from "../tipos";
import type { Dados } from "./useApi";

// Busca da API feita pelo servidor do Next ao montar cada página: a página
// chega pronta, com o texto, e o navegador não busca de novo.
//
// A resposta fica guardada 30 s. Vencida, a visita recebe a guardada e o Next
// busca a nova por trás. Sem resposta em 2 s, a página sai sem os dados, com o
// carregando, e o navegador tenta sozinho (useApi).

// Só o que a página mostra: a lista de membros traz também os que já saíram.
const enxugar = <C extends Caminho>(caminho: C, data: Respostas[C]): Respostas[C] =>
  caminho === "api/members/"
    ? ({
        ...data,
        members: (data as Respostas["api/members/"]).members.filter((m) => m.active),
      } as Respostas[C])
    : data;

// fresco: sem guardar (projeto que não está na lista pode ter sido criado agora).
export const buscar = async <C extends Caminho>(
  caminho: C,
  { fresco = false } = {}
): Promise<Respostas[C] | undefined> => {
  try {
    const resposta = await fetch(API + caminho, {
      ...(fresco ? { cache: "no-store" } : { next: { revalidate: 30 } }),
      signal: AbortSignal.timeout(2000),
    });
    if (!resposta.ok) return undefined;
    return enxugar(caminho, (await resposta.json()) as Respostas[C]);
  } catch {
    return undefined;
  }
};

// Várias de uma vez, no formato que o useApi recebe.
export const buscarVarios = async (caminhos: Caminho[]): Promise<Dados> => {
  const dados: Dados = {};
  await Promise.all(
    caminhos.map(async (c) => {
      const data = await buscar(c);
      if (data) dados[c] = { data } as never;
    })
  );
  return dados;
};
