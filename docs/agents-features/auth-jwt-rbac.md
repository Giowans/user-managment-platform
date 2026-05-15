# Plan de Implementación: Autenticación, JWT, RBAC y Auditoría

## Fecha: 2026-05-15

## Objetivo
Mejorar la seguridad implementando validación JWT en todos los microservicios, añadir Control de Acceso Basado en Roles (RBAC), integrar Prisma en `auth-service` y configurar los endpoints base para `audit-service`.

## 1. Auth Service (Integración con Prisma y JWT Payload)

- Se copió el `schema.prisma` del `user-service` para mantener consistencia.
- Se crearon `PrismaModule` y `PrismaService` para gestionar la conexión a la base de datos PostgreSQL.
- Se actualizó `AuthService`:
  - `register`: Ahora guarda el usuario en la base de datos hasheando el password con `bcrypt`.
  - `login`: Verifica las credenciales contra la base de datos y adjunta los roles del usuario (solo `id` y `name`) en el payload del JWT emitido.

## 2. Seguridad en Microservicios (JWT y Roles)

- Se crearon guards reutilizables en `user-service` y `audit-service`:
  - `JwtAuthGuard`: Valida el token JWT usando `Passport` y el secret compartido (`JWT_SECRET`).
  - `RolesGuard`: Verifica si los roles del token coinciden con los roles requeridos por el endpoint.
  - Decorador `@Roles`: Permite especificar los roles permitidos por ruta/controlador.
- **User Service:** Se aplicó protección a todos los endpoints en `UsersController` y `RolesController`, restringiendo el acceso exclusivamente a usuarios con el rol `admin`.
- Se actualizaron las dependencias `package.json` para soportar JWT y Passport.

## 3. Audit Service (MongoDB con Mongoose y Endpoints)

- Se eliminó Prisma de `audit-service` ya que se implementó Mongoose.
- Se instalaron las dependencias de `@nestjs/mongoose` y `mongoose`.
- Se definió el esquema `AuditLog` en `src/audit/schemas/audit-log.schema.ts` utilizando los decoradores de Mongoose de NestJS.
- Se implementó la validación JWT copiando e integrando los guards (`JwtAuthGuard`, `RolesGuard`), el decorador `@Roles` y la estrategia (`JwtStrategy`) compartiendo el mismo `JWT_SECRET` para mantener la sesión unificada a través de los microservicios.
- Se implementaron los endpoints en `AuditController`:
  - `GET /audit-logs`: Permite listar logs con filtros por `userEmail`, `role`, rango de fechas, `eventType`, y la opción de retornar solo metadatos (`metadataOnly`), usando sintaxis de Mongoose (`$gte`, `$lte`).
  - `GET /audit-logs/:id`: Retorna el detalle de un log específico por su ObjectId.
- Se protegieron estos endpoints requiriendo que el JWT sea válido (usando `JwtAuthGuard`) y que el usuario tenga alguno de los roles: `admin`, `auditor`, o `monitor` (usando `RolesGuard`).

## Pasos Requeridos (Manual)

Debido a restricciones de ejecución, por favor ejecuta los siguientes comandos en cada servicio:

1. **User Service:**
   ```bash
   cd services/user-service
   npm install
   ```

2. **Audit Service:**
   ```bash
   cd services/audit-service
   npm install
   ```
   *(Nota: Ya no es necesario ejecutar prisma generate en audit-service)*

3. **Variables de Entorno (.env):**
   Asegúrate de que todos los servicios compartan la misma variable secreta de JWT:
   ```env
   JWT_SECRET=tu_secreto_super_seguro
   JWT_EXPIRES_IN=1d
   ```
   Y que `audit-service` tenga su string de conexión a MongoDB:
   ```env
   DATABASE_URL=mongodb://localhost:27017/audit_db
   ```
