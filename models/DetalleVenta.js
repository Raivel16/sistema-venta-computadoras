const mongoose = require('mongoose');

// Subdocumento embebido en Venta (no es una colección independiente): se guarda
// junto con la venta en un único documento, por lo que el registro es atómico.
const detalleVentaSchema = new mongoose.Schema({
  producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  cantidad: {
    type: Number,
    required: true,
    min: [1, 'La cantidad debe ser positiva'],
    validate: { validator: Number.isInteger, message: 'La cantidad debe ser un entero' }
  },
  precioUnitario: { type: Number, required: true, min: [0.01, 'El precio unitario debe ser positivo'] },
  subtotal: { type: Number, required: true, min: [0.01, 'El subtotal debe ser positivo'] }
}, { _id: false });

module.exports = detalleVentaSchema;
