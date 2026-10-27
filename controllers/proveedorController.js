const Proveedor = require('../models/Proveedor');
const { manejarError } = require('./errores');

exports.listar = async (req, res) => {
  try { res.json(await Proveedor.find()); } catch (err) { manejarError(res, err); }
};

exports.crear = async (req, res) => {
  try {
    res.status(201).json(await Proveedor.create({ nombre: req.body.nombre }));
  } catch (err) { manejarError(res, err); }
};
