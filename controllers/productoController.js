const Producto = require('../models/Producto');
const Proveedor = require('../models/Proveedor');
const { manejarError } = require('./errores');

exports.listar = async (req, res) => {
  try {
    res.json(await Producto.find().populate('proveedor', 'nombre'));
  } catch (err) { manejarError(res, err); }
};

exports.obtener = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id).populate('proveedor', 'nombre');
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) { manejarError(res, err); }
};

exports.crear = async (req, res) => {
  try {
    const { nombre, precio, marca, categoria, proveedor } = req.body;
    if (proveedor && !(await Proveedor.exists({ _id: proveedor }))) {
      return res.status(400).json({ error: 'El proveedor indicado no existe' });
    }
    const producto = await Producto.create({ nombre, precio, marca, categoria, proveedor });
    res.status(201).json(producto);
  } catch (err) { manejarError(res, err); }
};
