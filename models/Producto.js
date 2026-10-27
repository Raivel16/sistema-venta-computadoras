const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
  precio: { type: Number, required: [true, 'El precio es obligatorio'], min: [0.01, 'El precio debe ser positivo'] },
  marca: { type: String, required: [true, 'La marca es obligatoria'], trim: true },
  categoria: { type: String, required: [true, 'La categoría es obligatoria'], trim: true },
  proveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedor' }
});

productoSchema.index({ proveedor: 1 });

module.exports = mongoose.model('Producto', productoSchema, 'productos');
