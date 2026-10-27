const Venta = require('../models/Venta');
const Producto = require('../models/Producto');
const Cliente = require('../models/Cliente');
const { manejarError } = require('./errores');

const redondear = (n) => Math.round(n * 100) / 100;

exports.listar = async (req, res) => {
  try {
    const ventas = await Venta.find().sort({ fecha: -1 })
      .populate('cliente', 'nombre').populate('detalles.producto', 'nombre');
    res.json(ventas);
  } catch (err) { manejarError(res, err); }
};

exports.obtener = async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.id)
      .populate('cliente', 'nombre').populate('detalles.producto', 'nombre');
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
    res.json(venta);
  } catch (err) { manejarError(res, err); }
};

// Body: { cliente?: id, productos: [{ producto: id, cantidad: n }] }
// Precios, subtotales y total se calculan aquí; nunca se toman del cliente.
exports.crear = async (req, res) => {
  try {
    const { cliente, productos } = req.body;

    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'Debe enviar al menos un producto' });
    }
    for (const item of productos) {
      if (!Number.isInteger(item.cantidad) || item.cantidad <= 0) {
        return res.status(400).json({ error: 'Las cantidades deben ser enteros positivos' });
      }
    }
    if (cliente && !(await Cliente.exists({ _id: cliente }))) {
      return res.status(400).json({ error: 'El cliente indicado no existe' });
    }

    const encontrados = await Producto.find({ _id: { $in: productos.map((p) => p.producto) } });
    const porId = new Map(encontrados.map((p) => [p._id.toString(), p]));

    const detalles = [];
    for (const item of productos) {
      const producto = porId.get(String(item.producto));
      if (!producto) return res.status(400).json({ error: `El producto ${item.producto} no existe` });
      detalles.push({
        producto: producto._id,
        cantidad: item.cantidad,
        precioUnitario: producto.precio,
        subtotal: redondear(producto.precio * item.cantidad)
      });
    }
    const total = redondear(detalles.reduce((acc, d) => acc + d.subtotal, 0));

    // Un único documento con los detalles embebidos: el guardado es atómico.
    const venta = await Venta.create({ cliente, detalles, total });
    res.status(201).json(venta);
  } catch (err) { manejarError(res, err); }
};
