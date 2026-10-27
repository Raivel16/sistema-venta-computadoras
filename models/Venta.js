const mongoose = require('mongoose');
const detalleVentaSchema = require('./DetalleVenta');

const ventaSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },
  detalles: {
    type: [detalleVentaSchema],
    validate: { validator: (d) => d.length > 0, message: 'La venta debe tener al menos un detalle' }
  },
  total: { type: Number, required: true, min: [0.01, 'El total debe ser positivo'] },
  fecha: { type: Date, default: Date.now }
});

ventaSchema.index({ fecha: -1 });
ventaSchema.index({ cliente: 1 });

module.exports = mongoose.model('Venta', ventaSchema, 'ventas');
