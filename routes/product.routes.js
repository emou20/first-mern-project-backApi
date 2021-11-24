const router = require("express").Router();

const productController = require("../controllers/product.controller");

const multer = require('multer');
const upload = multer();


router.post("/add", upload.single('file'), productController.addProduct);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);
router.delete("/:id", productController.deleteProduct);
router.put("/:id", upload.single('file'), productController.updateProduct);

module.exports = router;