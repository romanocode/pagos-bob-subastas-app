# Documentación API - Sistema de Pagos Bob Subastas

Esta documentación describe los endpoints disponibles en la API del sistema de pagos de Bob Subastas para su integración con el frontend y otros sistemas.

## Índice

- [Información General](#información-general)
- [Clientes](#clientes)
- [Garantías](#garantías)
- [Reembolsos](#reembolsos)
- [Códigos de Estado](#códigos-de-estado)

## Información General

- **URL Base**: `http://localhost:3000/api`
- **Formato de Respuesta**: Todas las respuestas son en formato JSON
- **Content-Type**: `application/json`

## Clientes

### Obtener todos los clientes

- **URL**: `/clientes`
- **Método**: `GET`
- **Parámetros**: Ninguno
- **Headers**:
  - Content-Type: application/json

#### Respuesta Exitosa

- **Código**: 200 OK
- **Ejemplo de respuesta**:

```json
{
  "success": true,
  "data": [
    {
      "idCliente": 1,
      "correo": "cliente1@ejemplo.com",
      "nombreCompleto": "Juan Pérez",
      "tipDocumento": "DNI",
      "numDocumento": "12345678",
      "numCelular": "987654321",
      "saldoTotalDolar": 1000.50,
      "dtFacRuc": "20123456789",
      "dtFacRazonSocial": "Empresa Ejemplo S.A.C.",
      "estado": true,
      "createdAt": "2023-05-15T10:30:00.000Z",
      "updatedAt": "2023-05-15T10:30:00.000Z"
    },
    {
      "idCliente": 2,
      "correo": "cliente2@ejemplo.com",
      "nombreCompleto": "María García",
      "tipDocumento": "DNI",
      "numDocumento": "87654321",
      "numCelular": "912345678",
      "saldoTotalDolar": 2500.75,
      "dtFacRuc": "20987654321",
      "dtFacRazonSocial": "Otra Empresa S.A.C.",
      "estado": true,
      "createdAt": "2023-05-16T14:20:00.000Z",
      "updatedAt": "2023-05-16T14:20:00.000Z"
    }
  ],
  "message": "Clientes obtenidos correctamente"
}
```

#### Respuesta de Error

- **Código**: 500 Internal Server Error
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Error al obtener clientes",
  "error": "Error de conexión a la base de datos"
}
```

### Obtener cliente por ID

- **URL**: `/clientes/:id`
- **Método**: `GET`
- **Parámetros de ruta**:
  - `id` (obligatorio): ID numérico del cliente
- **Headers**:
  - Content-Type: application/json

#### Respuesta Exitosa

- **Código**: 200 OK
- **Ejemplo de respuesta**:

```json
{
  "success": true,
  "data": {
    "idCliente": 1,
    "correo": "cliente1@ejemplo.com",
    "nombreCompleto": "Juan Pérez",
    "tipDocumento": "DNI",
    "numDocumento": "12345678",
    "numCelular": "987654321",
    "saldoTotalDolar": 1000.50,
    "dtFacRuc": "20123456789",
    "dtFacRazonSocial": "Empresa Ejemplo S.A.C.",
    "estado": true,
    "createdAt": "2023-05-15T10:30:00.000Z",
    "updatedAt": "2023-05-15T10:30:00.000Z"
  },
  "message": "Cliente obtenido correctamente"
}
```

#### Respuestas de Error

- **Código**: 400 Bad Request
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "El ID del cliente debe ser un número válido"
}
```

- **Código**: 404 Not Found
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Cliente con ID 999 no encontrado"
}
```

- **Código**: 500 Internal Server Error
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Error al obtener cliente",
  "error": "Error de conexión a la base de datos"
}
```

### Crear nuevo cliente

- **URL**: `/clientes`
- **Método**: `POST`
- **Headers**:
  - Content-Type: application/json
- **Body**:

```json
{
  "correo": "nuevo@ejemplo.com",
  "nombreCompleto": "Nuevo Cliente",
  "tipDocumento": "DNI",
  "numDocumento": "12345678",
  "numCelular": "987654321",
  "saldoTotalDolar": 0,
  "dtFacRuc": "20123456789",
  "dtFacRazonSocial": "Empresa Nueva S.A.C.",
  "estado": true
}
```

**Campos obligatorios**:
- `correo`: String (formato email válido)
- `nombreCompleto`: String
- `tipDocumento`: String
- `numDocumento`: String
- `numCelular`: String
- `dtFacRuc`: String
- `dtFacRazonSocial`: String

**Campos opcionales**:
- `saldoTotalDolar`: Number (default: 0)
- `estado`: Boolean (default: true)

#### Respuesta Exitosa

- **Código**: 201 Created
- **Ejemplo de respuesta**:

```json
{
  "success": true,
  "data": {
    "idCliente": 3,
    "correo": "nuevo@ejemplo.com",
    "nombreCompleto": "Nuevo Cliente",
    "tipDocumento": "DNI",
    "numDocumento": "12345678",
    "numCelular": "987654321",
    "saldoTotalDolar": 0,
    "dtFacRuc": "20123456789",
    "dtFacRazonSocial": "Empresa Nueva S.A.C.",
    "estado": true,
    "createdAt": "2023-05-20T08:15:00.000Z",
    "updatedAt": null
  },
  "message": "Cliente creado correctamente"
}
```

#### Respuestas de Error

- **Código**: 400 Bad Request
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Todos los campos obligatorios deben ser proporcionados"
}
```

- **Código**: 400 Bad Request
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "El formato del correo no es válido"
}
```

- **Código**: 409 Conflict
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Ya existe un cliente con ese correo"
}
```

- **Código**: 500 Internal Server Error
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Error al crear cliente",
  "error": "Error de conexión a la base de datos"
}
```

### Actualizar cliente

- **URL**: `/clientes/:id`
- **Método**: `PUT`
- **Parámetros de ruta**:
  - `id` (obligatorio): ID numérico del cliente
- **Headers**:
  - Content-Type: application/json
- **Body**:

```json
{
  "correo": "actualizado@ejemplo.com",
  "nombreCompleto": "Cliente Actualizado",
  "tipDocumento": "DNI",
  "numDocumento": "87654321",
  "numCelular": "912345678",
  "saldoTotalDolar": 1500.25,
  "dtFacRuc": "20987654321",
  "dtFacRazonSocial": "Empresa Actualizada S.A.C.",
  "estado": true
}
```

**Nota**: Todos los campos son opcionales. Solo se actualizarán los campos proporcionados.

#### Respuesta Exitosa

- **Código**: 200 OK
- **Ejemplo de respuesta**:

```json
{
  "success": true,
  "data": {
    "idCliente": 1,
    "correo": "actualizado@ejemplo.com",
    "nombreCompleto": "Cliente Actualizado",
    "tipDocumento": "DNI",
    "numDocumento": "87654321",
    "numCelular": "912345678",
    "saldoTotalDolar": 1500.25,
    "dtFacRuc": "20987654321",
    "dtFacRazonSocial": "Empresa Actualizada S.A.C.",
    "estado": true,
    "createdAt": "2023-05-15T10:30:00.000Z",
    "updatedAt": "2023-05-21T11:45:00.000Z"
  },
  "message": "Cliente actualizado correctamente"
}
```

#### Respuestas de Error

- **Código**: 400 Bad Request
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "El ID del cliente debe ser un número válido"
}
```

- **Código**: 404 Not Found
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Cliente con ID 999 no encontrado"
}
```

