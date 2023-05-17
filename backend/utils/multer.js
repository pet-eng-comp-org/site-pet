const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

const multerConfig = (type) => {
  let folder, allowedMimes;

  if (type === "zip") {
    folder = "inscriptions";
    allowedMimes = ["application/zip"];
  } else if (type === "pdf") {
    folder = "documents";
    allowedMimes = ["application/pdf"];
  } else if (type === "news") {
    folder = "news";
    allowedMimes = ["image/jpeg", "image/png", "image/svg+xml", "image/gif"];
  } else if (type == "members") {
    folder = "members";
    allowedMimes = ["image/jpeg", "image/png", "image/svg+xml", "image/gif"];
  } else if (type == "projects") {
    folder = "projects";
    allowedMimes = ["image/jpeg", "image/png", "image/svg+xml", "image/gif"];
  } else if (type == "comissions") {
    folder = "comissions";
    allowedMimes = ["image/jpeg", "image/png", "image/svg+xml", "image/gif"];
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
        crypto.randomBytes(16, (err, hash) => {
          if (err) cb(err);

          const fileName = `${hash.toString("hex")}-${file.originalname}`;

          cb(null, fileName);
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
