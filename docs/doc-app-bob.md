# Documentación del Sistema de Pagos - Bob Subastas

## Especificación de Funcionalidades

### 1.1 Gestión de Clientes

- **Listado de Clientes**: Visualización de todos los clientes registrados con sus datos básicos (nombre completo, correo, documento, saldo total)
- **Registro de Clientes**: Formulario para crear nuevos clientes con validación de campos obligatorios (correo, nombre completo, tipo y número de documento, celular, datos de facturación)
- **Edición de Clientes**: Modificación de datos de clientes existentes con validación de campos
- **Anulación de Clientes**: Cambio de estado de clientes (activo/inactivo) con registro de fecha de anulación
- **Búsqueda y Filtrado**: Capacidad para buscar clientes por nombre, correo o número de documento y filtrar por estado (por defecto muestra solo activos)

### 1.2 Gestión de Garantías

- **Registro de Garantías**: Formulario para crear nuevas garantías asociadas a un cliente con campos obligatorios (tipo, fecha de subasta, moneda, monto, banco, cuenta de depósito)
- **Edición de Garantías**: Modificación de datos de garantías existentes con validación de campos
- **Visualización por Cliente**: Vista detallada de todas las garantías asociadas a un cliente específico
- **Cálculo Automático**: Actualización automática de saldos en dólares al registrar o modificar garantías
- **Validación de Garantías**: Proceso para cambiar el estado de una garantía de "Pendiente de Validación" (PV) a "Validado" (V)
- **Adjuntos Documentales**: Capacidad para adjuntar documentos relacionados con la garantía (comprobantes de depósito)

### 1.3 Gestión de Reembolsos

- **Registro de Reembolso**: Formulario para registrar reembolsos asociados a un cliente con campos obligatorios (monto, banco, cuenta de depósito)
- **Edición de Reembolsos**: Modificación de datos de reembolsos existentes con validación de campos
- **Visualización por Cliente**: Vista detallada de todos los reembolsos asociados a un cliente específico
- **Flujo de Aprobación**: Proceso para cambiar el estado de un reembolso de "Pendiente" (P) a "Aprobado" (A)
- **Proceso de Reembolso**: Funcionalidad para marcar un reembolso como "Reembolsado" (R) una vez completada la transacción
- **Cancelación de Reembolsos**: Capacidad para cancelar reembolsos que no deben procesarse
- **Adjuntos Documentales**: Capacidad para adjuntar documentos relacionados con el reembolso

### 1.4 Dashboard de Estadísticas

- **Indicadores Clave**: Visualización de métricas importantes como:
  - Total de clientes activos
  - Total de garantías pendientes y validadas
  - Total de reembolsos pendientes, aprobados y completados
  - Montos totales en dólares por categoría
- **Estadísticas Diarias**: Información sobre clientes, garantías y reembolsos registrados en el día actual
- **Visualización de Saldos**: Totales en dólares por cliente y categoría
- **Actualización Dinámica**: Refrescamiento automático de datos al realizar nuevas operaciones
- **Filtros Temporales**: Capacidad para visualizar estadísticas por períodos (día, semana, mes)

### 1.5 Gestión de Estados

- **Control de Estados de Garantías**:
  - **PV** (Pendiente de Validación): Estado inicial al registrar una garantía
  - **V** (Validado): Estado cuando la garantía ha sido verificada y aprobada
- **Control de Estados de Reembolso**:
  - **P** (Pendiente): Estado inicial al registrar un reembolso
  - **A** (Aprobado): Estado cuando el reembolso ha sido aprobado para procesamiento
  - **R** (Reembolsado): Estado final cuando el reembolso ha sido completado
  - **Cancelado**: Estado cuando el reembolso ha sido cancelado
- **Registro de Fechas**: Almacenamiento de fechas clave:
  - Fecha de creación (createdAt)
  - Fecha de actualización (updatedAt)
  - Fecha de validación (validatedAt)
  - Fecha de aprobación (para reembolsos)
  - Fecha de reembolso (reimbursedAt)
