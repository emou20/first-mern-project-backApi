const router = require("express").Router();

const userController = require("../controllers/user.controller");
const uploadController = require('../controllers/upload.controller');

const multer = require('multer');
const upload = multer();


router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);
router.delete("/:id", userController.deleteUser);
router.put("/:id", userController.updateUser);
router.put("/role/:id", userController.updateUserRole);
//upload image 
router.post("/upload", upload.single('file'), uploadController.uploadImage);


// auth
router.post("/register", userController.signUp);
router.post("/login", userController.signIn);
router.get("/connexion/logout", userController.logouttt);



module.exports = router;