const router = require('express').Router();
const c = require('../controllers/clienteController');

router.get('/', c.listar);
router.post('/', c.crear);

module.exports = router;
