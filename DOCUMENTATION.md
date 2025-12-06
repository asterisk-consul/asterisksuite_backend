# 📜 Documentación del Proyecto

---

## Visión General

Este es un proyecto de **backend** construido con **NestJS** y utiliza **Prisma** como el **ORM** (Mapeador Objeto-Relacional).

---

## Autenticación (`/auth`)

El módulo de autenticación gestiona el inicio de sesión (login) y el registro de usuarios utilizando **JWT (JSON Web Tokens)**.

### 1\. Iniciar Sesión (Login)

Autentica a un usuario y devuelve un **token de acceso JWT** junto con los detalles del usuario.

- **Endpoint**: `POST /auth/login`
- **Cuerpo (Body)**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Respuesta (Response)**:
  ```json
  {
    "access_token": "jwt_token_string",
    "user": {
      "id": "string",
      "username": "string",
      "perfil": { ... }, // Detalles del perfil del usuario
      "roles": ["ROLE_ADMIN", "ROLE_USER"] // Lista de autoridades (roles)
    }
  }
  ```
- **Lógica**:
  - Valida las credenciales contra la tabla `usuarios`.
  - Verifica la contraseña usando **`bcrypt`**. Nota: Maneja contraseñas con o sin el prefijo `{bcrypt}` (soporte para versiones anteriores/legado).
  - Genera un **JWT** que contiene **`sub`** (ID de usuario), **`username`** y **`roles`**.

### 2\. Registro (Register)

Registra un nuevo usuario.

- **Endpoint**: `POST /auth/register`
- **Cuerpo (Body)**:
  ```json
  {
    "username": "string",
    "password": "string" // Mínimo 4 caracteres
  }
  ```
- **Respuesta (Response)**: Devuelve el objeto del usuario creado.
- **Lógica**:
  - Hashea la contraseña usando **`bcrypt`**.
  - **Importante**: Antepone **`{bcrypt}`** a la contraseña hasheada antes de guardarla en la base de datos (compatibilidad con el backend de Java).
  - Crea un nuevo registro en la tabla **`usuarios`**.

---

## 🔒 Seguridad

- **Estrategia**: JWT Bearer Token.
- **Guard (Protector)**: Protector JWT de Passport estándar (probablemente utilizado en otros módulos para proteger rutas).
- **Configuración**: **`JWT_SECRET`** se carga desde las variables de entorno.

---

## Esquema de la Base de Datos (Relacionado con Autenticación)

Según el código, las siguientes tablas están involucradas en la autenticación:

- **`usuarios`**: Almacena las credenciales del usuario.
- **`perfiles`**: Almacena la información personal vinculada al usuario.
- **`user_role`**: Enlace muchos-a-muchos entre usuarios y roles.
- **`role`**: Almacena las definiciones de roles y autoridades (p. ej., **`ROLE_ADMIN`**).