- **Trazabilidad**: Seguimiento del ciclo de vida completo de cada garantía y reembolso

## Casos de Uso Principales

### Gestión de Clientes

#### CU01: Registrar Nuevo Cliente

- **Actor**: Usuario del sistema
- **Descripción**: Permite crear un nuevo registro de cliente en el sistema
- **Precondiciones**: Usuario autenticado con permisos adecuados
- **Flujo Principal**:
    1. Usuario accede a la página de clientes
    2. Usuario hace clic en "Nuevo Cliente"
    3. Sistema muestra formulario de registro
    4. Usuario completa los datos requeridos:
       - Correo (formato válido)
       - Nombre completo
       - Tipo de documento
       - Número de documento
       - Número de celular
       - RUC para facturación
       - Razón social para facturación
    5. Sistema valida los datos ingresados
    6. Sistema verifica que no exista otro cliente con el mismo correo
    7. Sistema registra el nuevo cliente
    8. Sistema muestra notificación de éxito
- **Flujos Alternativos**:
    - Si faltan campos obligatorios, el sistema muestra mensaje de error
    - Si el formato de correo no es válido, el sistema muestra mensaje de error
    - Si ya existe un cliente con el mismo correo, el sistema muestra mensaje de error

#### CU02: Editar Cliente Existente

- **Actor**: Usuario del sistema
- **Descripción**: Permite modificar los datos de un cliente existente
- **Precondiciones**: Usuario autenticado con permisos adecuados, cliente existente en el sistema
- **Flujo Principal**:
    1. Usuario accede a la página de clientes
    2. Usuario localiza el cliente a editar
    3. Usuario hace clic en "Editar"
    4. Sistema muestra formulario con datos pre-cargados
    5. Usuario modifica los datos necesarios
    6. Sistema valida los datos ingresados
    7. Sistema verifica que no exista otro cliente con el mismo correo (si se modificó)
    8. Sistema actualiza el registro del cliente
    9. Sistema muestra notificación de éxito
- **Flujos Alternativos**:
    - Si faltan campos obligatorios, el sistema muestra mensaje de error
    - Si el formato de correo no es válido, el sistema muestra mensaje de error
    - Si ya existe otro cliente con el mismo correo, el sistema muestra mensaje de error

#### CU03: Anular Cliente

- **Actor**: Usuario del sistema
- **Descripción**: Permite cambiar el estado de un cliente a inactivo
- **Precondiciones**: Usuario autenticado con permisos adecuados, cliente existente en el sistema
- **Flujo Principal**:
    1. Usuario accede a la página de clientes
    2. Usuario localiza el cliente a anular
    3. Usuario hace clic en "Anular"
    4. Sistema solicita confirmación
    5. Usuario confirma la anulación
    6. Sistema cambia el estado del cliente a inactivo
    7. Sistema registra la fecha de anulación
    8. Sistema muestra notificación de éxito
- **Flujos Alternativos**:
    - Si el usuario cancela la confirmación, el sistema no realiza cambios

### Gestión de Garantías

#### CU04: Registrar Nueva Garantía

- **Actor**: Usuario del sistema
- **Descripción**: Permite crear un nuevo registro de garantía asociado a un cliente
- **Precondiciones**: Usuario autenticado con permisos adecuados, cliente existente en el sistema
- **Flujo Principal**:
    1. Usuario accede a la página de detalles de un cliente
    2. Usuario hace clic en "Nueva Garantía"
    3. Sistema muestra formulario de registro
    4. Usuario completa los datos requeridos:
       - Tipo de garantía (vehicular, efectivo, etc.)
       - Fecha de subasta
       - Moneda (USD por defecto)
       - Monto de garantía
       - Banco
       - Número de cuenta de depósito
       - Documento adjunto (opcional)
       - Comentarios (opcional)
       - Para garantías vehiculares: placa y empresa del vehículo
    5. Sistema valida los datos ingresados
    6. Sistema registra la nueva garantía con estado "Pendiente de Validación" (PV)
    7. Sistema actualiza los saldos del cliente
    8. Sistema muestra notificación de éxito
