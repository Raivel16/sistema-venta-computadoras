# Diseño lógico (MongoDB)

Transformación del [diseño conceptual](diseno-conceptual.md) a estructuras documentales.

## Colecciones

| Colección | Entidad | Notas |
|---|---|---|
| `empresa` | Empresa | Un único documento. |
| `proveedores` | Proveedor | |
| `productos` | Producto | Referencia opcional a `proveedores`. |
| `clientes` | Cliente | |
| `ventas` | Venta + Detalle de venta | Los detalles van **embebidos** en la venta. |

## Identificadores

Cada documento usa el `_id` (`ObjectId`) generado por MongoDB.

## Referencias entre documentos

- `productos.proveedor` → `proveedores._id` (opcional).
- `ventas.cliente` → `clientes._id` (opcional).
- `ventas.detalles[].producto` → `productos._id` (obligatorio).

## Documento embebido: detalles de venta

Un detalle no tiene sentido fuera de su venta, siempre se consulta con ella y su ciclo de vida es el mismo. Por eso se embebe como arreglo `detalles` dentro de `ventas` en lugar de una colección separada. Ventajas:

- Se guarda como **un único documento**, y las escrituras sobre un documento son atómicas: no pueden quedar ventas con detalles parciales.
- Una sola lectura recupera la venta completa.

El campo `precioUnitario` del detalle copia el precio del producto en el momento de la venta, para conservar el historial.

## Atributos y tipos

| Colección | Campo | Tipo |
|---|---|---|
| empresa | nombre | String |
| proveedores | nombre | String |
| clientes | nombre | String |
| productos | nombre, marca, categoria | String |
| productos | precio | Number |
| productos | proveedor | ObjectId (ref) |
| ventas | cliente | ObjectId (ref) |
| ventas | detalles | Array de subdocumentos |
| ventas | total | Number |
| ventas | fecha | Date |
| ventas.detalles | producto | ObjectId (ref) |
| ventas.detalles | cantidad, precioUnitario, subtotal | Number |

## Restricciones y validaciones

- Campos de texto obligatorios (`nombre`, `marca`, `categoria`) con `trim`.
- `precio`, `precioUnitario`, `subtotal`, `total` ≥ 0.01.
- `cantidad` entero ≥ 1.
- `detalles` debe tener al menos un elemento.
- Existencia de proveedor, cliente y productos verificada en los controladores antes de guardar.
- `subtotal` y `total` los calcula el servidor; los importes enviados por el cliente se ignoran.

## Justificación: embeber vs. referenciar

| Decisión | Razón |
|---|---|
| **Embeber** `detalles` en `ventas` | Un detalle no existe sin su venta, se lee siempre con ella y su cantidad es acotada. Una sola escritura atómica y una sola lectura para recuperar la venta. |
| **Referenciar** `productos` desde `detalles` | Los productos tienen vida propia y su precio cambia. Embeber el producto completo duplicaría datos; se referencia y solo se copia `precioUnitario` (historial). |
| **Referenciar** `cliente` en `ventas` | Un cliente tiene muchas ventas y se consulta por separado; embeber las ventas en el cliente haría crecer el documento sin límite. |
| **Referenciar** `proveedor` en `productos` | Un proveedor tiene muchos productos y sus datos no deben repetirse en cada uno. |
| Copiar `precioUnitario` y `subtotal` | Duplicación intencional: conserva el valor histórico de la venta aunque cambie `productos.precio`. |

Los reportes que cruzan colecciones usan `$lookup` (ver [endpoints](endpoints.md#reportes-aggregation-pipeline)).

## Índices

| Colección | Índice | Para qué |
|---|---|---|
| productos | `{ categoria: 1 }` | Buscar productos por categoría (`GET /api/productos/categoria/:tipo`). |
| productos | `{ proveedor: 1 }` | Productos de un proveedor. |
| ventas | `{ fecha: -1 }` | Historial y filtros por rango de fechas. |
| ventas | `{ cliente: 1 }` | Ventas de un cliente. |

No hay índice por código de barras o correo porque esos campos no existen en el modelo (se mantuvo sencillo).
