const router = require("express").Router();
const selectionController = require("../controllers/selectionController");
const verify = require("../utils/verifyToken");

router.get("/", verify, selectionController.index);
router.get("/openSelection", selectionController.openSelection);
router.get("/:id", verify, selectionController.show);
router.post("/", verify, selectionController.store);
router.put("/:id", verify, selectionController.update);
router.patch("/finalizeSelection/:id", verify, selectionController.finalize);
router.delete("/:id", verify, selectionController.destroy);

module.exports = router;
