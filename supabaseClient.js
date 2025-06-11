const { createClient } = require("@supabase/supabase-js");
require('dotenv').config();

const supabaseConn = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE
 );  

 module.exports = supabaseConn;