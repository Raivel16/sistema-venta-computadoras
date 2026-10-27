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