- **Flujos Alternativos**:
    - Si faltan campos obligatorios, el sistema muestra mensaje de error
    - Si el tipo es vehicular y faltan datos del vehículo, el sistema muestra mensaje de error

#### CU05: Editar Garantía

- **Actor**: Usuario del sistema
- **Descripción**: Permite modificar los datos de una garantía existente
- **Precondiciones**: Usuario autenticado con permisos adecuados, garantía existente en el sistema
- **Flujo Principal**:
    1. Usuario accede a la página de detalles de un cliente
    2. Usuario localiza la garantía a editar
    3. Usuario hace clic en "Editar"
    4. Sistema muestra formulario con datos pre-cargados
    5. Usuario modifica los datos necesarios
    6. Sistema valida los datos ingresados
    7. Sistema actualiza el registro de la garantía
    8. Sistema actualiza los saldos del cliente si cambió el monto
    9. Sistema muestra notificación de éxito
- **Flujos Alternativos**:
    - Si faltan campos obligatorios, el sistema muestra mensaje de error
    - Si el tipo es vehicular y faltan datos del vehículo, el sistema muestra mensaje de error

#### CU06: Validar Garantía

- **Actor**: Usuario administrador
- **Descripción**: Permite validar una garantía pendiente
- **Precondiciones**: Usuario autenticado con permisos de administrador, garantía existente con estado "Pendiente de Validación" (PV)
- **Flujo Principal**:
    1. Usuario administrador accede a la lista de garantías pendientes
    2. Usuario localiza la garantía a validar
    3. Usuario hace clic en "Validar"
    4. Sistema solicita confirmación
    5. Usuario confirma la validación
    6. Sistema cambia el estado de la garantía a "Validado" (V)
    7. Sistema registra la fecha de validación
    8. Sistema muestra notificación de éxito
- **Flujos Alternativos**:
    - Si el usuario cancela la confirmación, el sistema no realiza cambios

### Gestión de Reembolsos

#### CU07: Registrar Nuevo Reembolso

- **Actor**: Usuario del sistema
- **Descripción**: Permite crear un nuevo registro de reembolso asociado a un cliente
- **Precondiciones**: Usuario autenticado con permisos adecuados, cliente existente en el sistema
- **Flujo Principal**:
    1. Usuario accede a la página de detalles de un cliente
    2. Usuario hace clic en "Nuevo Reembolso"
    3. Sistema muestra formulario de registro
    4. Usuario completa los datos requeridos:
       - Monto de reembolso
       - Banco
       - Número de cuenta de depósito
       - Documento adjunto (opcional)
       - Comentarios (opcional)
    5. Sistema valida los datos ingresados
    6. Sistema registra el nuevo reembolso con estado "Pendiente" (P)
    7. Sistema muestra notificación de éxito
- **Flujos Alternativos**:
    - Si faltan campos obligatorios, el sistema muestra mensaje de error

#### CU08: Aprobar Reembolso

- **Actor**: Usuario administrador
- **Descripción**: Permite aprobar un reembolso pendiente
- **Precondiciones**: Usuario autenticado con permisos de administrador, reembolso existente con estado "Pendiente" (P)
- **Flujo Principal**:
    1. Usuario administrador accede a la lista de reembolsos pendientes
    2. Usuario localiza el reembolso a aprobar
    3. Usuario hace clic en "Aprobar"
    4. Sistema solicita confirmación
    5. Usuario confirma la aprobación
    6. Sistema cambia el estado del reembolso a "Aprobado" (A)
    7. Sistema registra la fecha de aprobación
    8. Sistema muestra notificación de éxito
- **Flujos Alternativos**:
    - Si el usuario cancela la confirmación, el sistema no realiza cambios

#### CU09: Marcar Reembolso como Reembolsado

- **Actor**: Usuario administrador
- **Descripción**: Permite marcar un reembolso aprobado como completado
- **Precondiciones**: Usuario autenticado con permisos de administrador, reembolso existente con estado "Aprobado" (A)
- **Flujo Principal**:
    1. Usuario administrador accede a la lista de reembolsos aprobados
    2. Usuario localiza el reembolso a marcar como reembolsado
    3. Usuario hace clic en "Marcar como Reembolsado"
    4. Sistema solicita confirmación
    5. Usuario confirma la acción
    6. Sistema cambia el estado del reembolso a "Reembolsado" (R)
    7. Sistema registra la fecha de reembolso
    8. Sistema muestra notificación de éxito
- **Flujos Alternativos**:
    - Si el usuario cancela la confirmación, el sistema no realiza cambios

### Dashboard y Reportes

#### CU10: Visualizar Dashboard

- **Actor**: Usuario del sistema
- **Descripción**: Permite ver indicadores clave de rendimiento
- **Precondiciones**: Usuario autenticado con permisos adecuados
- **Flujo Principal**:
    1. Usuario accede a la página principal (Dashboard)
    2. Sistema calcula y muestra indicadores clave:
        - Total de clientes activos
        - Clientes registrados hoy
        - Total de garantías (pendientes y validadas)
        - Garantías registradas hoy
        - Total de reembolsos por estado
        - Reembolsos registrados hoy
        - Montos totales en dólares
    3. Sistema muestra la fecha actual
- **Flujos Alternativos**:
    - Usuario puede filtrar por período (día, semana, mes)
    - Usuario puede hacer clic en indicadores para ver detalles

## Flujo de Trabajo de Usuario

### Flujo de Gestión de Clientes

1. **Acceso al Sistema**
    - Usuario ingresa a la aplicación con credenciales válidas
    - Sistema autentica al usuario y muestra el dashboard principal
2. **Navegación a Clientes**
    - Usuario hace clic en "Clientes" en el menú lateral
    - Sistema muestra la lista de clientes registrados con estado activo
3. **Registro de Nuevo Cliente**
    - Usuario hace clic en "Nuevo Cliente"
    - Usuario completa el formulario con los datos requeridos
    - Sistema valida y registra el nuevo cliente
4. **Gestión de Cliente Existente**
    - Usuario busca un cliente específico (usando el campo de búsqueda)
    - Usuario puede:
        - Ver detalles (haciendo clic en "Detalles")
        - Editar información (haciendo clic en "Editar")
        - Anular cliente (haciendo clic en "Anular")

### Flujo de Gestión de Garantías

1. **Acceso a Garantías**
    - Usuario hace clic en "Garantías" en el menú lateral o accede desde detalles de cliente
    - Sistema muestra la lista de garantías registradas
2. **Registro de Nueva Garantía**
    - Usuario hace clic en "Nueva Garantía"
    - Usuario selecciona un cliente (si no está en contexto de cliente)
    - Usuario completa el formulario con los datos requeridos
    - Sistema valida y registra la nueva garantía con estado "Pendiente de Validación"
3. **Validación de Garantía**
    - Usuario administrador accede a la lista de garantías pendientes
    - Usuario selecciona una garantía y hace clic en "Validar"
    - Sistema actualiza el estado de la garantía a "Validado"
4. **Gestión de Garantía Existente**
    - Usuario localiza una garantía específica en la lista
    - Usuario puede:
        - Ver detalles (haciendo clic en "Detalles")
        - Editar la garantía (haciendo clic en "Editar")
        - Eliminar la garantía (haciendo clic en "Eliminar")

### Flujo de Gestión de Reembolsos

1. **Acceso a Reembolsos**
    - Usuario hace clic en "Reembolsos" en el menú lateral o accede desde detalles de cliente
    - Sistema muestra la lista de reembolsos registrados
