const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true }
});

module.exports = mongoose.model('Cliente', clienteSchema, 'clientes');
