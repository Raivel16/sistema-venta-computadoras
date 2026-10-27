// Equivalente práctico al script DML de un proyecto relacional: carga datos iniciales.
// ADVERTENCIA: borra y reconstruye las colecciones. Usar solo en una BD de desarrollo/pruebas.
const mongoose = require('mongoose');
const { conectarDB } = require('../config/db');
const Empresa = require('../models/Empresa');
const Proveedor = require('../models/Proveedor');
const Cliente = require('../models/Cliente');
const Producto = require('../models/Producto');
const Venta = require('../models/Venta');

async function seed() {
  await conectarDB();
  console.warn(`ADVERTENCIA: se reemplazarán los datos de la base "${mongoose.connection.name}"`);

  await Promise.all([Empresa, Proveedor, Cliente, Producto, Venta].map((m) => m.deleteMany({})));

  await Empresa.create({ nombre: 'Tienda TecnoCompu' });

  const [provA, provB] = await Proveedor.create([
    { nombre: 'Distribuidora Andina' },
    { nombre: 'Importaciones Lima' }
  ]);
  const [cli1, cli2] = await Cliente.create([{ nombre: 'Ana Torres' }, { nombre: 'Luis Ramos' }]);

  const [laptop, mouse, ram, monitor] = await Producto.create([
    { nombre: 'Laptop Pro 15', precio: 3200, marca: 'Lenovo', categoria: 'Computadora', proveedor: provA._id },
    { nombre: 'Mouse inalámbrico', precio: 45.5, marca: 'Logitech', categoria: 'Accesorio', proveedor: provB._id },
    { nombre: 'Memoria RAM 16GB', precio: 220, marca: 'Kingston', categoria: 'Componente', proveedor: provA._id },
    { nombre: 'Monitor 24 pulgadas', precio: 650, marca: 'Samsung', categoria: 'Accesorio' }
  ]);

  const linea = (p, cantidad) => ({
    producto: p._id,
    cantidad,
    precioUnitario: p.precio,
    subtotal: p.precio * cantidad
  });
  const suma = (detalles) => detalles.reduce((acc, d) => acc + d.subtotal, 0);
  const detalles1 = [linea(laptop, 1), linea(mouse, 2)];
  const detalles2 = [linea(ram, 2), linea(monitor, 1)];

  await Venta.create([
    { cliente: cli1._id, detalles: detalles1, total: suma(detalles1) },
    { cliente: cli2._id, detalles: detalles2, total: suma(detalles2) }
  ]);

  console.log('Seed completado: 1 empresa, 2 proveedores, 2 clientes, 4 productos, 2 ventas');
}

seed()
  .catch((err) => {
    console.error('Error en el seeder:', err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