2. **Registro de Nuevo Reembolso**
    - Usuario hace clic en "Nuevo Reembolso"
    - Usuario selecciona un cliente (si no está en contexto de cliente)
    - Usuario completa el formulario con los datos requeridos
    - Sistema valida y registra el nuevo reembolso con estado "Pendiente"
3. **Aprobación de Reembolso**
    - Usuario administrador accede a la lista de reembolsos pendientes
    - Usuario selecciona un reembolso y hace clic en "Aprobar"
    - Sistema actualiza el estado del reembolso a "Aprobado"
4. **Completar Reembolso**
    - Usuario administrador accede a la lista de reembolsos aprobados
    - Usuario selecciona un reembolso y hace clic en "Marcar como Reembolsado"
    - Sistema actualiza el estado del reembolso a "Reembolsado"
5. **Gestión de Reembolso Existente**
    - Usuario localiza un reembolso específico en la lista
    - Usuario puede:
        - Ver detalles (haciendo clic en "Detalles")
        - Editar el reembolso (haciendo clic en "Editar")
        - Cancelar el reembolso (haciendo clic en "Cancelar")

### Flujo de Visualización de Dashboard

1. **Acceso al Dashboard**
    - Usuario ingresa a la aplicación o hace clic en "Dashboard" en el menú
    - Sistema muestra los indicadores clave de rendimiento
2. **Interpretación de Datos**
    - Usuario visualiza métricas como:
        - Total de clientes activos
        - Clientes registrados hoy
        - Total de garantías por estado
        - Garantías registradas hoy
        - Total de reembolsos por estado
        - Reembolsos registrados hoy
        - Montos totales en dólares
3. **Navegación a Detalles**
    - Usuario puede hacer clic en secciones específicas para ver más detalles
    - Sistema responde mostrando la información correspondiente
4. **Filtrado de Información**
    - Usuario puede seleccionar diferentes períodos (día, semana, mes)
    - Sistema actualiza las métricas según el período seleccionado

## Integración con API

El sistema frontend se integra con la API RESTful del sistema de pagos de Bob Subastas a través de los siguientes endpoints principales:

### Endpoints de Clientes
- `GET /clientes`: Obtener listado de clientes
- `GET /clientes/:id`: Obtener detalles de un cliente específico
- `POST /clientes`: Crear nuevo cliente
- `PUT /clientes/:id`: Actualizar datos de un cliente existente
- `DELETE /clientes/:id`: Eliminar/anular un cliente

### Endpoints de Garantías
- `GET /garantias`: Obtener listado de garantías
- `GET /garantias/:id`: Obtener detalles de una garantía específica
- `POST /garantias`: Crear nueva garantía
- `PUT /garantias/:id`: Actualizar datos de una garantía existente
- `PUT /garantias/:id/validate`: Validar una garantía
- `DELETE /garantias/:id`: Eliminar una garantía

### Endpoints de Reembolsos
- `GET /reembolsos`: Obtener listado de reembolsos
- `GET /reembolsos/:id`: Obtener detalles de un reembolso específico
- `POST /reembolsos`: Crear nuevo reembolso
- `PUT /reembolsos/:id`: Actualizar datos de un reembolso existente
- `PUT /reembolsos/:id/validate`: Aprobar un reembolso
- `PUT /reembolsos/:id/reimburse`: Marcar un reembolso como reembolsado
- `DELETE /reembolsos/:id`: Cancelar un reembolso

## Consideraciones de Seguridad

- **Autenticación**: El sistema requiere autenticación para todas las operaciones
- **Autorización**: Diferentes niveles de acceso según el rol del usuario:
  - Usuarios estándar: Pueden ver y gestionar clientes, garantías y reembolsos
  - Administradores: Pueden validar garantías, aprobar reembolsos y acceder a todas las funcionalidades
- **Validación de Datos**: Todos los datos ingresados son validados tanto en el frontend como en el backend
- **Protección contra CSRF**: Implementación de tokens anti-CSRF para proteger formularios
- **Registro de Actividad**: Todas las operaciones críticas son registradas con fecha, usuario y acción realizada