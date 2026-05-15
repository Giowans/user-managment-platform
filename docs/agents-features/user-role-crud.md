# Plan de Implementación: Módulos de Usuarios y Roles

## Fecha: 2026-05-15

## Objetivo
Implementar un CRUD completo para `Users` y `Roles` en el servicio `user-service` utilizando NestJS y Prisma.

## Modelo de Datos (schema.prisma)

### Relaciones
- **User** ↔ **Role**: Relación muchos a muchos a través de la tabla intermedia `UserRole`
- Cada `UserRole` tiene un campo `assignedAt` que registra cuándo se asignó el rol

## Plan de Implementación

### 1. PrismaModule y PrismaService
Crear un módulo reutilizable para la conexión a la base de datos.

- `src/prisma/prisma.service.ts` - Proveedor de PrismaClient
- `src/prisma/prisma.module.ts` - Módulo exportando el servicio

### 2. Módulo de Roles (roles)

#### DTOs
- `create-role.dto.ts` - name (string, requerido), description (string, opcional)
- `update-role.dto.ts` - name (string, opcional), description (string, opcional)

#### RolesService
- `create(data: CreateRoleDto)` - Crea un nuevo rol
- `findAll()` - Retorna todos los roles
- `findOne(id: string)` - Retorna un rol por ID
- `update(id: string, data: UpdateRoleDto)` - Actualiza un rol
- `remove(id: string)` - Elimina un rol

#### RolesController
- `POST /roles` - Crear rol
- `GET /roles` - Listar todos los roles
- `GET /roles/:id` - Obtener rol por ID
- `PATCH /roles/:id` - Actualizar rol
- `DELETE /roles/:id` - Eliminar rol

### 3. Módulo de Usuarios (users)

#### DTOs
- `create-user.dto.ts` - email, password, firstName, lastName, roleIds (string[])
- `update-user.dto.ts` - email, firstName, lastName, isActive, roleIds

#### UsersService
- `create(data: CreateUserDto)` - Crea usuario verificando/creando roles
- `findAll()` - Retorna todos los usuarios
- `findOne(id: string)` - Retorna usuario por ID
- `update(id: string, data: UpdateUserDto)` - Actualiza usuario y sus roles
- `remove(id: string)` - Elimina usuario

#### UsersController
- `POST /users` - Crear usuario
- `GET /users` - Listar todos los usuarios
- `GET /users/:id` - Obtener usuario por ID
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

### 4. Integración en AppModule
Importar `PrismaModule`, `RolesModule` y `UsersModule` en el módulo principal.

## Notas
- Al crear un usuario, si los roles no existen, se crean automáticamente
- La actualización de roles en usuario permite modificar la asignación
- Todos los endpoints siguen convenciones REST estándar

## Estado de Implementación: ✅ COMPLETADO

### Archivos Creados
- `src/prisma/prisma.service.ts`
- `src/prisma/prisma.module.ts`
- `src/roles/dtos/create-role.dto.ts`
- `src/roles/dtos/update-role.dto.ts`
- `src/roles/roles.service.ts`
- `src/roles/roles.controller.ts`
- `src/roles/roles.module.ts`
- `src/users/dtos/create-user.dto.ts`
- `src/users/dtos/update-user.dto.ts`
- `src/users/users.service.ts`
- `src/users/users.controller.ts`
- `src/users/users.module.ts`

### Actualizado
- `src/app.module.ts` - Integración de módulos
- `package.json` - Agregadas dependencias class-validator y class-transformer

## Pasos para Ejecutar

```bash
# 1. Instalar dependencias
cd services/user-service
npm install

# 2. Generar el cliente de Prisma
npx prisma generate

# 3. Ejecutar el proyecto
npm run start:dev
```

### Endpoints Disponibles
- `POST /roles` - Crear rol
- `GET /roles` - Listar roles
- `GET /roles/:id` - Obtener rol por ID
- `PATCH /roles/:id` - Actualizar rol
- `DELETE /roles/:id` - Eliminar rol

- `POST /users` - Crear usuario (soporta roleIds[])
- `GET /users` - Listar usuarios
- `GET /users/:id` - Obtener usuario por ID
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario