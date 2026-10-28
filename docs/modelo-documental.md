# Modelo documental (físico) — MongoDB + Mongoose

Base de datos: `tienda_computadoras`. Los modelos están en [`models/`](../models). MongoDB crea la base y las colecciones al insertar el primer documento (por ejemplo con `npm run seed`).

## Tipos usados

- `String`, `Number`, `Date`.
- `ObjectId` (`mongoose.Schema.Types.ObjectId`) para `_id` y referencias (`ref`).
- Arreglo de subdocumentos (`detalles`).

## Ejemplos de documentos

**empresa**
```json
{ "_id": { "$oid": "65f000000000000000000001" }, "nombre": "Tienda TecnoCompu" }
```

**proveedores**
```json
{ "_id": { "$oid": "65f000000000000000000002" }, "nombre": "Distribuidora Andina" }
```

**clientes**
```json
{ "_id": { "$oid": "65f000000000000000000003" }, "nombre": "Ana Torres" }
```

**productos**
```json
{
  "_id": { "$oid": "65f000000000000000000004" },
  "nombre": "Laptop Pro 15",
  "precio": 3200,
  "marca": "Lenovo",
  "categoria": "Computadora",
  "proveedor": { "$oid": "65f000000000000000000002" }
}
```

**ventas** (detalles embebidos)
```json
{
  "_id": { "$oid": "65f000000000000000000005" },
  "cliente": { "$oid": "65f000000000000000000003" },
  "detalles": [
    { "producto": { "$oid": "65f000000000000000000004" }, "cantidad": 1, "precioUnitario": 3200, "subtotal": 3200 },
    { "producto": { "$oid": "65f000000000000000000006" }, "cantidad": 2, "precioUnitario": 45.5, "subtotal": 91 }
  ],
  "total": 3291,
  "fecha": { "$date": "2026-10-27T15:00:00Z" }
}
```

## Índices

| Colección | Índice | Utilidad |
|---|---|---|
| productos | `{ proveedor: 1 }` | Consultar productos de un proveedor. |
| ventas | `{ fecha: -1 }` | Historial ordenado de más reciente a más antigua. |
| ventas | `{ cliente: 1 }` | Consultar ventas de un cliente. |

## Validaciones

Definidas en los esquemas Mongoose (`required`, `min`, `validate`); detalladas en el [diccionario de datos](diccionario-datos.md).

## Atomicidad de la venta

Venta y detalles se guardan como un solo documento con `Venta.create(...)`, operación atómica sobre ese documento; por eso no se requieren transacciones multi-documento.

## Validadores JSON Schema (MongoDB)

Además de las validaciones de Mongoose, [`database/crear-colecciones.js`](../database/crear-colecciones.js) crea las colecciones con validadores `$jsonSchema` (`bsonType`, `required`, `minimum`, `minItems`) y los índices, para que la propia base rechace documentos inválidos. Se ejecuta con `mongosh`. Los datos de prueba equivalentes con `insertMany()` están en [`database/datos-iniciales.js`](../database/datos-iniciales.js).

Índice adicional: `productos { categoria: 1 }`.
