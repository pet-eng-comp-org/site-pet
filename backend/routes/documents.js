const router = require("express").Router();
const documentsController = require("../controllers/documentsController");
const multer = require("multer");
const { multerConfig } = require("../utils/multer");
const verify = require("../utils/verifyToken");

router.get("/", documentsController.index);
router.get("/:id", documentsController.show);
// Criar documento e anexar arquivo eram publicos: qualquer pessoa publicava um
// documento com PDF na lista do site. O painel ja manda o token nas duas.
router.post("/", verify, documentsController.store);
router.patch(
  "/addFile/:id",
  verify,
  multer(multerConfig("pdf")).single("file"),
  documentsController.addFile
);
router.patch("/removeFile/:id", verify, documentsController.removeFile);
router.put("/:id", verify, documentsController.update);
router.delete("/:id", verify, documentsController.destroy);

module.exports = router;
