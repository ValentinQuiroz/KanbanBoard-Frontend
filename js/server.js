const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const puerto = 3000;

// Configurar CORS
app.use(cors({
    origin: true,
    credentials: true
}));

// Servir archivos estáticos desde la raiz
app.use(express.static(path.join(__dirname, '..')));

// Ruta principal que sirve el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'index.html'));
});

// Iniciar el servidor
app.listen(puerto, () => {
    console.log(`Servidor corriendo en http://localhost:${puerto}`);
});
