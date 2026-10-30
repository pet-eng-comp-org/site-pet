const fs = require("fs");

const deleteFile = (file, folderName) => {
  const filename = file.key;
  fs.unlink(`uploads/${folderName}/${filename}`, (err) => {
    if (err) console.log(err);
  });
  // Versões menores da mesma foto (fileController), se houver.
  for (const largura of [400, 800])
    fs.unlink(`uploads/${folderName}/tamanhos/${largura}-${filename}`, () => {});
};

module.exports.deleteFile = deleteFile;
