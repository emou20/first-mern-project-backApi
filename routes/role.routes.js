const router = require("express").Router();
const roleController = require("../controllers/role.controller");

router.get("/", roleController.getRoles);
router.post("/create", roleController.createRole);
router.post("/nameRole", roleController.nameRole);
router.delete("/delete/:id", roleController.deleteRole);
router.put("/update/:id", roleController.updateRole);
router.get("/:id", roleController.getRole);


module.exports = router;