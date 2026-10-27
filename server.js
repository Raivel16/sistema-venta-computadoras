require('dotenv').config();
const express = require('express');
const { conectarDB } = require('./config/db');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.json({ mensaje: 'API Tienda de Computadoras', endpoints: '/api/*' }));
app.use('/api/empresa', require('./routes/empresaRoutes'));
app.use('/api/productos', require('./routes/productoRoutes'));
app.use('/api/clientes', require('./routes/clienteRoutes'));
app.use('/api/proveedores', require('./routes/proveedorRoutes'));
app.use('/api/ventas', require('./routes/ventaRoutes'));

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// JSON mal formado en el cuerpo de la solicitud
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON inválido' });
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;

conectarDB()
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Error al conectar con MongoDB:', err.message);
    process.exit(1);
  });
