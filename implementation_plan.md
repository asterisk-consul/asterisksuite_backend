# Implementation Plan - JWT Auth Guard

## Goal

Implement a JWT Authentication Guard to protect routes and ensure users are logged in.

## Proposed Changes

### Auth Component

#### [NEW] [jwt-auth.guard.ts](file:///c:/proyectos/asterisksuite_backend/src/auth/jwt-auth.guard.ts)

- Create a class `JwtAuthGuard` extending `AuthGuard('jwt')`.
- This will allow using `@UseGuards(JwtAuthGuard)` on controllers or routes.

### Articulos Component

#### [MODIFY] [articulos.controller.ts](file:///c:/proyectos/asterisksuite_backend/src/articulos/articulos.controller.ts)

- Import `JwtAuthGuard`.
- Apply `@UseGuards(JwtAuthGuard)` to the controller (or specific routes) to demonstrate usage.

## Verification Plan

### Manual Verification

1.  **Login**: Use the existing `login.http` to get a valid JWT token.
2.  **Access Protected Route**: Try to access `GET /articulos/index` without a token (should fail with 401).
3.  **Access with Token**: Try to access `GET /articulos/index` with the valid token (should succeed).
