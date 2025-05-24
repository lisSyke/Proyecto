const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Importar rutas correctamente
const librosRoutes = require('./Routes/libros');
const usuariosRoutes = require('./Routes/usuarios');
const comentariosRoutes = require('./Routes/comentarios');

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect('mongodb+srv://dbAllison:p65F5Ehu3xnNMIN8@cluster0.etk9sac.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch(err => console.error('Error al conectar MongoDB:', err));

// Ruta base (opcional)
app.get('/', (req, res) => {
  res.send('¡Bienvenido al backend de Orgalib!');
});

// Montar rutas principales en /libros
app.use('/libros', librosRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/comentarios', comentariosRoutes);


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



