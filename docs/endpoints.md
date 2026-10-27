# Documentación de endpoints

Base URL: `http://localhost:3000`. Todas las respuestas son JSON. Los identificadores son `ObjectId` de MongoDB (24 caracteres hexadecimales).

Errores comunes: `400` datos inválidos / identificador inválido, `404` recurso no encontrado, `500` error interno. Formato de error:

```json
{ "error": "Datos inválidos", "detalles": ["El precio debe ser positivo"] }
```

## Resumen

| Método | URL | Propósito |
|---|---|---|
| GET | `/api/empresa` | Consultar la empresa |
| POST | `/api/empresa` | Registrar o actualizar la empresa |
| GET | `/api/productos` | Listar productos |
| GET | `/api/productos/:id` | Consultar un producto |
| POST | `/api/productos` | Registrar un producto |
| GET | `/api/clientes` | Listar clientes |
| POST | `/api/clientes` | Registrar un cliente |
| GET | `/api/proveedores` | Listar proveedores |
| POST | `/api/proveedores` | Registrar un proveedor |
| GET | `/api/ventas` | Historial de ventas |
| GET | `/api/ventas/:id` | Consultar una venta |
| POST | `/api/ventas` | Registrar una venta |

---

## Empresa

### GET `/api/empresa`
Devuelve los datos de la empresa. Sin parámetros.

- **200**: `{ "_id": "65f0...0001", "nombre": "Tienda TecnoCompu" }`
- **404**: la empresa aún no está configurada.

### POST `/api/empresa`
Crea la empresa; si ya existe, actualiza su nombre.

Cuerpo: `{ "nombre": "Tienda TecnoCompu" }`

- **201**: empresa creada (mismo formato que GET).
- **200**: empresa existente actualizada.
- **400**: `nombre` ausente o vacío.

---

## Productos

### GET `/api/productos`
Lista los productos, con el nombre del proveedor poblado.

- **200**:
```json
[
  { "_id": "65f0...0004", "nombre": "Laptop Pro 15", "precio": 3200, "marca": "Lenovo",
    "categoria": "Computadora", "proveedor": { "_id": "65f0...0002", "nombre": "Distribuidora Andina" } }
]
```

### GET `/api/productos/:id`
Parámetro de ruta: `id` del producto.

- **200**: un producto (formato anterior).
- **400**: `id` con formato inválido.
- **404**: producto no existe.

### POST `/api/productos`
Cuerpo (`proveedor` es opcional):
```json
{
  "nombre": "Teclado mecánico",
  "precio": 150.5,
  "marca": "Redragon",
  "categoria": "Accesorio",
  "proveedor": "65f0...0002"
}
```
- **201**: producto creado.
- **400**: falta `nombre`, `marca` o `categoria`; `precio` ausente o ≤ 0; el proveedor indicado no existe.

---

## Clientes

### GET `/api/clientes`
- **200**: `[ { "_id": "65f0...0003", "nombre": "Ana Torres" } ]`

### POST `/api/clientes`
Cuerpo: `{ "nombre": "Luis Ramos" }`
- **201**: cliente creado.
- **400**: `nombre` ausente o vacío.

---

## Proveedores

### GET `/api/proveedores`
- **200**: `[ { "_id": "65f0...0002", "nombre": "Distribuidora Andina" } ]`

### POST `/api/proveedores`
Cuerpo: `{ "nombre": "Importaciones Lima" }`
- **201**: proveedor creado.
- **400**: `nombre` ausente o vacío.

---

## Ventas

### GET `/api/ventas`
Historial ordenado por fecha descendente, con el nombre del cliente y de cada producto poblados.

- **200**:
```json
[
  {
    "_id": "65f0...0005",
    "cliente": { "_id": "65f0...0003", "nombre": "Ana Torres" },
    "detalles": [
      { "producto": { "_id": "65f0...0004", "nombre": "Laptop Pro 15" }, "cantidad": 1, "precioUnitario": 3200, "subtotal": 3200 }
    ],
    "total": 3200,
    "fecha": "2026-10-27T15:00:00.000Z"
  }
]
```

### GET `/api/ventas/:id`
Parámetro de ruta: `id` de la venta.
- **200**: una venta (formato anterior).
- **400**: `id` inválido. **404**: venta no existe.

### POST `/api/ventas`
Cuerpo (`cliente` es opcional):
```json
{
  "cliente": "65f0...0003",
  "productos": [
    { "producto": "65f0...0004", "cantidad": 1 },
    { "producto": "65f0...0006", "cantidad": 2 }
  ]
}
```
- **201**: la venta registrada, con precios, subtotales y total calculados:
```json
{
  "_id": "65f0...0005",
  "cliente": "65f0...0003",
  "detalles": [
    { "producto": "65f0...0004", "cantidad": 1, "precioUnitario": 3200, "subtotal": 3200 },
    { "producto": "65f0...0006", "cantidad": 2, "precioUnitario": 45.5, "subtotal": 91 }
  ],
  "total": 3291,
  "fecha": "2026-10-27T15:00:00.000Z"
}
```
- **400**: `productos` ausente o vacío; `cantidad` no es entero positivo; el producto o el cliente no existe; identificador inválido.

Cualquier importe (`total`, `precio`, `subtotal`) enviado por el cliente se **ignora**.

#### Proceso de registro de una venta

1. Validar que `productos` sea un arreglo no vacío y que cada `cantidad` sea un entero positivo.
2. Si se indicó `cliente`, validar que exista (`Cliente.exists`).
3. Consultar en MongoDB los productos pedidos (`Producto.find({ _id: { $in: [...] } })`) y validar que todos existan.
4. Tomar `precioUnitario` del precio actual del producto en MongoDB.
5. Calcular `subtotal = precioUnitario × cantidad` por cada detalle.
6. Calcular `total = Σ subtotales` (redondeado a 2 decimales).
7. Guardar la venta con `Venta.create`, con los detalles embebidos.
8. Devolver la venta registrada con código 201.

**Consistencia:** como los detalles están embebidos, la venta es un único documento y MongoDB garantiza la atomicidad de su escritura: una operación fallida no deja registros parciales. No se necesitan transacciones multi-documento ni procedimientos almacenados; la lógica está en [`controllers/ventaController.js`](../controllers/ventaController.js).

Consultas clave equivalentes en MongoDB:

```js
// Historial de ventas de un cliente
db.ventas.find({ cliente: ObjectId("...") }).sort({ fecha: -1 })

// Total vendido por producto
db.ventas.aggregate([
  { $unwind: "$detalles" },
  { $group: { _id: "$detalles.producto", unidades: { $sum: "$detalles.cantidad" }, importe: { $sum: "$detalles.subtotal" } } }
])
```
