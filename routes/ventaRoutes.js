const router = require('express').Router();
const c = require('../controllers/ventaController');

router.get('/', c.listar);
router.get('/:id', c.obtener);
router.post('/', c.crear);

module.exports = router;