- **Código**: 400 Bad Request
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "El formato del correo no es válido"
}
```

- **Código**: 409 Conflict
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Ya existe otro cliente con ese correo"
}
```

- **Código**: 500 Internal Server Error
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Error al actualizar cliente",
  "error": "Error de conexión a la base de datos"
}
```

### Eliminar cliente

- **URL**: `/clientes/:id`
- **Método**: `DELETE`
- **Parámetros de ruta**:
  - `id` (obligatorio): ID numérico del cliente
- **Headers**:
  - Content-Type: application/json

#### Respuesta Exitosa

- **Código**: 200 OK
- **Ejemplo de respuesta**:

```json
{
  "success": true,
  "message": "Cliente eliminado correctamente"
}
```

#### Respuestas de Error

- **Código**: 400 Bad Request
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "El ID del cliente debe ser un número válido"
}
```

- **Código**: 404 Not Found
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Cliente con ID 999 no encontrado"
}
```

- **Código**: 500 Internal Server Error
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Error al eliminar cliente",
  "error": "Error de conexión a la base de datos"
}
```

## Garantías

### Obtener todas las garantías

- **URL**: `/garantias`
- **Método**: `GET`
- **Parámetros**: Ninguno
- **Headers**:
  - Content-Type: application/json

#### Respuesta Exitosa

