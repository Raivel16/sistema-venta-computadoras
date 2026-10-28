const Venta = require('../models/Venta');
const { manejarError } = require('./errores');

// Etapa $match opcional por rango de fechas (?desde=2026-10-01&hasta=2026-10-31).
// Devuelve null si alguna fecha es inválida.
function filtroFechas(query) {
  const fecha = {};
  if (query.desde) fecha.$gte = new Date(query.desde);
  if (query.hasta) fecha.$lte = new Date(query.hasta);
  if (Object.values(fecha).some((d) => isNaN(d))) return null;
  return Object.keys(fecha).length ? [{ $match: { fecha } }] : [];
}

// GET /api/reportes/productos-mas-vendidos?limit=5
exports.productosMasVendidos = async (req, res) => {
  try {
    const match = filtroFechas(req.query);
    if (!match) return res.status(400).json({ error: 'Fecha inválida en desde/hasta' });
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 5);

    const resultado = await Venta.aggregate([
      ...match,
      { $unwind: '$detalles' },
      { $group: {
        _id: '$detalles.producto',
        unidades: { $sum: '$detalles.cantidad' },
        importe: { $sum: '$detalles.subtotal' }
      } },
      { $sort: { unidades: -1 } },
      { $limit: limit },
      { $lookup: { from: 'productos', localField: '_id', foreignField: '_id', as: 'producto' } },
      { $unwind: '$producto' },
      { $project: { _id: 0, producto: '$producto._id', nombre: '$producto.nombre', categoria: '$producto.categoria', unidades: 1, importe: 1 } }
    ]);
    res.json(resultado);
  } catch (err) { manejarError(res, err); }
};

// GET /api/reportes/ventas-por-cliente
exports.ventasPorCliente = async (req, res) => {
  try {
    const match = filtroFechas(req.query);
    if (!match) return res.status(400).json({ error: 'Fecha inválida en desde/hasta' });

    const resultado = await Venta.aggregate([
      ...match,
      { $match: { cliente: { $ne: null } } },
      { $group: { _id: '$cliente', ventas: { $sum: 1 }, totalComprado: { $sum: '$total' } } },
      { $sort: { totalComprado: -1 } },
      { $lookup: { from: 'clientes', localField: '_id', foreignField: '_id', as: 'cliente' } },
      { $unwind: '$cliente' },
      { $project: { _id: 0, cliente: '$cliente._id', nombre: '$cliente.nombre', ventas: 1, totalComprado: 1 } }
    ]);
    res.json(resultado);
  } catch (err) { manejarError(res, err); }
};

// GET /api/reportes/ventas-por-categoria
exports.ventasPorCategoria = async (req, res) => {
  try {
    const match = filtroFechas(req.query);
    if (!match) return res.status(400).json({ error: 'Fecha inválida en desde/hasta' });

    const resultado = await Venta.aggregate([
      ...match,
      { $unwind: '$detalles' },
      { $lookup: { from: 'productos', localField: 'detalles.producto', foreignField: '_id', as: 'producto' } },
      { $unwind: '$producto' },
      { $group: {
        _id: '$producto.categoria',
        unidades: { $sum: '$detalles.cantidad' },
        importe: { $sum: '$detalles.subtotal' }
      } },
      { $sort: { importe: -1 } },
      { $project: { _id: 0, categoria: '$_id', unidades: 1, importe: 1 } }
    ]);
    res.json(resultado);
  } catch (err) { manejarError(res, err); }
};
