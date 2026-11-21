const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

const extensao = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/svg+xml": ".svg",
  "image/gif": ".gif",
  "image/webp": ".webp",
};

const multerConfig = (type) => {
  let folder, allowedMimes;

  if (type === "pdf") {
    folder = "documents";
    allowedMimes = ["application/pdf"];
  } else if (type === "news") {
    folder = "news";
    allowedMimes = ["image/jpeg", "image/png", "image/svg+xml", "image/gif", "image/webp"];
  } else if (type == "members") {
    folder = "members";
    allowedMimes = ["image/jpeg", "image/png", "image/svg+xml", "image/gif", "image/webp"];
  } else if (type == "comissions") {
    folder = "comissions";
    allowedMimes = ["image/jpeg", "image/png", "image/svg+xml", "image/gif", "image/webp"];
  }

  if (!fs.existsSync(path.resolve(__dirname, "..", "uploads", folder))) {
    //Efetua a criação do diretório
    fs.mkdirSync(path.resolve(__dirname, "..", "uploads", folder));
  }

  return {
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, "..", "uploads", folder));
      },
      filename: (req, file, cb) => {
        // O nome enviado fica so no banco (File.name), para o site mostrar; no
        // disco, so o sorteio e a extensao do tipo ja conferido no fileFilter.
        crypto.randomBytes(16, (err, hash) => {
          if (err) return cb(err);
          cb(null, hash.toString("hex") + extensao[file.mimetype]);
        });
      },
    }),
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type."));
      }
    },
  };
};

module.exports.multerConfig = multerConfig;
