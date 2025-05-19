const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  libro: { type: mongoose.Schema.Types.ObjectId, ref: 'Libro' },
  texto: { type: String },
  calificacion: { type: Number, min: 1, max: 5 },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comentario', comentarioSchema);

//Cambios github 19/05/2025