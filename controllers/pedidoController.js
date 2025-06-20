const { createClient } = require("@supabase/supabase-js");

const supabaseAnonClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Crear un nuevo pedido (ahora acepta array o solo objeto)
exports.insertPedido = async (req, res) => {
    try {
        let pedidos = Array.isArray(req.body) ? req.body : [req.body];
        // Validar que todos los pedidos tengan los campos obligatorios
        for (const pedido of pedidos) {
            const { user_id, producto_id, producto_nombre, cantidad, precio } = pedido;
            if (!user_id || !producto_id || !producto_nombre || !cantidad || !precio) {
                return res.status(400).json({ error: 'Faltan campos obligatorios en uno o más pedidos' });
            }
        }
        // Preparar los pedidos para insertar
        const pedidosAInsertar = pedidos.map(p => ({
            user_id: p.user_id,
            producto_id: p.producto_id,
            producto_nombre: p.producto_nombre,
            cantidad: p.cantidad,
            precio: p.precio,
            moneda: p.moneda,
            nombre_usuario: p.nombre_usuario || null,
            correo: p.correo || null,
            estado: 'pendiente',
            numero_pedido: p.numero_pedido || null
        }));
        const { data, error } = await supabaseAnonClient
            .from("pedidos")
            .insert(pedidosAInsertar);
        if (error) throw error;
        res.status(201).json({ message: `Pedidos registrados: ${pedidosAInsertar.length}` , data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener pedidos por usuario
exports.getPedidosByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const { data, error } = await supabaseAnonClient
            .from("pedidos")
            .select("*")
            .eq("user_id", userId)
            .order("fecha", { ascending: false });
        if (error) throw error;
        res.status(200).json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener todos los pedidos (admin)
exports.getAllPedidos = async (req, res) => {
    try {
        const { data, error } = await supabaseAnonClient
            .from("pedidos")
            .select("*")
            .order("fecha", { ascending: false });
        if (error) throw error;
        res.status(200).json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Aprobar pedido: crea venta y descuenta stock
exports.aprobarPedido = async (req, res) => {
    const { pedidoId } = req.params;
    // Obtener el nombre del admin desde el request (por ejemplo, req.user o req.body.admin)
    const admin = req.body && req.body.admin ? req.body.admin : 'admin';
    try {
        // Obtener el pedido
        const { data: pedido, error: pedidoError } = await supabaseAnonClient
            .from('pedidos')
            .select('*')
            .eq('id', pedidoId)
            .single();
        if (pedidoError || !pedido) throw pedidoError || new Error('Pedido no encontrado');
        // Descontar stock
        const { data: producto, error: prodError } = await supabaseAnonClient
            .from('productos')
            .select('stock')
            .eq('id', pedido.producto_id)
            .single();
        if (prodError || !producto) throw prodError || new Error('Producto no encontrado');
        if ((producto.stock || 0) < (pedido.cantidad || 0)) throw new Error('Stock insuficiente');
        const nuevoStock = (producto.stock || 0) - (pedido.cantidad || 0);
        const { error: updateError } = await supabaseAnonClient
            .from('productos')
            .update({ stock: nuevoStock })
            .eq('id', pedido.producto_id);
        if (updateError) throw updateError;
        // Crear venta
        const { error: ventaError } = await supabaseAnonClient
            .from('Ventas')
            .insert([
                {
                    user_id: pedido.user_id,
                    producto_id: pedido.producto_id,
                    producto_nombre: pedido.producto_nombre,
                    cantidad: pedido.cantidad,
                    precio: pedido.precio,
                    moneda: pedido.moneda,
                    fecha: new Date().toISOString(),
                    nombre_usuario: pedido.nombre_usuario,
                    correo: pedido.correo,
                    numero_pedido: pedido.numero_pedido || null
                }
            ]);
        if (ventaError) throw ventaError;
        // Cambiar estado del pedido y guardar el admin
        const { error: estadoError } = await supabaseAnonClient
            .from('pedidos')
            .update({ estado: 'aprobado', comentario_admin: admin })
            .eq('id', pedidoId);
        if (estadoError) throw estadoError;
        res.status(200).json({ message: 'Pedido aprobado y venta registrada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Rechazar pedido
exports.rechazarPedido = async (req, res) => {
    const { pedidoId } = req.params;
    const admin = req.body && req.body.admin ? req.body.admin : 'admin';
    try {
        const { error } = await supabaseAnonClient
            .from('pedidos')
            .update({ estado: 'rechazado', comentario_admin: admin })
            .eq('id', pedidoId);
        if (error) throw error;
        res.status(200).json({ message: 'Pedido rechazado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
