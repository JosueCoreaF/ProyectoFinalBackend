const express = require('express');
const { getComprasByUser, getAllVentas, insertVenta } = require('../controllers/compraController');
const router = express.Router();

// Ruta para obtener compras por usuario
router.get('/usuario/:userId', getComprasByUser);
// Ruta para obtener todas las ventas (admin)
router.get('/ventas', getAllVentas);
// Ruta para registrar una nueva venta
router.post('/nueva', insertVenta);

module.exports = router;
