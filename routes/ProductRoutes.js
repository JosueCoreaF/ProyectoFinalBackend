const express = require('express');
const { getAllProducts, insertProducts } = require('../controllers/productController');
const router = express.Router();

router.get("/allProducts", getAllProducts);
router.post("/newProduct", insertProducts);
router.post("/", insertProducts);

module.exports = router;