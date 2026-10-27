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
