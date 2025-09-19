# Documentación de la API de Pagos Bob Subastas

Esta documentación describe la estructura de los modelos y los endpoints disponibles en la API de Pagos Bob Subastas.

## Modelos

### Subastas

```prisma
model Subastas{
  idSubasta     Int      @id @default(autoincrement())
  titulo        String
  imgSubasta    String?
  placaVehiculo String
  empresa       String
  fecha         DateTime
  moneda        String
  monto         Decimal
  descripcion   String?
  estado        String
  createdAt     DateTime @default(now())
  updatedAt     DateTime?
  canceledAt    DateTime?
}
```

### Clientes

```prisma
model Clientes {
  idCliente         Int      @id @default(autoincrement())
  correo            String
  nombreCompleto    String
  tipDocumento     String
  numDocumento     String
  numCelular       String
  saldoTotalDolar  Decimal    @default(0)
  dtFacRuc         String
  dtFacRazonSocial String
  activo           Boolean    @default(true)
  createdAt        DateTime    @default(now())
  updatedAt        DateTime?
  canceledAt       DateTime?
}
```

### Garantias

```prisma
model Garantias {
  idGarantia        Int      @id @default(autoincrement())
  idSubasta         Int
  idCliente         Int
  concepto          String
  fechaSubasta      DateTime
  fechaExpiracion   DateTime
  tipo              String
  moneda            String
  montoGarantia     Decimal
  banco             String
  numCuentaDeposito String
  docAdjunto        String
  comentarios       String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime?
  paidAt            DateTime?
  validatedAt       DateTime?
  invalidatedAt     DateTime?
  revokedAt         DateTime?
}
```

### Reembolsos

```prisma
model Reembolsos{
  idReembolso       Int      @id @default(autoincrement())
  idCliente         Int
  monto             Decimal
  banco             String
  numCuentaDeposito String
  docAdjunto        String?
  comentarios       String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime?
  validatedAt       DateTime?
  revokedAt         DateTime?
}
```

### Facturacion

```prisma
model Facturacion{
  idFacturacion     Int      @id @default(autoincrement())
  idCliente         Int
  idSubasta         Int
  monto             Decimal
  banco             String
  numCuentaDeposito String
  docAdjunto        String?
  concepto          String
  comentarios       String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime?
  validatedAt       DateTime?
  revokedAt         DateTime?
}
```

## Endpoints

### Clientes

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `/api/clientes` | Obtiene todos los clientes |
| GET | `/api/clientes/:id` | Obtiene un cliente por su ID |
| POST | `/api/clientes` | Crea un nuevo cliente |
| PUT | `/api/clientes/:id` | Actualiza un cliente existente |
| DELETE | `/api/clientes/:id` | Elimina un cliente |
| PATCH | `/api/clientes/:id` | Cambia el estado de un cliente |

#### Estructura de datos para crear/actualizar un cliente

```json
{
  "correo": "cliente@ejemplo.com",
  "nombreCompleto": "Nombre Completo",
  "tipDocumento": "DNI",
  "numDocumento": "12345678",
  "numCelular": "987654321",
  "saldoTotalDolar": 0,
  "dtFacRuc": "20123456789",
  "dtFacRazonSocial": "Empresa S.A.C",
  "activo": true
}
```

### Subastas

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `/api/subastas` | Obtiene todas las subastas |
| GET | `/api/subastas/:id` | Obtiene una subasta por su ID |
| POST | `/api/subastas` | Crea una nueva subasta |
| PUT | `/api/subastas/:id` | Actualiza una subasta existente |
| DELETE | `/api/subastas/:id` | Elimina una subasta |

#### Estructura de datos para crear/actualizar una subasta

```json
{
  "titulo": "Subasta de vehículo",
  "imgSubasta": "url_de_la_imagen.jpg",
  "placaVehiculo": "ABC-123",
  "empresa": "Empresa Subastadora",
  "fecha": "2023-06-15T14:00:00Z",
  "moneda": "USD",
  "monto": 5000,
  "descripcion": "Descripción detallada de la subasta",
  "estado": "activa"
}
```

