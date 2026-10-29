const router = require("express").Router();
const newsController = require("../controllers/newsController");
const multer = require("multer");
const { multerConfig } = require("../utils/multer");
const verify = require("../utils/verifyToken");
const otimizaImagem = require("../utils/otimizaImagem");

router.get("/", newsController.index);
router.get("/:id", newsController.show);
router.post(
  "/",
  verify,
  multer(multerConfig("news")).single("file"),
  otimizaImagem("news"),
  newsController.store
);
router.patch("/updateTexts/:id", verify, newsController.updateTexts);
router.patch(
  "/updateImage/:id",
  verify,
  multer(multerConfig("news")).single("file"),
  otimizaImagem("news"),
  newsController.updateImage
);
router.delete("/:id", verify, newsController.destroy);

module.exports = router;
