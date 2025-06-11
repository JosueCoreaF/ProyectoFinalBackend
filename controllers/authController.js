const supabaseAdmin = require('../supabaseClient');
const {createClient} = require('@supabase/supabase-js');
const axios = require('axios');

const supabaseAnonClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);
exports.registerUser = async (req, res) => {
    const { email, password, username, name } = req.body;

    // Crear usuario en Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true
    });
    if (error) return res.status(400).json({ error: error.message });

    res.json({ user: data.user });
};

exports.loginUser = async(req,res)=> {
    const {email, password} = req.body;
    const {data, error} = await supabaseAnonClient.auth.signInWithPassword({email, password});
    if(error) {
        console.log('Error de login:', error.message);
        return res.status(401).json({error: error.message});
    }
    res.json({session: data.session, user: data.user});
};


