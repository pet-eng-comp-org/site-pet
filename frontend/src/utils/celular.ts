// Celular com DDD formatado enquanto a pessoa digita: (27) 99999-8888.
export const formatarCelular = (texto: string): string => {
  const d = texto.replace(/\D/g, "").slice(0, 11);
  if (!d) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

// onChange do campo: formata e põe o cursor depois do mesmo dígito em que
// estava, para corrigir um número no meio sem o cursor pular para o fim.
// Apagar um parêntese, espaço ou traço apaga o dígito antes dele; sem isso, a
// formatação o devolveria e o Backspace pareceria travado.
export const digitarCelular = (
  e: React.ChangeEvent<HTMLInputElement>,
  anterior: string,
  aoMudar: (valor: string) => void
) => {
  const campo = e.target;
  let texto = campo.value;
  let cursor = campo.selectionStart ?? texto.length;
  const digitos = (t: string) => t.replace(/\D/g, "");
  if (texto.length < anterior.length && digitos(texto) === digitos(anterior)) {
    const antes = texto.slice(0, cursor).replace(/\d(\D*)$/, "$1");
    texto = antes + texto.slice(cursor);
    cursor = antes.length;
  }
  const quantos = digitos(texto.slice(0, cursor)).length;
  const novo = formatarCelular(texto);
  let pos = 0;
  for (let vistos = 0; pos < novo.length && vistos < quantos; pos++) if (/\d/.test(novo[pos])) vistos++;
  aoMudar(novo);
  requestAnimationFrame(() => campo.setSelectionRange(pos, pos));
};
