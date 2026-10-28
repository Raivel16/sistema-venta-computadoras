const router = require('express').Router();
const c = require('../controllers/productoController');

router.get('/', c.listar);
router.get('/categoria/:tipo', c.listarPorCategoria); // antes de '/:id'
router.get('/:id', c.obtener);
router.post('/', c.crear);

module.exports = router;
