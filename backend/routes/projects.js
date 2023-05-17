const router = require("express").Router();
const projectController = require("../controllers/ProjectController");
const verify = require("../utils/verifyToken");

router.post("/", verify, projectController.store);
router.get("/", projectController.index);
router.put("/:projectId", verify, projectController.update);
router.delete("/:projectId", verify, projectController.delete);

module.exports = router;
