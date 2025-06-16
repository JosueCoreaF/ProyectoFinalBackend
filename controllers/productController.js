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
    const { nombre, imagen, descripcion, precio, categoria, esOferta, precioOriginal } = req.body;
    if (!nombre || !imagen || !descripcion || !precio || !categoria) {
        console.log("Faltan campos obligatorios");
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    try {
        console.log("Intentando insertar en Supabase...");
        const { data, error } = await supabaseAnonClient
            .from("productos")
            .insert([{ nombre, imagen, descripcion, precio, categoria, esOferta, precioOriginal }]);
        console.log("Resultado de Supabase:", { data, error });
        if (error) throw error;
        res.status(201).json({ message: "Producto insertado correctamente", data });
    } catch (err) {
        console.log("Error al insertar:", err.message);
        res.status(500).json({ error: err.message });
    }
};
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, imagen, descripcion, precio, categoria, esOferta, precioOriginal } = req.body;

        const { data, error } = await supabaseAnonClient
            .from("productos")
            .update({ nombre, imagen, descripcion, precio, categoria, esOferta, precioOriginal })
            .eq("id", id);
        console.log("Datos actualizados" );
        if (error) throw error;
        res.status(200).json({ message: "Producto actualizado correctamente", data });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAnonClient
      .from("productos")
      .delete()
      .eq("id", id);

    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
