const supabase = require('./supabaseClient');

const testConnection = async() => {
    const {data, error} = await supabase.auth.admin.listUsers();

    if(error){
        console.log("Error de conexion")
    }else{
        console.log("Conexion exitosa")
    }

};
testConnection();