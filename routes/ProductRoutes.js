const express = require('express');
const { getAllProducts, insertProducts, updateProduct, deleteProduct } = require('../controllers/productController');
const router = express.Router();

router.get("/allProducts", getAllProducts);
router.post("/newProduct", insertProducts);
router.post("/", insertProducts);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;