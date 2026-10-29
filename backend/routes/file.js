const router = require("express").Router();
const fileController = require("../controllers/fileController");
const verify = require("../utils/verifyToken");

router.get("/", fileController.index);
router.get("/:fileId", fileController.show);
router.get("/downloadDocument/:fileId", fileController.downloadDocument);
router.get("/getImageNews/:fileId", fileController.getImageNews);
router.get("/getProfilePhoto/:fileId", fileController.getProfilePhoto);
router.get("/getComissionPhoto/:fileId", fileController.getComissionPhoto);
router.delete("/:fileId", verify, fileController.destroy);

module.exports = router;
