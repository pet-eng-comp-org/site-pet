const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");

// Foto enviada pelo painel vira WebP no tamanho em que o site a mostra (o dobro,
// para tela de alta densidade). Uma foto de celular tem 3 a 5 MB; no site, um
// círculo de 140 px. SVG também vira imagem, e com isso não leva script junto.
const maiorLado = { members: 480, news: 1200, comissions: 1600 };

const otimizaImagem = (pasta) => async (req, res, next) => {
  if (!req.file) return next();

  const original = req.file.path;
  const filename = `${path.parse(req.file.filename).name}.webp`;
  const destino = path.join(path.dirname(original), filename);

  try {
    // Lida para a memória antes: um .webp enviado sai com o mesmo nome dele.
    const entrada = await fs.readFile(original);
    const info = await sharp(entrada, { animated: true })
      .rotate()
      .resize(maiorLado[pasta], maiorLado[pasta], { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(destino);
    if (original !== destino) await fs.unlink(original);
    Object.assign(req.file, {
      filename,
      path: destino,
      size: info.size,
      mimetype: "image/webp",
      width: info.width,
      height: info.height,
    });
    next();
  } catch (err) {
    await fs.unlink(original).catch(() => {});
    res.status(400).send("Não foi possível ler a imagem. Envie JPEG, PNG, WebP, GIF ou SVG.");
  }
};

module.exports = otimizaImagem;
