import express from 'express';
import cors from 'cors';

const app = express();

//Almacenar las configuraciones de CORS en una variable
const corsOptions = {
    origin: 'http://localhost:3000', // Permitir solo solicitudes desde este origen
}

// Usar CORS con las opciones configuradas
app.use(cors(corsOptions));

// Obtener con express el origen de la solicitud y regresar un json 
// Endpoint que responde con un JSON
app.get('/', (req, res) => {
    res.json({ message: 'Hello, World!' });
});
//Configuración de express para escuchar en el puerto 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});