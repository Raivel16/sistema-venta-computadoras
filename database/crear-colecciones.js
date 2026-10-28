// Equivalente al script DDL: crea las colecciones con validadores $jsonSchema e índices.
// Ejecutar con mongosh (local o Atlas):
//   mongosh "mongodb://127.0.0.1:27017" --file database/crear-colecciones.js
// ADVERTENCIA: elimina y recrea las colecciones. Usar solo en una BD de desarrollo/pruebas.

const bd = db.getSiblingDB('tienda_computadoras');

const texto = { bsonType: 'string', minLength: 1 };
const positivo = { bsonType: 'number', minimum: 0.01 };

const colecciones = {
  empresa: { required: ['nombre'], properties: { nombre: texto } },
  proveedores: { required: ['nombre'], properties: { nombre: texto } },
  clientes: { required: ['nombre'], properties: { nombre: texto } },
  productos: {
    required: ['nombre', 'precio', 'marca', 'categoria'],
    properties: {
      nombre: texto,
      precio: positivo,
      marca: texto,
      categoria: texto,
      proveedor: { bsonType: 'objectId' }
    }
  },
  ventas: {
    required: ['detalles', 'total'],
    properties: {
      cliente: { bsonType: 'objectId' },
      detalles: {
        bsonType: 'array',
        minItems: 1,
        items: {
          bsonType: 'object',
          required: ['producto', 'cantidad', 'precioUnitario', 'subtotal'],
          properties: {
            producto: { bsonType: 'objectId' },
            cantidad: { bsonType: 'number', minimum: 1 },
            precioUnitario: positivo,
            subtotal: positivo
          }
        }
      },
      total: positivo,
      fecha: { bsonType: 'date' }
    }
  }
};

for (const [nombre, esquema] of Object.entries(colecciones)) {
  bd.getCollection(nombre).drop();
  bd.createCollection(nombre, {
    validator: { $jsonSchema: { bsonType: 'object', ...esquema } }
  });
  print(`Colección creada: ${nombre}`);
}

// Índices (los mismos que definen los modelos Mongoose)
bd.productos.createIndex({ proveedor: 1 });
bd.productos.createIndex({ categoria: 1 });
bd.ventas.createIndex({ fecha: -1 });
bd.ventas.createIndex({ cliente: 1 });
print('Índices creados.');
