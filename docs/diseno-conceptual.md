# Diseño conceptual

Representa las entidades y sus asociaciones, independientemente de la tecnología. La base de datos es **MongoDB** (`tienda_computadoras`).

## Entidades y atributos principales

| Entidad | Atributos | Descripción |
|---|---|---|
| Empresa | nombre | Datos de la tienda (un único registro). |
| Proveedor | nombre | Quien suministra productos. |
| Producto | nombre, precio, marca, categoria | Computadora, componente o accesorio a la venta. |
| Cliente | nombre | Persona que compra. |
| Venta | fecha, total | Operación de venta registrada. |
| Detalle de venta | cantidad, precioUnitario, subtotal | Línea de una venta correspondiente a un producto. |

## Relaciones y cardinalidades

- Un **proveedor** suministra de 0 a N **productos**. Un producto tiene 0 o 1 proveedor (**opcional**).
- Un **cliente** realiza de 0 a N **ventas**. Una venta tiene 0 o 1 cliente (**opcional**, permite ventas sin cliente registrado).
- Una **venta** contiene de 1 a N **detalles de venta** (al menos uno).
- Cada **detalle de venta** corresponde exactamente a 1 **producto**; un producto puede aparecer en 0 a N detalles.
- La **empresa** es independiente: no se relaciona con otras entidades (la tienda es única).

## Reglas de negocio

- `precio`, `cantidad`, `precioUnitario`, `subtotal` y `total` deben ser positivos.
- `precioUnitario` conserva el precio vigente al momento de la venta (historial), aunque el precio del producto cambie después.
- `subtotal = cantidad × precioUnitario` y `total = Σ subtotales`; ambos se calculan en el servidor.
- No se maneja inventario, autenticación ni compras a proveedores.
