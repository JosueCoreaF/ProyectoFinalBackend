const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

//Rutas
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/products', require('./routes/ProductRoutes'))
app.use('/api/compras', require('./routes/CompraRoutes'));
app.use('/api/pedidos', require('./routes/PedidoRoutes'));

const PORT = process.env.PORT || 3301
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`))

//npm install axios
