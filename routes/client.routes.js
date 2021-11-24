const router = require("express").Router();

const clientController = require("../controllers/client.controller");



router.post("/register", clientController.signUp);
router.post("/login", clientController.signIn);
router.get("/connexion/logout", clientController.logouttt);
router.get("/", clientController.getClients);
router.get("/:id", clientController.getClient);
router.delete("/:id", clientController.deleteClient);
router.put("/:id", clientController.updateClient);



module.exports = router;