- **Código**: 200 OK
- **Ejemplo de respuesta**:

```json
{
  "success": true,
  "data": [
    {
      "idGarantia": 1,
      "idCliente": 1,
      "tipo": "vehicular",
      "placaVehiculo": "ABC-123",
      "empresaVehiculo": "Toyota",
      "fechaSubasta": "2023-06-15T00:00:00.000Z",
      "moneda": "USD",
      "montoGarantia": 5000,
      "banco": "Banco de Crédito",
      "numCuentaDeposito": "123-456-789",
      "docAdjunto": "garantia1.pdf",
      "comentarios": "Garantía para subasta de junio",
      "estado": "PV",
      "createdAt": "2023-05-10T14:30:00.000Z",
      "updatedAt": null,
      "validatedAt": null
    },
    {
      "idGarantia": 2,
      "idCliente": 2,
      "tipo": "efectivo",
      "placaVehiculo": null,
      "empresaVehiculo": null,
      "fechaSubasta": "2023-06-20T00:00:00.000Z",
      "moneda": "USD",
      "montoGarantia": 3000,
      "banco": "BBVA",
      "numCuentaDeposito": "987-654-321",
      "docAdjunto": "garantia2.pdf",
      "comentarios": "Garantía en efectivo",
      "estado": "V",
      "createdAt": "2023-05-12T09:45:00.000Z",
      "updatedAt": "2023-05-13T10:15:00.000Z",
      "validatedAt": "2023-05-13T10:15:00.000Z"
    }
  ],
  "message": "Garantías obtenidas correctamente"
}
```

#### Respuesta de Error

- **Código**: 500 Internal Server Error
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Error al obtener garantías",
  "error": "Error de conexión a la base de datos"
}
```

### Obtener garantía por ID

- **URL**: `/garantias/:id`
- **Método**: `GET`
- **Parámetros de ruta**:
  - `id` (obligatorio): ID numérico de la garantía
- **Headers**:
  - Content-Type: application/json

#### Respuesta Exitosa

- **Código**: 200 OK
- **Ejemplo de respuesta**:

```json
{
  "success": true,
  "data": {
    "idGarantia": 1,
    "idCliente": 1,
    "tipo": "vehicular",
    "placaVehiculo": "ABC-123",
    "empresaVehiculo": "Toyota",
    "fechaSubasta": "2023-06-15T00:00:00.000Z",
    "moneda": "USD",
    "montoGarantia": 5000,
    "banco": "Banco de Crédito",
    "numCuentaDeposito": "123-456-789",
    "docAdjunto": "garantia1.pdf",
    "comentarios": "Garantía para subasta de junio",
    "estado": "PV",
    "createdAt": "2023-05-10T14:30:00.000Z",
    "updatedAt": null,
    "validatedAt": null
  },
  "message": "Garantía obtenida correctamente"
}
```

#### Respuestas de Error

- **Código**: 400 Bad Request
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "El ID de la garantía debe ser un número válido"
}
```

- **Código**: 404 Not Found
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Garantía con ID 999 no encontrada"
}
```

- **Código**: 500 Internal Server Error
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Error al obtener garantía",
  "error": "Error de conexión a la base de datos"
}
```

### Crear nueva garantía

- **URL**: `/garantias`
- **Método**: `POST`
- **Headers**:
  - Content-Type: application/json
- **Body**:

```json
{
  "idCliente": 1,
  "tipo": "vehicular",
  "placaVehiculo": "DEF-456",
  "empresaVehiculo": "Honda",
  "fechaSubasta": "2023-07-10",
  "moneda": "USD",
  "montoGarantia": 4500,
  "banco": "Interbank",
  "numCuentaDeposito": "456-789-123",
  "docAdjunto": "nueva_garantia.pdf",
  "comentarios": "Nueva garantía vehicular"
}
```

**Campos obligatorios**:
- `idCliente`: Number
- `tipo`: String
- `fechaSubasta`: Date
- `moneda`: String
- `montoGarantia`: Number
- `banco`: String
- `numCuentaDeposito`: String
- `docAdjunto`: String

**Campos opcionales**:
- `placaVehiculo`: String (obligatorio si tipo es "vehicular")
- `empresaVehiculo`: String (obligatorio si tipo es "vehicular")
- `comentarios`: String
- `estado`: String (default: "PV" - Pendiente de Validación)

