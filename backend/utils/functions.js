const fs = require("fs");

const deleteFile = (file, folderName) => {
  const filename = file.key;
  fs.unlink(`uploads/${folderName}/${filename}`, (err) => {
    if (err) console.log(err);
  });
};

module.exports.deleteFile = deleteFile;
