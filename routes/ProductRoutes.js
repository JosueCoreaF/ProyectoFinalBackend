const express = require('express');
const { getAllProducts, insertProducts, updateProduct } = require('../controllers/productController');
const router = express.Router();

router.get("/allProducts", getAllProducts);
router.post("/newProduct", insertProducts);
router.post("/", insertProducts);
router.put("/:id", updateProduct);

module.exports = router;