### Garantías

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `/api/garantias` | Obtiene todas las garantías |
| GET | `/api/garantias/:id` | Obtiene una garantía por su ID |
| POST | `/api/garantias` | Crea una nueva garantía |
| PUT | `/api/garantias/:id` | Actualiza una garantía existente |
| PATCH | `/api/garantias/:id/validate` | Valida una garantía |
| PATCH | `/api/garantias/:id/paid` | Marca una garantía como pagada |
| PATCH | `/api/garantias/:id/invalid` | Invalida una garantía |
| PATCH | `/api/garantias/:id/revoke` | Revoca una garantía |

#### Estructura de datos para crear/actualizar una garantía

```json
{
  "idSubasta": 1,
  "idCliente": 1,
  "concepto": "Garantía para subasta",
  "fechaSubasta": "2023-06-15T14:00:00Z",
  "fechaExpiracion": "2023-07-15T14:00:00Z",
  "tipo": "deposito",
  "moneda": "USD",
  "montoGarantia": 500,
  "banco": "Banco XYZ",
  "numCuentaDeposito": "123-456-789",
  "docAdjunto": "url_del_documento.pdf",
  "comentarios": "Comentarios adicionales"
}
```

### Reembolsos

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `/api/reembolsos` | Obtiene todos los reembolsos |
| GET | `/api/reembolsos/:id` | Obtiene un reembolso por su ID |
| POST | `/api/reembolsos` | Crea un nuevo reembolso |
| PUT | `/api/reembolsos/:id` | Actualiza un reembolso existente |
| PUT | `/api/reembolsos/:id/validate` | Aprueba un reembolso |
| PUT | `/api/reembolsos/:id/revoke` | Revoca un reembolso |

#### Estructura de datos para crear/actualizar un reembolso

```json
{
  "idCliente": 1,
  "monto": 300,
  "banco": "Banco ABC",
  "numCuentaDeposito": "987-654-321",
  "docAdjunto": "url_del_documento.pdf",
  "comentarios": "Comentarios sobre el reembolso"
}
```

### Facturación

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `/api/facturacion` | Obtiene todas las facturaciones |
| GET | `/api/facturacion/:id` | Obtiene una facturación por su ID |
| POST | `/api/facturacion` | Crea una nueva facturación |
| PUT | `/api/facturacion/:id` | Actualiza una facturación existente |
| PATCH | `/api/facturacion/:id/validate` | Valida una facturación |
| PATCH | `/api/facturacion/:id/revoke` | Revoca una facturación |

#### Estructura de datos para crear/actualizar una facturación

```json
{
  "idCliente": 1,
  "idSubasta": 1,
  "monto": 1000,
  "banco": "Banco DEF",
  "numCuentaDeposito": "456-789-123",
  "docAdjunto": "url_del_documento.pdf",
  "concepto": "Pago de subasta",
  "comentarios": "Comentarios sobre la facturación"
}
```

## Respuestas de la API

Todas las respuestas de la API siguen la siguiente estructura:

### Respuesta exitosa

```json
{
  "success": true,
  "data": {}, // Datos solicitados o creados/actualizados
  "message": "Mensaje descriptivo del resultado"
}
```

### Respuesta de error

```json
{
  "success": false,
  "message": "Mensaje descriptivo del error",
  "error": "Detalles técnicos del error (opcional)"
}
```

### Ejemplos de respuestas por tipo de operación

#### GET (Obtener todos los recursos)

```json
{
  "success": true,
  "data": [
    {
      "idCliente": 1,
      "correo": "cliente@ejemplo.com",
      "nombreCompleto": "Nombre Completo",
      "tipDocumento": "DNI",
      "numDocumento": "12345678",
      "numCelular": "987654321",
      "saldoTotalDolar": 0,
      "dtFacRuc": "20123456789",
      "dtFacRazonSocial": "Empresa S.A.C",
      "activo": true,
      "createdAt": "2023-06-15T14:00:00Z",
      "updatedAt": null,
      "canceledAt": null
    },
    // Más elementos...
  ],
  "message": "Clientes obtenidos correctamente"
}
```

#### GET (Obtener un recurso por ID)

