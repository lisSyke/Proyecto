const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const librosRoutes = require('./Routes/libros');
app.use('/libros', librosRoutes)

app.get('/',(req, res)=>{
    res.send('¡Hola!'); //Luego poner algo formal, esto es solo una prueba
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.get('/libros',(req, res) => {
    console.log('Se recibió una solicitud GET');
    res.send('Lista de libros:')
})



app.put('/libros/:ID', (req, res) => {
    res.send(`Libro con ID ${req.params.ID} actualizado`);
});

app.post('/libros', (req, res) => {
    res.send('Nuevo libro agregado')
})

app.delete('/libros/:ID', (req, res)=>{
    res.send(`Libro con ID ${req.params.id} eliminado`);
});

