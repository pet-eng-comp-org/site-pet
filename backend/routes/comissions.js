const router = require("express").Router();
const comissionController = require("../controllers/ComissionController");
const multer = require("multer");
const { multerConfig } = require("../utils/multer");
const verify = require("../utils/verifyToken");
const otimizaImagem = require("../utils/otimizaImagem");

router.post("/", verify, comissionController.store);
router.get("/", comissionController.index);
router.get("/:comissionId", comissionController.show);
router.put("/:comissionId", verify, comissionController.update);
router.patch(
  "/insertProject/:comissionId",
  verify,
  comissionController.insertProject
);
router.patch(
  "/removeProject/:comissionId",
  verify,
  comissionController.removeProject
);
router.patch(
  "/addPhoto/:comissionId",
  verify,
  multer(multerConfig("comissions")).single("photo"),
  otimizaImagem("comissions"),
  comissionController.addPhoto
);
router.patch(
  "/removePhoto/:comissionId",
  verify,
  comissionController.removePhoto
);
// A primeira foto é o ícone do cartão; as outras, a galeria, nessa ordem.
router.patch(
  "/ordenarFotos/:comissionId",
  verify,
  comissionController.ordenarFotos
);
router.delete("/:comissionId", verify, comissionController.delete);

module.exports = router;