```json
{
  "success": true,
  "data": {
    "idSubasta": 1,
    "titulo": "Subasta de vehículo",
    "imgSubasta": "url_de_la_imagen.jpg",
    "placaVehiculo": "ABC-123",
    "empresa": "Empresa Subastadora",
    "fecha": "2023-06-15T14:00:00Z",
    "moneda": "USD",
    "monto": 5000,
    "descripcion": "Descripción detallada de la subasta",
    "estado": "activa",
    "createdAt": "2023-06-01T10:00:00Z",
    "updatedAt": null,
    "canceledAt": null
  },
  "message": "Subasta obtenida correctamente"
}
```

#### POST (Crear un recurso)

```json
{
  "success": true,
  "data": {
    "idGarantia": 1,
    "idSubasta": 1,
    "idCliente": 1,
    "concepto": "Garantía para subasta",
    "fechaSubasta": "2023-06-15T14:00:00Z",
    "fechaExpiracion": "2023-07-15T14:00:00Z",
    "tipo": "deposito",
    "moneda": "USD",
    "montoGarantia": 500,
    "banco": "Banco XYZ",
    "numCuentaDeposito": "123-456-789",
    "docAdjunto": "url_del_documento.pdf",
    "comentarios": "Comentarios adicionales",
    "createdAt": "2023-06-10T09:30:00Z",
    "updatedAt": null,
    "paidAt": null,
    "validatedAt": null,
    "invalidatedAt": null,
    "revokedAt": null
  },
  "message": "Garantía creada correctamente"
}
```

#### PUT (Actualizar un recurso)

```json
{
  "success": true,
  "data": {
    "idReembolso": 1,
    "idCliente": 1,
    "monto": 350,
    "banco": "Banco ABC Actualizado",
    "numCuentaDeposito": "987-654-321",
    "docAdjunto": "url_del_documento_actualizado.pdf",
    "comentarios": "Comentarios actualizados sobre el reembolso",
    "createdAt": "2023-06-05T11:20:00Z",
    "updatedAt": "2023-06-12T16:45:00Z",
    "validatedAt": null,
    "revokedAt": null
  },
  "message": "Reembolso actualizado correctamente"
}
```

#### PATCH (Operaciones específicas)

```json
{
  "success": true,
  "data": {
    "idFacturacion": 1,
    "idCliente": 1,
    "idSubasta": 1,
    "monto": 1000,
    "banco": "Banco DEF",
    "numCuentaDeposito": "456-789-123",
    "docAdjunto": "url_del_documento.pdf",
    "concepto": "Pago de subasta",
    "comentarios": "Comentarios sobre la facturación",
    "createdAt": "2023-06-20T10:15:00Z",
    "updatedAt": "2023-06-22T14:30:00Z",
    "validatedAt": "2023-06-22T14:30:00Z",
    "revokedAt": null
  },
  "message": "Facturación validada correctamente"
}
```

#### DELETE (Eliminar un recurso)

```json
{
  "success": true,
  "data": {
    "idCliente": 1,
    "correo": "cliente@ejemplo.com",
    "nombreCompleto": "Nombre Completo",
    "tipDocumento": "DNI",
    "numDocumento": "12345678",
    "numCelular": "987654321",
    "saldoTotalDolar": 0,
    "dtFacRuc": "20123456789",
    "dtFacRazonSocial": "Empresa S.A.C",
    "activo": false,
    "createdAt": "2023-06-15T14:00:00Z",
    "updatedAt": "2023-06-25T09:10:00Z",
    "canceledAt": "2023-06-25T09:10:00Z"
  },
  "message": "Cliente eliminado correctamente"
}
```

#### Respuesta de error (Recurso no encontrado)

```json
{
  "success": false,
  "message": "Subasta con ID 999 no encontrada"
}
```

#### Respuesta de error (Datos inválidos)

```json
{
  "success": false,
  "message": "Los campos idCliente, monto, banco y numCuentaDeposito son obligatorios"
}
```

#### Respuesta de error (Error del servidor)

```json
{
  "success": false,
  "message": "Error al obtener garantías",
  "error": "Error de conexión con la base de datos"
}
```

## Códigos de estado HTTP

- `200 OK`: La solicitud se ha completado correctamente
- `201 Created`: El recurso se ha creado correctamente
- `400 Bad Request`: La solicitud contiene datos inválidos
- `404 Not Found`: El recurso solicitado no existe
- `500 Internal Server Error`: Error interno del servidor