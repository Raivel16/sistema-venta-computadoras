const router = require('express').Router();
const c = require('../controllers/empresaController');

router.get('/', c.obtener);
router.post('/', c.configurar);

module.exports = router;
