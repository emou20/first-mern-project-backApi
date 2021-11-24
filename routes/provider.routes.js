const router = require("express").Router();

const providerController = require("../controllers/provider.controller");


router.post("/add", providerController.addProvider);
router.get("/", providerController.getProviders);
router.get("/:id", providerController.getProvider);
router.delete("/:id", providerController.deleteProvider);
router.put("/:id", providerController.updateProvider);

module.exports = router;