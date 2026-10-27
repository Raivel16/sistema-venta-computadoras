const Cliente = require('../models/Cliente');
const { manejarError } = require('./errores');

exports.listar = async (req, res) => {
  try { res.json(await Cliente.find()); } catch (err) { manejarError(res, err); }
};

exports.crear = async (req, res) => {
  try {
    res.status(201).json(await Cliente.create({ nombre: req.body.nombre }));
  } catch (err) { manejarError(res, err); }
};
