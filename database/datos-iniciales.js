// Equivalente al script DML: inserta datos de prueba con insertMany().
// Ejecutar con mongosh después de crear-colecciones.js (o sobre una base vacía):
//   mongosh "mongodb://127.0.0.1:27017" --file database/datos-iniciales.js
// ADVERTENCIA: vacía las colecciones antes de insertar. Usar solo en una BD de desarrollo/pruebas.

const bd = db.getSiblingDB('tienda_computadoras');

['empresa', 'proveedores', 'clientes', 'productos', 'ventas'].forEach((c) => bd.getCollection(c).deleteMany({}));

const provA = ObjectId('65f000000000000000000011');
const provB = ObjectId('65f000000000000000000012');
const cli1 = ObjectId('65f000000000000000000021');
const cli2 = ObjectId('65f000000000000000000022');
const laptop = ObjectId('65f000000000000000000031');
const mouse = ObjectId('65f000000000000000000032');
const ram = ObjectId('65f000000000000000000033');
const monitor = ObjectId('65f000000000000000000034');

bd.empresa.insertOne({ nombre: 'Tienda TecnoCompu' });

bd.proveedores.insertMany([
  { _id: provA, nombre: 'Distribuidora Andina' },
  { _id: provB, nombre: 'Importaciones Lima' }
]);

bd.clientes.insertMany([
  { _id: cli1, nombre: 'Ana Torres' },
  { _id: cli2, nombre: 'Luis Ramos' }
]);

bd.productos.insertMany([
  { _id: laptop, nombre: 'Laptop Pro 15', precio: 3200, marca: 'Lenovo', categoria: 'Computadora', proveedor: provA },
  { _id: mouse, nombre: 'Mouse inalámbrico', precio: 45.5, marca: 'Logitech', categoria: 'Accesorio', proveedor: provB },
  { _id: ram, nombre: 'Memoria RAM 16GB', precio: 220, marca: 'Kingston', categoria: 'Componente', proveedor: provA },
  { _id: monitor, nombre: 'Monitor 24 pulgadas', precio: 650, marca: 'Samsung', categoria: 'Accesorio' }
]);

bd.ventas.insertMany([
  {
    cliente: cli1,
    detalles: [
      { producto: laptop, cantidad: 1, precioUnitario: 3200, subtotal: 3200 },
      { producto: mouse, cantidad: 2, precioUnitario: 45.5, subtotal: 91 }
    ],
    total: 3291,
    fecha: ISODate('2026-10-20T15:00:00Z')
  },
  {
    cliente: cli2,
    detalles: [
      { producto: ram, cantidad: 2, precioUnitario: 220, subtotal: 440 },
      { producto: monitor, cantidad: 1, precioUnitario: 650, subtotal: 650 }
    ],
    total: 1090,
    fecha: ISODate('2026-10-25T18:30:00Z')
  }
]);

print('Datos iniciales insertados.');
