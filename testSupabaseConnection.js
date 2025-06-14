const supabase = require('./supabaseClient')

const testConnection = async () => {
  const { data, error } = await supabase.auth.admin.listUsers()

  if (error) {
    console.log('Error de conexion')
  } else {
    console.log('Conexion exitosa')
  }
}
testConnection()

/*
archivo.env

#credenciales de supabase
SUPABASE_URL=https://csjdosnlaluuybcnlzaf.supabase.co
#llave secreta para permnisos de admin
SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzamRvc25sYWx1dXliY25semFmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODcyMDYyNSwiZXhwIjoyMDY0Mjk2NjI1fQ.7FgtujyR36kxB94JSjUZRi8r2_GPnCIJB-YXglURwsY
#llave public anonima (utilizar desde frontend)
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzamRvc25sYWx1dXliY25semFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MjA2MjUsImV4cCI6MjA2NDI5NjYyNX0.wBQitRMoV8OkkMR_5fk2qnBr1qbTKpgzEa2XFvjZvO8
PORT=3301

claves de acceso para yesser
*/