#### Respuesta Exitosa

- **Código**: 201 Created
- **Ejemplo de respuesta**:

```json
{
  "success": true,
  "data": {
    "idGarantia": 3,
    "idCliente": 1,
    "tipo": "vehicular",
    "placaVehiculo": "DEF-456",
    "empresaVehiculo": "Honda",
    "fechaSubasta": "2023-07-10T00:00:00.000Z",
    "moneda": "USD",
    "montoGarantia": 4500,
    "banco": "Interbank",
    "numCuentaDeposito": "456-789-123",
    "docAdjunto": "nueva_garantia.pdf",
    "comentarios": "Nueva garantía vehicular",
    "estado": "PV",
    "createdAt": "2023-05-25T16:20:00.000Z",
    "updatedAt": null,
    "validatedAt": null
  },
  "message": "Garantía creada correctamente"
}
```

#### Respuestas de Error

- **Código**: 400 Bad Request
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Todos los campos obligatorios deben ser proporcionados"
}
```

- **Código**: 400 Bad Request
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "El ID del cliente debe ser un número válido"
}
```

- **Código**: 404 Not Found
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Cliente con ID 999 no encontrado"
}
```

- **Código**: 400 Bad Request
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Para garantías de tipo vehicular, los campos placaVehiculo y empresaVehiculo son obligatorios"
}
```

- **Código**: 500 Internal Server Error
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Error al crear garantía",
  "error": "Error de conexión a la base de datos"
}
```

### Actualizar garantía

- **URL**: `/garantias/:id`
- **Método**: `PUT`
- **Parámetros de ruta**:
  - `id` (obligatorio): ID numérico de la garantía
- **Headers**:
  - Content-Type: application/json
- **Body**:

```json
{
  "idCliente": 2,
  "tipo": "vehicular",
  "placaVehiculo": "GHI-789",
  "empresaVehiculo": "Nissan",
  "fechaSubasta": "2023-08-05",
  "moneda": "USD",
  "montoGarantia": 6000,
  "banco": "Scotiabank",
  "numCuentaDeposito": "789-123-456",
  "docAdjunto": "garantia_actualizada.pdf",
  "comentarios": "Garantía actualizada",
  "estado": "PV"
}
```

**Nota**: Todos los campos son opcionales. Solo se actualizarán los campos proporcionados.

#### Respuesta Exitosa

- **Código**: 200 OK
- **Ejemplo de respuesta**:

```json
{
  "success": true,
  "data": {
    "idGarantia": 1,
    "idCliente": 2,
    "tipo": "vehicular",
    "placaVehiculo": "GHI-789",
    "empresaVehiculo": "Nissan",
    "fechaSubasta": "2023-08-05T00:00:00.000Z",
    "moneda": "USD",
    "montoGarantia": 6000,
    "banco": "Scotiabank",
    "numCuentaDeposito": "789-123-456",
    "docAdjunto": "garantia_actualizada.pdf",
    "comentarios": "Garantía actualizada",
    "estado": "PV",
    "createdAt": "2023-05-10T14:30:00.000Z",
    "updatedAt": "2023-05-26T11:10:00.000Z",
    "validatedAt": null
  },
  "message": "Garantía actualizada correctamente"
}
```

#### Respuestas de Error

- **Código**: 400 Bad Request
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "El ID de la garantía debe ser un número válido"
}
```

- **Código**: 404 Not Found
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Garantía con ID 999 no encontrada"
}
```

- **Código**: 400 Bad Request
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "El ID del cliente debe ser un número válido"
}
```

- **Código**: 404 Not Found
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Cliente con ID 999 no encontrado"
}
```

- **Código**: 400 Bad Request
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Para garantías de tipo vehicular, los campos placaVehiculo y empresaVehiculo son obligatorios"
}
```

