# Sistema de Venta de Computadoras

API REST y modelo de base de datos documental para la venta de computadoras, hecha con **Node.js, Express y MongoDB (Mongoose)**. Incluye el diseño conceptual, lógico y físico, el diccionario de datos, validadores JSON Schema, scripts de datos de prueba, endpoints con reportes de *aggregation pipeline* y una colección de Postman.

## Datos de identificación

- **Estudiante:** Raivel Lorenzo Valiente
- **Carrera:** _(completar)_
- **Asignatura:** _(completar)_
- **Repositorio:** https://github.com/Raivel16/sistema-venta-computadoras

## Versiones

- **Mongoose:** 8.x (`^8.5.0` en `package.json`)
- **MongoDB:** servidor 6.0 o superior recomendado (compatible con el driver 6.x que usa Mongoose 8). No se probó con ninguna versión concreta.
- **Node.js:** 22 LTS o superior

## Requisitos

- Node.js y npm (`node -v`, `npm -v`)
- MongoDB local (`mongod --version`) **o** una cuenta de MongoDB Atlas
- Opcional: `mongosh` para los scripts de `database/`

## Instalación y conexión a la base de datos

```bash
git clone https://github.com/Raivel16/sistema-venta-computadoras.git
cd sistema-venta-computadoras
npm install
cp .env.example .env
```

**MongoDB local** (`.env`):

```dotenv
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017
DB_NAME=tienda_computadoras
```

**MongoDB Atlas:** crea un cluster, un usuario y permite tu IP; luego usa la cadena de conexión de Atlas:

```dotenv
MONGODB_URI=mongodb+srv://USUARIO:CLAVE@cluster0.xxxxx.mongodb.net/
DB_NAME=tienda_computadoras
```

`.env` no se sube a Git. Si la conexión falla, el servidor lo indica al arrancar.

## Scripts de datos (simulación / seeding)

MongoDB crea la base y las colecciones al insertar documentos. Hay dos opciones equivalentes; **ambas borran los datos de las colecciones, úsalas solo en bases de desarrollo o pruebas**.

**Opción A — Seeder con Mongoose** (usa `.env`):

```bash
npm run seed
```

**Opción B — Scripts `mongosh`** (carpeta [`database/`](database)):

```bash
mongosh "mongodb://127.0.0.1:27017" --file database/crear-colecciones.js   # colecciones, validadores $jsonSchema e índices
mongosh "mongodb://127.0.0.1:27017" --file database/datos-iniciales.js     # datos con insertMany()
```

Con Atlas, reemplaza la URI por la de tu cluster. Ambas cargan 1 empresa, 2 proveedores, 2 clientes, 4 productos y 2 ventas con sus detalles.

## Ejecutar

```bash
npm start
```

La API queda en http://localhost:3000.

## Modelado MongoDB (carpeta [`docs/`](docs) y [`models/`](models))

- [Diseño conceptual](docs/diseno-conceptual.md)
- [Diagrama E-R y diagrama del modelo de documentos](docs/diagrama-er.md)
- [Modelo lógico](docs/diseno-logico.md) — incluye la justificación de **embeber vs. referenciar** e índices
- [Modelo documental / físico](docs/modelo-documental.md) — ejemplos BSON, validadores JSON Schema
- [Diccionario de datos](docs/diccionario-datos.md)
- [Endpoints, reportes y proceso de venta](docs/endpoints.md)

Resumen de decisiones: los `detalles` de venta van **embebidos** en `ventas` (un solo documento, escritura atómica); `cliente`, `proveedor` y `producto` se **referencian** con `ObjectId`; `precioUnitario` se copia en cada detalle para conservar el historial.

## Rutas principales

| Método | Ruta |
|---|---|
| GET, POST | `/api/empresa` |
| GET, POST | `/api/productos` · GET `/api/productos/:id` · GET `/api/productos/categoria/:tipo` |
| GET, POST | `/api/clientes` |
| GET, POST | `/api/proveedores` |
| GET, POST | `/api/ventas` · GET `/api/ventas/:id` |
| GET | `/api/reportes/productos-mas-vendidos` · `/ventas-por-cliente` · `/ventas-por-categoria` |

Los reportes usan `$match`, `$unwind`, `$group`, `$lookup`, `$sort`, `$limit` y `$project`. Detalle completo en [docs/endpoints.md](docs/endpoints.md).

## Pruebas con Newman

Con el servidor en marcha y la base cargada con los datos de prueba (solo bases de desarrollo):

```bash
npx newman run tests/tienda.postman_collection.json
```

Cubre productos (incluida la búsqueda por categoría), clientes, proveedores, registro de venta con total calculado en el servidor, historial y reportes. Se espera que todas las aserciones pasen.

## Estructura

- `config/` conexión a MongoDB compartida por servidor y seeder
- `models/` esquemas Mongoose
- `controllers/` lógica de cada módulo (incluye reportes)
- `routes/` rutas por módulo
- `seeders/` datos de prueba con Mongoose
- `database/` scripts `mongosh`: colecciones, validadores, índices y datos
- `docs/` diseño de la base de datos y endpoints
- `tests/` colección de Postman
- `server.js` punto de entrada

## Solución de problemas

- **No conecta a MongoDB:** verifica que `mongod` esté activo (o la IP permitida en Atlas) y que `MONGODB_URI` sea correcto.
- **Faltan variables de entorno:** copia `.env.example` a `.env`.
- **Puerto ocupado:** cambia `PORT` en `.env`.
- **Faltan dependencias:** ejecuta `npm install`.
- **Falla Newman:** confirma que el servidor está corriendo y que cargaste los datos de prueba.
