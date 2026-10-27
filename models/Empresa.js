const mongoose = require('mongoose');

const empresaSchema = new mongoose.Schema({
  nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true }
});

module.exports = mongoose.model('Empresa', empresaSchema, 'empresa');