- **Código**: 500 Internal Server Error
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Error al actualizar garantía",
  "error": "Error de conexión a la base de datos"
}
```

### Validar garantía

- **URL**: `/garantias/:id/validate`
- **Método**: `PUT`
- **Parámetros de ruta**:
  - `id` (obligatorio): ID numérico de la garantía
- **Headers**:
  - Content-Type: application/json
- **Body**: No requiere

#### Respuesta Exitosa

- **Código**: 200 OK
- **Ejemplo de respuesta**:

```json
{
  "success": true,
  "data": {
    "idGarantia": 1,
    "idCliente": 1,
    "tipo": "vehicular",
    "placaVehiculo": "ABC-123",
    "empresaVehiculo": "Toyota",
    "fechaSubasta": "2023-06-15T00:00:00.000Z",
    "moneda": "USD",
    "montoGarantia": 5000,
    "banco": "Banco de Crédito",
    "numCuentaDeposito": "123-456-789",
    "docAdjunto": "garantia1.pdf",
    "comentarios": "Garantía para subasta de junio",
    "estado": "V",
    "createdAt": "2023-05-10T14:30:00.000Z",
    "updatedAt": "2023-05-27T09:30:00.000Z",
    "validatedAt": "2023-05-27T09:30:00.000Z"
  },
  "message": "Garantía validada correctamente"
}
```

#### Respuestas de Error

- **Código**: 400 Bad Request
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "El ID de la garantía debe ser un número válido"
}
```

- **Código**: 404 Not Found
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Garantía con ID 999 no encontrada"
}
```

- **Código**: 500 Internal Server Error
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Error al validar garantía",
  "error": "Error de conexión a la base de datos"
}
```

### Eliminar garantía

- **URL**: `/garantias/:id`
- **Método**: `DELETE`
- **Parámetros de ruta**:
  - `id` (obligatorio): ID numérico de la garantía
- **Headers**:
  - Content-Type: application/json

#### Respuesta Exitosa

- **Código**: 200 OK
- **Ejemplo de respuesta**:

```json
{
  "success": true,
  "message": "Garantía eliminada correctamente"
}
```

#### Respuestas de Error

- **Código**: 400 Bad Request
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "El ID de la garantía debe ser un número válido"
}
```

- **Código**: 404 Not Found
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Garantía con ID 999 no encontrada"
}
```

- **Código**: 500 Internal Server Error
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Error al eliminar garantía",
  "error": "Error de conexión a la base de datos"
}
```

## Reembolsos

### Obtener todos los reembolsos

- **URL**: `/reembolsos`
- **Método**: `GET`
- **Parámetros**: Ninguno
- **Headers**:
  - Content-Type: application/json

#### Respuesta Exitosa

- **Código**: 200 OK
- **Ejemplo de respuesta**:

```json
{
  "success": true,
  "data": [
    {
      "idReembolso": 1,
      "idCliente": 1,
      "montoReembolso": 500.75,
      "banco": "Banco de Crédito",
      "numCuentaDeposito": "123-456-789",
      "docAdjunto": "reembolso1.pdf",
      "comentarios": "Reembolso por cancelación",
      "estado": "P",
      "createdAt": "2023-05-18T10:20:00.000Z",
      "updatedAt": null,
      "validatedAt": null,
      "reimbursedAt": null
    },
    {
      "idReembolso": 2,
      "idCliente": 2,
      "montoReembolso": 1200.50,
      "banco": "BBVA",
      "numCuentaDeposito": "987-654-321",
      "docAdjunto": "reembolso2.pdf",
      "comentarios": "Reembolso por devolución",
      "estado": "A",
      "createdAt": "2023-05-19T14:45:00.000Z",
      "updatedAt": "2023-05-20T09:30:00.000Z",
      "validatedAt": "2023-05-20T09:30:00.000Z",
      "reimbursedAt": null
    }
  ],
  "message": "Reembolsos obtenidos correctamente"
}
```

#### Respuesta de Error

- **Código**: 500 Internal Server Error
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Error al obtener reembolsos",
  "error": "Error de conexión a la base de datos"
}
```

### Obtener reembolso por ID

- **URL**: `/reembolsos/:id`
- **Método**: `GET`
- **Parámetros de ruta**:
  - `id` (obligatorio): ID numérico del reembolso
- **Headers**:
  - Content-Type: application/json

#### Respuesta Exitosa

- **Código**: 200 OK
- **Ejemplo de respuesta**:

```json
{
  "success": true,
  "data": {
    "idReembolso": 1,
    "idCliente": 1,
    "montoReembolso": 500.75,
    "banco": "Banco de Crédito",
    "numCuentaDeposito": "123-456-789",
    "docAdjunto": "reembolso1.pdf",
    "comentarios": "Reembolso por cancelación",
    "estado": "P",
    "createdAt": "2023-05-18T10:20:00.000Z",
    "updatedAt": null,
    "validatedAt": null,
    "reimbursedAt": null
  },
  "message": "Reembolso obtenido correctamente"
}
```

