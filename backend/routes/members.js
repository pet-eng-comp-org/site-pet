const router = require("express").Router();
const memberController = require("../controllers/MemberController");
const multer = require("multer");
const { multerConfig } = require("../utils/multer");
const verify = require("../utils/verifyToken");
const otimizaImagem = require("../utils/otimizaImagem");

router.post("/", verify, memberController.store);
router.get("/", memberController.index);
router.get("/all/", verify, memberController.indexAll);
router.get("/:memberId", verify, memberController.show);
router.get("/showEgress", memberController.showEgress);
router.get("/showEgressAll", verify, memberController.showEgressAll);
router.put("/:memberId", verify, memberController.update);
router.patch("/sairDoPet/:memberId", verify, memberController.sairDoPet);
router.patch(
  "/firstProfilePhoto/:memberId",
  verify,
  multer(multerConfig("members")).single("profilePhoto"),
  otimizaImagem("members"),
  memberController.firstProfilePhoto
);
router.patch(
  "/updateProfilePhoto/:memberId",
  verify,
  multer(multerConfig("members")).single("profilePhoto"),
  otimizaImagem("members"),
  memberController.updateProfilePhoto
);
router.delete("/:memberId", verify, memberController.delete);

module.exports = router;
