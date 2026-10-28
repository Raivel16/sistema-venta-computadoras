const router = require('express').Router();
const c = require('../controllers/reporteController');

router.get('/productos-mas-vendidos', c.productosMasVendidos);
router.get('/ventas-por-cliente', c.ventasPorCliente);
router.get('/ventas-por-categoria', c.ventasPorCategoria);

module.exports = router;
