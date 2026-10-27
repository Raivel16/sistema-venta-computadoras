# Diccionario de datos

Todos los documentos incluyen `_id` (`ObjectId`, generado por MongoDB, obligatorio, único).

## Empresa (`empresa`)

| Campo | Tipo | Descripción | Oblig. | Ejemplo | Validaciones | Referencia |
|---|---|---|---|---|---|---|
| nombre | String | Nombre de la tienda | Sí | `Tienda TecnoCompu` | `trim` | — |

## Proveedor (`proveedores`)

| Campo | Tipo | Descripción | Oblig. | Ejemplo | Validaciones | Referencia |
|---|---|---|---|---|---|---|
| nombre | String | Nombre del proveedor | Sí | `Distribuidora Andina` | `trim` | — |

## Cliente (`clientes`)

| Campo | Tipo | Descripción | Oblig. | Ejemplo | Validaciones | Referencia |
|---|---|---|---|---|---|---|
| nombre | String | Nombre del cliente | Sí | `Ana Torres` | `trim` | — |

## Producto (`productos`)

| Campo | Tipo | Descripción | Oblig. | Ejemplo | Validaciones | Referencia |
|---|---|---|---|---|---|---|
| nombre | String | Nombre de la computadora, componente o accesorio | Sí | `Laptop Pro 15` | `trim` | — |
| precio | Number | Precio unitario de venta | Sí | `3200` | ≥ 0.01 | — |
| marca | String | Marca del producto | Sí | `Lenovo` | `trim` | — |
| categoria | String | Tipo de producto | Sí | `Computadora` | `trim` | — |
| proveedor | ObjectId | Proveedor que lo suministra | No | `65f0...0002` | Debe existir (controlador) | `proveedores` |

## Venta (`ventas`)

| Campo | Tipo | Descripción | Oblig. | Ejemplo | Validaciones | Referencia |
|---|---|---|---|---|---|---|
| cliente | ObjectId | Cliente que compra | No | `65f0...0003` | Debe existir (controlador) | `clientes` |
| detalles | Array de DetalleVenta | Líneas de la venta (embebidas) | Sí | ver abajo | Al menos 1 elemento | — |
| total | Number | Importe total (suma de subtotales, calculado en servidor) | Sí | `3291` | ≥ 0.01 | — |
| fecha | Date | Fecha de registro | No (por defecto `Date.now`) | `2026-10-27T15:00:00Z` | — | — |

## Detalle de venta (subdocumento de `ventas.detalles`, sin `_id` propio)

| Campo | Tipo | Descripción | Oblig. | Ejemplo | Validaciones | Referencia |
|---|---|---|---|---|---|---|
| producto | ObjectId | Producto vendido | Sí | `65f0...0004` | Debe existir (controlador) | `productos` |
| cantidad | Number | Unidades vendidas | Sí | `2` | Entero ≥ 1 | — |
| precioUnitario | Number | Precio del producto al momento de la venta (copiado por el servidor) | Sí | `45.5` | ≥ 0.01 | — |
| subtotal | Number | `cantidad × precioUnitario` (calculado en servidor) | Sí | `91` | ≥ 0.01 | — |
