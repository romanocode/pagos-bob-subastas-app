# 📦 Sistema de Gestión de Pagos y Garantías (DEMO)

Este repositorio contiene la parte **frontend** del proyecto **BOB Subastas – Sistema de Gestión de Pagos y Garantías (DEMO)**.  
⚠️ Importante: Este es un proyecto académico en desarrollo, creado por estudiantes con fines de práctica y presentación.  

---

## 📋 Resumen del Proyecto
**BOB Subastas** es un marketplace de subastas industriales que requiere un sistema robusto para gestionar **pagos de garantías, saldos de usuarios y reembolsos** en su línea de negocio de vehículos.  

Actualmente:
- Los pagos se registran manualmente vía formularios de Google.  
- No hay centralización de datos de saldos.  
- Los cálculos son manuales y propensos a errores.  
- No existe trazabilidad completa de los movimientos financieros.  

---

## 🎯 Objetivo de la DEMO
Construir un sistema web que **demuestre la capacidad de:**
- Centralizar y automatizar la gestión de garantías.  
- Manejar saldos de usuarios de forma transparente.  
- Procesar reembolsos de manera eficiente.  
- Validar pagos con trazabilidad completa.  

---

## 🚀 Funcionalidades (DEMO)

### 1. Módulo de Gestión de Usuarios (sin autenticación)
- **Panel de Usuario DEMO**: saldo actual, historial ficticio, subastas simuladas y solicitudes de reembolso.  
- **Panel de Administrador DEMO**: gestión de subastas simuladas, validación de pagos ficticios, aprobación de reembolsos y reportes financieros de ejemplo.  

### 2. Módulo de Subastas (solo visualización)
- Visualización de subastas finalizadas.  
- Estados: Finalizada, Cancelada.  
- Ganadores ya asignados.  
- ❌ No incluye sistema de pujas (ya existe en BOB).  

### 3. Módulo de Pagos y Garantías
- Registro de depósitos de garantía.  
- Validación manual de transferencias (simulada).  
- Cálculo automático de penalidades (30%).  
- Gestión de estados de pago.  

### 4. Módulo de Billetera Digital
- Saldos en tiempo real (simulados).  
- Historial completo de movimientos ficticios.  
- Retenciones temporales.  
- Cálculo automático de disponibilidad.  

### 5. Módulo de Reembolsos
- Solicitudes de reembolso parciales/totales.  
- Procesamiento por lotes (ejemplo: miércoles).  
- Estados: Pendiente, Aprobado, Procesado.  
- Trazabilidad completa de ejemplo.  


---
