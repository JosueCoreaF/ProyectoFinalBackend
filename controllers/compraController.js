const { createClient } = require("@supabase/supabase-js");

const supabaseAnonClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Obtener compras por usuario
exports.getComprasByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const { data, error } = await supabaseAnonClient
            .from("Ventas")
            .select("*")
            .eq("user_id", userId)
            .order("fecha", { ascending: false });
        if (error) throw error;
        res.status(200).json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener todas las ventas (para admin) solo con los campos de la tabla Ventas
exports.getAllVentas = async (req, res) => {
    try {
        const { data, error } = await supabaseAnonClient
            .from("Ventas")
            .select("*")
            .order("fecha", { ascending: false });
        if (error) throw error;
        res.status(200).json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Registrar una nueva venta (ahora guarda nombre_usuario y correo)
exports.insertVenta = async (req, res) => {
    try {
        const { user_id, producto_nombre, producto_id, cantidad, precio, nombre_usuario, correo, moneda } = req.body;
        if (!user_id || !producto_nombre || !producto_id || !cantidad || !precio) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        const { data, error } = await supabaseAnonClient
            .from("Ventas")
            .insert([
                {
                    user_id,
                    producto_nombre,
                    producto_id,
                    cantidad,
                    precio,
                    fecha: new Date().toISOString(),
                    nombre_usuario: nombre_usuario || null,
                    correo: correo || null,
                    moneda: moneda || null
                }
            ]);
        if (error) throw error;
        // Disminuir stock de productos después de registrar la venta
        for (const item of req.body.productos || []) {
            const { error: updateError } = await supabaseAnonClient
                .from("productos")
                .update({ stock: item.nuevoStock })
                .eq("id", item.producto_id);
            if (updateError) {
                // Si falla la actualización de stock, puedes manejarlo aquí
                console.error('Error actualizando stock:', updateError.message);
            }
        }
        res.status(201).json({ message: "Venta registrada", data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Nuevo endpoint para actualizar el stock de varios productos
exports.updateStock = async (req, res) => {
    try {
        const { productos } = req.body; // [{ producto_id, nuevoStock }]
        if (!Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({ error: 'Se requiere un array de productos' });
        }
        for (const item of productos) {
            if (!item.producto_id || typeof item.nuevoStock !== 'number') continue;
            const { error } = await supabaseAnonClient
                .from('productos')
                .update({ stock: item.nuevoStock })
                .eq('id', item.producto_id);
            if (error) {
                console.error('Error actualizando stock:', error.message);
            }
        }
        res.status(200).json({ message: 'Stock actualizado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