#### Respuestas de Error

- **Código**: 400 Bad Request
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "El ID del reembolso debe ser un número válido"
}
```

- **Código**: 404 Not Found
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Reembolso con ID 999 no encontrado"
}
```

- **Código**: 500 Internal Server Error
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Error al obtener reembolso",
  "error": "Error de conexión a la base de datos"
}
```

### Crear nuevo reembolso

- **URL**: `/reembolsos`
- **Método**: `POST`
- **Headers**:
  - Content-Type: application/json
- **Body**:

```json
{
  "idCliente": 1,
  "montoReembolso": 750.25,
  "banco": "Interbank",
  "numCuentaDeposito": "456-789-123",
  "docAdjunto": "nuevo_reembolso.pdf",
  "comentarios": "Nuevo reembolso por cancelación de subasta"
}
```

**Campos obligatorios**:
- `idCliente`: Number
- `montoReembolso`: Number
- `banco`: String
- `numCuentaDeposito`: String

**Campos opcionales**:
- `docAdjunto`: String
- `comentarios`: String
- `estado`: String (default: "P" - Pendiente)

#### Respuesta Exitosa

- **Código**: 201 Created
- **Ejemplo de respuesta**:

```json
{
  "success": true,
  "data": {
    "idReembolso": 3,
    "idCliente": 1,
    "montoReembolso": 750.25,
    "banco": "Interbank",
    "numCuentaDeposito": "456-789-123",
    "docAdjunto": "nuevo_reembolso.pdf",
    "comentarios": "Nuevo reembolso por cancelación de subasta",
    "estado": "P",
    "createdAt": "2023-05-28T15:40:00.000Z",
    "updatedAt": null,
    "validatedAt": null,
    "reimbursedAt": null
  },
  "message": "Reembolso creado correctamente"
}
```

#### Respuestas de Error

- **Código**: 400 Bad Request
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Los campos idCliente, montoReembolso, banco y numCuentaDeposito son obligatorios"
}
```

- **Código**: 400 Bad Request
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "El ID del cliente debe ser un número válido"
}
```

- **Código**: 404 Not Found
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Cliente con ID 999 no encontrado"
}
```

- **Código**: 500 Internal Server Error
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Error al crear reembolso",
  "error": "Error de conexión a la base de datos"
}
```

### Actualizar reembolso

- **URL**: `/reembolsos/:id`
- **Método**: `PUT`
- **Parámetros de ruta**:
  - `id` (obligatorio): ID numérico del reembolso
- **Headers**:
  - Content-Type: application/json
- **Body**:

```json
{
  "idCliente": 2,
  "montoReembolso": 800,
  "banco": "Scotiabank",
  "numCuentaDeposito": "789-123-456",
  "docAdjunto": "reembolso_actualizado.pdf",
  "comentarios": "Reembolso actualizado",
  "estado": "P"
}
```

**Nota**: Todos los campos son opcionales. Solo se actualizarán los campos proporcionados.

#### Respuesta Exitosa

- **Código**: 200 OK
- **Ejemplo de respuesta**:

```json
{
  "success": true,
  "data": {
    "idReembolso": 1,
    "idCliente": 2,
    "montoReembolso": 800,
    "banco": "Scotiabank",
    "numCuentaDeposito": "789-123-456",
    "docAdjunto": "reembolso_actualizado.pdf",
    "comentarios": "Reembolso actualizado",
    "estado": "P",
    "createdAt": "2023-05-18T10:20:00.000Z",
    "updatedAt": "2023-05-29T11:25:00.000Z",
    "validatedAt": null,
    "reimbursedAt": null
  },
  "message": "Reembolso actualizado correctamente"
}
```

#### Respuestas de Error

- **Código**: 400 Bad Request
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "El ID del reembolso debe ser un número válido"
}
```

- **Código**: 404 Not Found
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Reembolso con ID 999 no encontrado"
}
```

- **Código**: 400 Bad Request
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "El ID del cliente debe ser un número válido"
}
```

- **Código**: 404 Not Found
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Cliente con ID 999 no encontrado"
}
```

- **Código**: 500 Internal Server Error
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Error al actualizar reembolso",
  "error": "Error de conexión a la base de datos"
}
```

### Aprobar reembolso

- **URL**: `/reembolsos/:id/validate`
- **Método**: `PUT`
- **Parámetros de ruta**:
  - `id` (obligatorio): ID numérico del reembolso
