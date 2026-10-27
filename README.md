# Sistema de Venta de Computadoras

API REST y diseño de base de datos para la venta de computadoras, hecha con **Node.js, Express y MongoDB (Mongoose)**. Incluye el diseño conceptual, lógico y físico, el diccionario de datos, la documentación de endpoints, un seeder con datos de prueba y una colección de Postman.

> La base de datos es documental (MongoDB), por lo que los scripts DDL/DML relacionales se reemplazan por los esquemas Mongoose (`models/`) y el seeder (`seeders/seed.js`).

## Datos de identificación

- **Estudiante:** Raivel Lorenzo Valiente
- **Carrera:** _(completar)_
- **Asignatura:** _(completar)_
- **Repositorio:** https://github.com/Raivel16/sistema-venta-computadoras

## Requisitos

- Node.js y npm (`node -v`, `npm -v`)
- MongoDB local (`mongod --version`) o una cuenta de MongoDB Atlas

## Instalación y configuración

```bash
git clone https://github.com/Raivel16/sistema-venta-computadoras.git
cd sistema-venta-computadoras
npm install
cp .env.example .env
```

Contenido de `.env` (MongoDB local):

```dotenv
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017
DB_NAME=tienda_computadoras
```

Para Atlas, cambia `MONGODB_URI` por `mongodb+srv://usuario:clave@cluster.mongodb.net/`. `.env` no se sube a Git.

## Inicializar la base de datos (script de datos de prueba)

MongoDB crea la base y las colecciones al insertar documentos.

```bash
npm run seed
```

**Advertencia:** el seeder borra y reconstruye las colecciones; úsalo solo en una base de desarrollo o pruebas. Es repetible (no duplica datos). Carga 1 empresa, 2 proveedores, 2 clientes, 4 productos y 2 ventas con sus detalles.

## Ejecutar

```bash
npm start
```

La API queda en http://localhost:3000.

## Diseño de la base de datos

- [Diseño conceptual](docs/diseno-conceptual.md)
- [Diagrama Entidad-Relación](docs/diagrama-er.md)
- [Modelo lógico](docs/diseno-logico.md)
- [Modelo documental (físico)](docs/modelo-documental.md)
- [Diccionario de datos](docs/diccionario-datos.md)
- [Rutas / endpoints y proceso de venta](docs/endpoints.md)

## Rutas principales

| Método | Ruta |
|---|---|
| GET, POST | `/api/empresa` |
| GET, POST | `/api/productos` · GET `/api/productos/:id` |
| GET, POST | `/api/clientes` |
| GET, POST | `/api/proveedores` |
| GET, POST | `/api/ventas` · GET `/api/ventas/:id` |

Detalle completo en [docs/endpoints.md](docs/endpoints.md).

## Pruebas con Newman

Con el servidor en marcha y la base cargada con `npm run seed` (usa solo bases de desarrollo):

```bash
npx newman run tests/tienda.postman_collection.json
```

Prueba la consulta y registro de productos, consulta de clientes y proveedores, registro de venta (con total calculado por el servidor) e historial. Se espera que todas las aserciones pasen.

## Estructura

- `config/` conexión a MongoDB compartida por servidor y seeder
- `models/` esquemas Mongoose
- `controllers/` lógica de cada módulo
- `routes/` rutas por módulo
- `seeders/` datos de prueba
- `docs/` diseño de la base de datos y endpoints
- `tests/` colección de Postman
- `server.js` punto de entrada

## Solución de problemas

- **No conecta a MongoDB:** verifica que `mongod` esté activo y que `MONGODB_URI` sea correcto.
- **Faltan variables de entorno:** copia `.env.example` a `.env`.
- **Puerto ocupado:** cambia `PORT` en `.env`.
- **Faltan dependencias:** ejecuta `npm install`.
- **Falla Newman:** confirma que el servidor está corriendo y que ejecutaste `npm run seed`.
