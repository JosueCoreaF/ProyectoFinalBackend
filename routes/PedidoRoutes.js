const express = require('express');
const { insertPedido, getPedidosByUser, getAllPedidos, aprobarPedido, rechazarPedido } = require('../controllers/pedidoController');
const router = express.Router();

// Crear un nuevo pedido
router.post('/nuevo', insertPedido);
// Obtener pedidos por usuario
router.get('/usuario/:userId', getPedidosByUser);
// Obtener todos los pedidos (admin)
router.get('/', getAllPedidos);
// Aprobar pedido
router.patch('/:pedidoId/aprobar', aprobarPedido);
// Rechazar pedido
router.patch('/:pedidoId/rechazar', rechazarPedido);

module.exports = router;
