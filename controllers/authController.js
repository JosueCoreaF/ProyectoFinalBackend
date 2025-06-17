const supabaseAdmin = require('../supabaseClient');
const {createClient} = require('@supabase/supabase-js');
const axios = require('axios');

const supabaseAnonClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);
exports.registerUser = async (req, res) => {
  const { email, password, username, telefono, ciudad, moneda, imagen_url } = req.body;

  /*// Validar datos básicos (puedes mejorar esto)
  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Email, password y username son obligatorios.' });
  }

  // Verificar si el correo ya está registrado
  const { data: existingUser, error: userError } = await supabaseAdmin.auth.admin.listUsers({ email });
  if (userError) {
    return res.status(500).json({ error: 'Error al verificar el correo.' });
  }
  if (existingUser && existingUser.users && existingUser.users.length > 0) {
    return res.status(400).json({ error: 'El correo ya está registrado.' });
  }*/

  const monedasValidas = ['HNL', 'USD', 'EUR', 'MXN', 'GBP'];
  const monedaFinal = monedasValidas.includes(moneda) ? moneda : 'HNL';
  const imagenFinal = imagen_url || '';

  // Crear usuario en Auth
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) return res.status(400).json({ error: error.message });

  const userId = data.user.id;

  // Insertar perfil
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert([
      {
        id: userId,
        nombre_usuario: username,
        telefono,
        ciudad,
        moneda: monedaFinal,
        imagen_url: imagenFinal,
        nivel: 'user',
      },
    ]);

  if (profileError) {
    // Intentar rollback
    await supabaseAdmin.auth.admin.deleteUser(userId);
    return res.status(500).json({ error: profileError.message });
  }

  res.json({ user: data.user });
};


exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { data, error } = await supabaseAnonClient.auth.signInWithPassword({ email, password });

        if (error) {
            console.error('Error al iniciar sesión:', error.message);
            return res.status(400).json({ error: error.message });
        }

        const user = data.user;
        const { data: perfil, error: perfilError } = await supabaseAnonClient
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (perfilError) {
            console.error('Error al obtener perfil:', perfilError.message);
            return res.status(500).json({ error: 'No se pudo cargar el perfil.' });
        }

        console.log('Login exitoso para el usuario:', user.email);

        res.json({ session: data.session, user: data.user, perfil });
    } catch (err) {
        console.error('Error inesperado en loginUser:', err);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};


