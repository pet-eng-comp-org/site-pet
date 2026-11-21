const fs = require("fs");
const path = require("path");

const deleteFile = (file, folderName) => {
  // A chave vem do banco; basename garante que nada sai da pasta de uploads.
  const filename = path.basename(file.key);
  fs.unlink(`uploads/${folderName}/${filename}`, (err) => {
    if (err) console.log(err);
  });
  // Versões menores da mesma foto (fileController), se houver.
  for (const largura of [400, 800])
    fs.unlink(`uploads/${folderName}/tamanhos/${largura}-${filename}`, () => {});
};

module.exports.deleteFile = deleteFile;
