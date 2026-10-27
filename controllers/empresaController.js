const Empresa = require('../models/Empresa');
const { manejarError } = require('./errores');

exports.obtener = async (req, res) => {
  try {
    const empresa = await Empresa.findOne();
    if (!empresa) return res.status(404).json({ error: 'La empresa no está configurada' });
    res.json(empresa);
  } catch (err) { manejarError(res, err); }
};

// Registra la empresa, o actualiza su nombre si ya existe (solo hay un documento).
exports.configurar = async (req, res) => {
  try {
    const existente = await Empresa.findOne();
    if (existente) {
      existente.nombre = req.body.nombre;
      await existente.save();
      return res.status(200).json(existente);
    }
    const empresa = await Empresa.create({ nombre: req.body.nombre });
    res.status(201).json(empresa);
  } catch (err) { manejarError(res, err); }
};
