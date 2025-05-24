
const express = require('express');
const router = express.Router();
const Comentario = require('../Models/Comentario');

// Crear comentario
router.post('/', async (req, res) => {
  try {
    const nuevoComentario = new Comentario(req.body);
    await nuevoComentario.save();

    // Vincular el comentario al libro
    await Libro.findByIdAndUpdate(req.body.libro, {
      $push: { comentarios: nuevoComentario._id }
    });

    res.status(201).json({ mensaje: 'Comentario agregado exitosamente', comentario: nuevoComentario });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al guardar el comentario', error: error.message });
  }
});
// Obtener todos los comentarios
router.get('/', async (req, res) => {
  try {
    const comentarios = await Comentario.find().populate('usuario').populate('libro');
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener comentarios', error: error.message });
  }
});

// Obtener comentarios por libro
router.get('/libro/:id', async (req, res) => {
  try {
    const comentarios = await Comentario.find({ libro: req.params.id }).populate('usuario');
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener comentarios del libro', error: error.message });
  }
});

// Obtener comentarios por usuario
router.get('/usuario/:id', async (req, res) => {
  try {
    const comentarios = await Comentario.find({ usuario: req.params.id }).populate('libro');
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener comentarios del usuario', error: error.message });
  }
});

module.exports = router;
