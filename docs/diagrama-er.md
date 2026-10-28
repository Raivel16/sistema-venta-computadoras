# Diagrama Entidad-Relación (conceptual)

Es una **representación conceptual** de los datos y sus asociaciones usando notación E-R tradicional. No implica que MongoDB use tablas ni llaves foráneas: en MongoDB las asociaciones se implementan con referencias `ObjectId` y un documento embebido (ver [modelo lógico](diseno-logico.md)).

```mermaid
erDiagram
    EMPRESA {
        string nombre
    }
    PROVEEDOR {
        string nombre
    }
    PRODUCTO {
        string nombre
        number precio
        string marca
        string categoria
    }
    CLIENTE {
        string nombre
    }
    VENTA {
        date fecha
        number total
    }
    DETALLE_VENTA {
        number cantidad
        number precioUnitario
        number subtotal
    }

    PROVEEDOR |o--o{ PRODUCTO : "suministra"
    CLIENTE |o--o{ VENTA : "realiza"
    VENTA ||--|{ DETALLE_VENTA : "contiene"
    PRODUCTO ||--o{ DETALLE_VENTA : "se vende en"
```

`EMPRESA` no tiene relaciones: representa a la tienda (documento único).

---

# Diagrama del modelo de documentos (MongoDB)

Muestra cómo quedan las colecciones. Las flechas punteadas son **referencias** por `ObjectId` (no son llaves foráneas relacionales: MongoDB no las impone); el bloque `detalles[]` está **embebido** dentro de `ventas`.

```mermaid
classDiagram
    class empresa {
        ObjectId _id
        String nombre
    }
    class proveedores {
        ObjectId _id
        String nombre
    }
    class clientes {
        ObjectId _id
        String nombre
    }
    class productos {
        ObjectId _id
        String nombre
        Number precio
        String marca
        String categoria
        ObjectId proveedor
    }
    class ventas {
        ObjectId _id
        ObjectId cliente
        Date fecha
        Number total
        detalles[] embebido
    }
    class detalles {
        ObjectId producto
        Number cantidad
        Number precioUnitario
        Number subtotal
    }

    productos ..> proveedores : proveedor (ref, opcional)
    ventas ..> clientes : cliente (ref, opcional)
    ventas *-- detalles : embebe 1..N
    detalles ..> productos : producto (ref)
```
