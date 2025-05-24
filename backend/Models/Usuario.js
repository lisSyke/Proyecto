const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  correo: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true }, // Hasheada con bcrypt
  fechaRegistro: { type: Date, default: Date.now },
  libros: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Libro' }],

   // Categorías de libros
  favoritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Libro' }],
  leidos:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Libro' }],
  p_leer:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Libro' }]
});

module.exports = mongoose.model('Usuario', usuarioSchema);