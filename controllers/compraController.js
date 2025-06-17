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

// Obtener todas las ventas (para admin) con JOIN a profiles para nombre y email
exports.getAllVentas = async (req, res) => {
    try {
        const { data, error } = await supabaseAnonClient
            .from("Ventas")
            .select(`
                id,
                user_id,
                producto_nombre,
                producto_id,
                fecha,
                cantidad,
                precio,
                profiles (
                    nombre_usuario,
                    email
                )
            `)
            .order("fecha", { ascending: false });
        if (error) throw error;
        res.status(200).json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
