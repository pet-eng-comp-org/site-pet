// A foto do petiano pode ter duas partes, uma sobre a outra: a de cima é a
// foto de sempre, a de baixo a descontraída, que aparece com o mouse ou um
// toque. É um arquivo só, então o servidor e o banco não sabem que são duas:
// o painel monta a imagem e o site a reconhece pela proporção.

// Cada metade com o dobro do círculo do site (140 px), para tela de alta densidade.
const LADO = 280;

// O painel monta sempre 1:2 exato. Uma foto comum de celular em pé fica entre
// 1,78 (9:16) e 2,17 (9:19,5); a faixa estreita não confunde as duas.
export const ehDupla = (largura: number, altura: number): boolean => largura > 0 && Math.abs(altura / largura - 2) < 0.05;

const carregar = (origem: string | File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    // A foto atual vem da API, em outro domínio; sem isso o canvas fica bloqueado.
    img.crossOrigin = "anonymous";
    // Um SVG sem largura e altura carrega com tamanho 0 e sairia em branco.
    img.onload = () => (img.naturalWidth ? resolve(img) : reject(new Error("imagem sem tamanho")));
    img.onerror = () => reject(new Error("imagem ilegível"));
    img.src = typeof origem === "string" ? origem : URL.createObjectURL(origem);
  });

export const fotoEhDupla = async (url: string) => {
  const img = await carregar(url);
  return ehDupla(img.naturalWidth, img.naturalHeight);
};

// Recorta o quadrado central de um arquivo enviado, ou uma das metades da foto
// dupla atual. Foto mais alta que larga fica com a parte de cima, onde o rosto
// costuma estar.
type Metade = "cima" | "baixo";

// Uma parte da foto: um arquivo novo ou uma metade da foto atual.
export type Parte = File | { url: string; metade?: Metade };

const quadrado = (img: HTMLImageElement, metade?: Metade) => {
  const w = img.naturalWidth;
  let h = img.naturalHeight;
  let y = 0;
  if (metade) {
    h /= 2;
    if (metade === "baixo") y = h;
  }
  const lado = Math.min(w, h);
  return { sx: (w - lado) / 2, sy: y + (h > w ? 0 : (h - lado) / 2), lado };
};

// Cada parte é um File novo ou { url, metade } da foto atual. Sai em PNG: sem
// perda antes da conversão do servidor para WebP, e com a transparência de um
// PNG recortado (em JPEG ela viraria fundo preto).
export const montarFoto = async (seria: Parte, descontraida?: Parte | null) => {
  const partes = [seria, descontraida].filter((p): p is Parte => Boolean(p));
  const canvas = document.createElement("canvas");
  canvas.width = LADO;
  canvas.height = LADO * partes.length;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingQuality = "high";
  for (const [i, parte] of partes.entries()) {
    const img = await carregar(parte instanceof File ? parte : parte.url);
    const { sx, sy, lado } = quadrado(img, parte instanceof File ? undefined : parte.metade);
    ctx.drawImage(img, sx, sy, lado, lado, 0, i * LADO, LADO, LADO);
    if (parte instanceof File) URL.revokeObjectURL(img.src);
  }
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
  if (!blob) throw new Error("não foi possível montar a foto");
  return new File([blob], "foto.png", { type: "image/png" });
};
