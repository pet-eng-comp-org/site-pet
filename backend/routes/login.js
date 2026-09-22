const router = require("express").Router();
const loginController = require("../controllers/loginController");
const verify = require("../utils/verifyToken");

router.get("/", loginController.login);
router.patch("/changePassword/:idPetiano", verify, loginController.newPassword);

module.exports = router;
