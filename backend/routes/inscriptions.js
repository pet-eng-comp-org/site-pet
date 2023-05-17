const router = require("express").Router();
const inscriptionsController = require("../controllers/inscriptionsController");
const multer = require("multer");
const { multerConfig } = require("../utils/multer");
const verify = require("../utils/verifyToken");

router.get("/", verify, inscriptionsController.index);
router.get("/:id", verify, inscriptionsController.show);
router.post(
  "/",
  multer(multerConfig("zip")).single("file"),
  inscriptionsController.store
);
router.delete("/:id", verify, inscriptionsController.destroy);
router.patch(
  "/acceptInscription/:id",
  verify,
  inscriptionsController.acceptInscription
);

module.exports = router;
