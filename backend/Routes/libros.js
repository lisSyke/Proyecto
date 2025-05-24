
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // Para usar la API externa

const Libro = require('../models/Libro'); // Modelo para MongoDB

router.use(express.json());

/* ====================
   RUTAS LOCALES (MongoDB)
   ==================== */

// 1. Ruta API externa - Buscar libros en Open Library
// Nota: Se pone primero para evitar conflicto con rutas genéricas
router.get('/externo/buscar', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ mensaje: 'Se requiere un parámetro de búsqueda (?q=)' });
    }

    try {
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        // Seleccionamos solo algunos datos útiles
        const resultados = data.docs.slice(0, 10).map(book => ({
            titulo: book.title,
            autor: book.author_name?.join(', ') || 'Desconocido',
            año: book.first_publish_year || 'Desconocido',
            portada: book.cover_i 
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                : null,
            id_openlibrary: book.key
        }));

        res.json(resultados);
    } catch (error) {
        console.error('Error al buscar libros externos:', error);
        res.status(500).json({ mensaje: 'Error al consultar Open Library' });
    }
});

// 2. Lista de libros según su autor
router.get('/autor/:autor', async (req, res) => {
    try {
        const libros = await Libro.find({ autor: req.params.autor });
        if (libros.length === 0) {
            return res.status(404).json({ mensaje: 'Autor no encontrado' });
        }
        res.json(libros);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// 3. Según estado (leído, por leer, favorito, etc.)
router.get('/estado/:estado', async (req, res) => {
    try {
        const libros = await Libro.find({ estado: req.params.estado });
        if (libros.length === 0) {
            return res.status(404).json({ mensaje: 'Estado no encontrado o sin resultados' });
        }
        res.json(libros);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// 4. Según genero
router.get('/genero/:genero', async (req, res) => {
    try {
        const libros = await Libro.find({ categoria: req.params.categoria });
        if (libros.length === 0) {
            return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        }
        res.json(libros);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// 5. Obtener un libro específico según su título (última ruta GET porque es muy genérica)
router.get('/titulo/:titulo', async (req, res) => {
    try {
        const libro = await Libro.findOne({ titulo: req.params.titulo });
        if (!libro) {
            return res.status(404).json({ mensaje: 'Libro no encontrado' });
        }
        res.json(libro);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

/* ====================
   POST - Guardar libro en MongoDB
   ==================== */
router.post('/', async (req, res) => {
    try {
        const nuevoLibro = new Libro({
            usuario: req.body.usuario,
            titulo: req.body.titulo,
            autor: req.body.autor,
            genero: req.body.genero,
            descripcion: req.body.descripcion,
            estado: req.body.estado,
            calificacion: req.body.calificacion,
            comentarios: req.body.comentarios
        });

        const libroGuardado = await nuevoLibro.save();
        res.status(201).json({ mensaje: 'Libro guardado exitosamente', libro: libroGuardado });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al guardar el libro', error: error.message });
    }
});

/* ====================
   PUT - Actualizar libro
   ==================== */
router.put('/id/:id', async (req, res) => {
    try {
        const libroActualizado = await Libro.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!libroActualizado) {
            return res.status(404).json({ mensaje: 'Libro no encontrado' });
        }
        res.json({ mensaje: 'Libro actualizado correctamente', libro: libroActualizado });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

/* ====================
   DELETE - Eliminar libro
   ==================== */
router.delete('/id/:id', async (req, res) => {
    try {
        const libroEliminado = await Libro.findByIdAndDelete(req.params.id);
        if (!libroEliminado) {
            return res.status(404).json({ mensaje: 'Libro no encontrado' });
        }
        res.json({ mensaje: 'Libro eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

module.exports = router;
