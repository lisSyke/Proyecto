const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario'); // Ajusta la ruta si es diferente
const bcrypt = require('bcrypt');


// Crear un nuevo usuario
router.post('/', async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    // Validar datos básicos
    if (!correo || !contraseña) {
      return res.status(400).json({ mensaje: 'Correo y contraseña son requeridos' });
    }

    // Verificar si ya existe un usuario con ese correo
    const existente = await Usuario.findOne({ correo });
    if (existente) {
      return res.status(409).json({ mensaje: 'El correo ya está registrado' });
    }

    // Hashear la contraseña
    const contraseñaHasheada = await bcrypt.hash(contraseña, 10);

    // Crear y guardar el usuario
    const nuevoUsuario = new Usuario({
      correo,
      contraseña: contraseñaHasheada,
    });

    await nuevoUsuario.save();

    res.status(201).json({
      mensaje: 'Usuario creado exitosamente',
      usuario: {
        id: nuevoUsuario._id,
        correo: nuevoUsuario.correo,
        fechaRegistro: nuevoUsuario.fechaRegistro,
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar usuario', error: error.message });
  }
});

// Obtener todos los usuarios (opcional)
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find().populate('libros');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
      return res.status(400).json({ mensaje: 'Correo y contraseña son requeridos' });
    }

    // Buscar usuario
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    // Comparar contraseña
    const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esValida) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    // Aquí puedes crear un token JWT o simplemente responder éxito
    res.json({ mensaje: 'Login exitoso', usuario: { id: usuario._id, correo: usuario.correo } });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el login', error: error.message });
  }
});

// Ruta para recuperar contraseña (simple, sin email)
router.post('/recuperar', async (req, res) => {
  try {
    const { correo, nuevaContraseña } = req.body;

    if (!correo || !nuevaContraseña) {
      return res.status(400).json({ mensaje: 'Correo y nueva contraseña son requeridos' });
    }

    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const contraseñaHasheada = await bcrypt.hash(nuevaContraseña, 10);
    usuario.contraseña = contraseñaHasheada;
    await usuario.save();

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al recuperar la contraseña', error: error.message });
  }
});

//PREFERENCIAS DEL USUARIO EN CUANTO A ESTADO O CATEGORIA DEL LIBRO

favoritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Libro' }]

// Agregar libro a favoritos de un usuario
router.post('/:idUsuario/favoritos/:idLibro', async (req, res) => {
  try {
    const { idUsuario, idLibro } = req.params;

    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Evitar duplicados
    if (!usuario.favoritos.includes(idLibro)) {
      usuario.favoritos.push(idLibro);
      await usuario.save();
    }

    res.status(200).json({ mensaje: 'Libro agregado a favoritos', favoritos: usuario.favoritos });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al agregar favorito', error: error.message });
  }
});

// Agregar libro a por leer de un usuario

p_leer: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Libro' }]

router.post('/:idUsuario/p_leer/:idLibro', async (req, res) => {
  try {
    const { idUsuario, idLibro } = req.params;

    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Evitar duplicados
    if (!usuario.p_leer.includes(idLibro)) {
      usuario.p_leer.push(idLibro);
      await usuario.save();
    }

    res.status(200).json({ mensaje: 'Libro agregado a por leer', p_leer: usuario.p_leer });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al agregar a por leer', error: error.message });
  }
});

// Agregar libro a leídos de un usuario

leidos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Libro' }]

router.post('/:idUsuario/leidos/:idLibro', async (req, res) => {
  try {
    const { idUsuario, idLibro } = req.params;

    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Evitar duplicados
    if (!usuario.leidos.includes(idLibro)) {
      usuario.leidos.push(idLibro);
      await usuario.save();
    }

    res.status(200).json({ mensaje: 'Libro agregado a leídos', leidos: usuario.leidos });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al agregar leídos', error: error.message });
  }
});

// Eliminar un libro de una categoría (favoritos, leido, porLeer)
router.delete('/:usuarioId/:categoria/:libroId', async (req, res) => {
  const { usuarioId, categoria, libroId } = req.params;

  const categoriasValidas = ['favoritos', 'leidos', 'p_leer'];
  if (!categoriasValidas.includes(categoria)) {
    return res.status(400).json({ mensaje: 'Categoría inválida' });
  }

  try {
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Remover el libro de la categoría
    usuario[categoria] = usuario[categoria].filter(id => id.toString() !== libroId);
    await usuario.save();

    res.json({ mensaje: `Libro eliminado de ${categoria}`, usuario });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el libro', error: error.message });
  }
});

module.exports = router;
