const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema({
  ID_libro: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario'},
  titulo: { type: String, required: true },
  autor: { type: String },
  genero: { type: String },
  descripcion: { type: String },
  estado: { type: String, enum: ['leído', 'por leer', 'en curso'], default: 'por leer' },
  fechaAgregado: { type: Date, default: Date.now },
  eliminado: { type: Boolean, default: false }, // Para la papelera
  calificacion: { type: Number, min: 1, max: 5 }, // Rating de 1 a 5
  comentarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comentario' }]
});

module.exports = mongoose.model('Libro', libroSchema);