
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 5173;

//Almacenar las configuraciones de CORS en una variable
const corsOptions = {
    origin: `http://localhost:${port}`, // Permitir solo solicitudes desde este origen
}

// Usar CORS con las opciones configuradas
app.use(cors(corsOptions));

// Obtener con express el origen de la solicitud y regresar un json 
// Endpoint que responde con un JSON
app.get('/', (req, res) => {
    res.json({ message: 'Hello, World! from the serv' });
});

// Endpoint para obtener recetas
app.get('/recipes', (req, res) => {
    //Crear la ruta absoluta al archivo de recetas 
  const recipesPath = path.join(__dirname, 'data/recipes.json');
  // Leer el archivo de recetas de forma asincrona y devolver su contenido como JSON
  //fs- file system- para leer el archivo de recetas
  //uft8- para que el archivo se lea como texto y no como un buffer (datos binarios)
  fs.readFile(recipesPath, 'utf8', (err, data) => {
    if (err) {
        //Creación de error en la lectura del archivo
      return res.status(500).json({ error: 'No se pudo leer el archivo de recetas' });
    }
    try {
        // Parsear el contenido del archivo de recetas y devolverlo como JSON
      const json = JSON.parse(data);
      res.json(json.recetas);
    } catch (parseErr) {
        //Creación de error en json
      res.status(500).json({ error: 'Error al parsear el archivo de recetas' });
    }
  });
});

//Configuración de express para escuchar en el puerto 3000
app.listen(3000, () => {
  console.log(`Server is running on port 3000 (BE)`);
});