const { createClient } = require("@supabase/supabase-js");

const supabaseAnonClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

exports.getAllProducts = async (req, res) => {
    try {
        const { data, error } = await supabaseAnonClient
            .from("productos")
            .select("*");
        if (error) throw error;
        res.status(200).json({ data });
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
    return res;
};
exports.insertProducts = async (req, res) => {
    console.log("Body recibido:", req.body);
    const { nombre, imagen, descripcion, precio, categoria } = req.body;
    if (!nombre || !imagen || !descripcion || !precio || !categoria) {
        console.log("Faltan campos obligatorios");
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    try {
        console.log("Intentando insertar en Supabase...");
        const { data, error } = await supabaseAnonClient
            .from("productos")
            .insert([{ nombre, imagen, descripcion, precio, categoria }]);
        console.log("Resultado de Supabase:", { data, error });
        if (error) throw error;
        res.status(201).json({ message: "Producto insertado correctamente", data });
    } catch (err) {
        console.log("Error al insertar:", err.message);
        res.status(500).json({ error: err.message });
    }
};
