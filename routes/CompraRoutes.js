const express = require('express');
const { getComprasByUser, getAllVentas, insertVenta, updateStock, aprobarVenta, rechazarVenta, getPedidosByUser } = require('../controllers/compraController');
const router = express.Router();

// Ruta para obtener compras por usuario
router.get('/usuario/:userId', getComprasByUser);
// Ruta para obtener todas las ventas (admin)
router.get('/ventas', getAllVentas);
// Ruta para registrar una nueva venta
router.post('/nueva', insertVenta);
// Ruta para actualizar el stock de varios productos
router.post('/updateStock', updateStock);
// Aprobar venta
router.patch('/ventas/:ventaId/aprobar', aprobarVenta);
// Rechazar venta
router.patch('/ventas/:ventaId/rechazar', rechazarVenta);
// Ruta para obtener pedidos por usuario
router.get('/pedidos/usuario/:userId', getPedidosByUser);

module.exports = router;
