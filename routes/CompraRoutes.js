const express = require('express');
const { getComprasByUser, getAllVentas } = require('../controllers/compraController');
const router = express.Router();

// Ruta para obtener compras por usuario
router.get('/usuario/:userId', getComprasByUser);
// Ruta para obtener todas las ventas (admin)
router.get('/ventas', getAllVentas);

module.exports = router;