- **Headers**:
  - Content-Type: application/json
- **Body**: No requiere

#### Respuesta Exitosa

- **Código**: 200 OK
- **Ejemplo de respuesta**:

```json
{
  "success": true,
  "data": {
    "idReembolso": 1,
    "idCliente": 1,
    "montoReembolso": 500.75,
    "banco": "Banco de Crédito",
    "numCuentaDeposito": "123-456-789",
    "docAdjunto": "reembolso1.pdf",
    "comentarios": "Reembolso por cancelación",
    "estado": "A",
    "createdAt": "2023-05-18T10:20:00.000Z",
    "updatedAt": "2023-05-30T09:15:00.000Z",
    "validatedAt": "2023-05-30T09:15:00.000Z",
    "reimbursedAt": null
  },
  "message": "Reembolso aprobado correctamente"
}
```

#### Respuestas de Error

- **Código**: 400 Bad Request
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "El ID del reembolso debe ser un número válido"
}
```

- **Código**: 404 Not Found
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Reembolso con ID 999 no encontrado"
}
```

- **Código**: 500 Internal Server Error
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Error al aprobar reembolso",
  "error": "Error de conexión a la base de datos"
}
```

### Marcar reembolso como reembolsado

- **URL**: `/reembolsos/:id/reimburse`
- **Método**: `PUT`
- **Parámetros de ruta**:
  - `id` (obligatorio): ID numérico del reembolso
- **Headers**:
  - Content-Type: application/json
- **Body**: No requiere

#### Respuesta Exitosa

- **Código**: 200 OK
- **Ejemplo de respuesta**:

```json
{
  "success": true,
  "data": {
    "idReembolso": 2,
    "idCliente": 2,
    "montoReembolso": 1200.50,
    "banco": "BBVA",
    "numCuentaDeposito": "987-654-321",
    "docAdjunto": "reembolso2.pdf",
    "comentarios": "Reembolso por devolución",
    "estado": "R",
    "createdAt": "2023-05-19T14:45:00.000Z",
    "updatedAt": "2023-05-31T10:20:00.000Z",
    "validatedAt": "2023-05-20T09:30:00.000Z",
    "reimbursedAt": "2023-05-31T10:20:00.000Z"
  },
  "message": "Reembolso marcado como reembolsado correctamente"
}
```

#### Respuestas de Error

- **Código**: 400 Bad Request
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "El ID del reembolso debe ser un número válido"
}
```

- **Código**: 404 Not Found
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Reembolso con ID 999 no encontrado"
}
```

- **Código**: 500 Internal Server Error
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Error al marcar reembolso como reembolsado",
  "error": "Error de conexión a la base de datos"
}
```

### Eliminar reembolso (Cancelar)

- **URL**: `/reembolsos/:id`
- **Método**: `DELETE`
- **Parámetros de ruta**:
  - `id` (obligatorio): ID numérico del reembolso
- **Headers**:
  - Content-Type: application/json

#### Respuesta Exitosa

- **Código**: 200 OK
- **Ejemplo de respuesta**:

```json
{
  "success": true,
  "message": "Reembolso cancelado correctamente"
}
```

#### Respuestas de Error

- **Código**: 400 Bad Request
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "El ID del reembolso debe ser un número válido"
}
```

- **Código**: 404 Not Found
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Reembolso con ID 999 no encontrado"
}
```

- **Código**: 500 Internal Server Error
- **Ejemplo de respuesta**:

```json
{
  "success": false,
  "message": "Error al eliminar reembolso",
  "error": "Error de conexión a la base de datos"
}
```

## Códigos de Estado

La API utiliza los siguientes códigos de estado HTTP:

- **200 OK**: La solicitud se ha completado correctamente
- **201 Created**: El recurso se ha creado correctamente
- **400 Bad Request**: La solicitud contiene datos inválidos o falta información requerida
- **404 Not Found**: El recurso solicitado no existe
- **409 Conflict**: La solicitud no puede ser completada debido a un conflicto con el estado actual del recurso
- **500 Internal Server Error**: Error interno del servidor

## Estados de los Recursos

### Estados de Garantías

- **PV**: Pendiente de Validación
- **V**: Validado

### Estados de Reembolsos

- **P**: Pendiente
- **A**: Aprobado
- **R**: Reembolsado
- **cancelado**: Cancelado