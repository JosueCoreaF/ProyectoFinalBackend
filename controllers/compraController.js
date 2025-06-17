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

// Registrar una nueva venta
exports.insertVenta = async (req, res) => {
    try {
        const { user_id, producto_nombre, producto_id, cantidad, precio } = req.body;
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
                    fecha: new Date().toISOString()
                }
            ]);
        if (error) throw error;
        res.status(201).json({ message: "Venta registrada", data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
