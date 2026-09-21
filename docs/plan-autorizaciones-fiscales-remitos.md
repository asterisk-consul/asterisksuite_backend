# Plan de autorizaciones fiscales para remitos

> Estado: implementado el 18/09/2026. La migración queda disponible en
> `prisma/migrations/20260918_fiscal_authorizations/migration.sql` y debe aplicarse
> en cada base tenant antes de habilitar la pantalla y la validación.

## Objetivo

Administrar las autorizaciones fiscales utilizadas por los documentos, comenzando por el CAI de los remitos, conservar el dato histórico impreso y avisar antes de su vencimiento.

## Alcance inicial

- Registrar CAI por empresa, tipo de documento y punto de venta.
- Informar fecha de vigencia, vencimiento y rango de numeración.
- Resolver automáticamente el CAI aplicable al confirmar un remito.
- Guardar en el documento una copia histórica del código y su vencimiento.
- Mostrar el CAI y la fecha de vencimiento en la impresión.
- Notificar con anticipación configurable.
- Mantener historial de autorizaciones vencidas o reemplazadas.

El modelo deberá admitir en el futuro otros tipos de autorización, como CAE y CAEA, sin mezclar sus reglas con las del CAI.

## Modelo funcional

Cada autorización deberá incluir:

- Tipo de autorización: CAI, CAE o CAEA.
- Código.
- Empresa.
- Tipo de documento.
- Punto de venta.
- Inicio y fin de vigencia.
- Numeración desde y hasta.
- Estado: futura, vigente, próxima a vencer, vencida, reemplazada o anulada.
- Observaciones y constancia adjunta opcional.
- Auditoría de creación y modificación.

Una autorización utilizada por documentos no podrá eliminarse. Sólo podrá marcarse como anulada o reemplazada.

## Resolución al emitir

Al confirmar un remito, el sistema buscará una autorización de la empresa activa que coincida con:

1. Tipo de documento.
2. Punto de venta.
3. Fecha del documento dentro de la vigencia.
4. Número del comprobante dentro del rango autorizado.
5. Estado habilitado.

Si existe una única autorización aplicable, se asignará automáticamente. Si no existe, el sistema advertirá o bloqueará la confirmación según la configuración de la empresa.

El remito guardará un snapshot con tipo, código, vencimiento, punto de venta y rango. Una renovación posterior no modificará documentos históricos.

## Renovación

- Permitir registrar una autorización futura antes de que venza la actual.
- Mantener visible el historial anterior.
- Seleccionar automáticamente la nueva autorización desde el comienzo de su vigencia y rango.
- Permitir indicar una fecha de reemplazo anticipado.
- Ofrecer una acción Renovar que copie la configuración general y solicite el nuevo código, rango y vencimiento.

## Alertas configurables

Configuración por empresa:

- Activar o desactivar alertas.
- Definir uno o varios umbrales, con valores iniciales sugeridos de 30, 15, 7, 3 y 1 día.
- Elegir usuarios o roles destinatarios.
- Notificación interna como primera etapa y correo electrónico como extensión.
- Notificar una vez por umbral y, opcionalmente, diariamente después del vencimiento.
- Configurar advertencia o bloqueo para autorizaciones vencidas.

Una tarea diaria revisará vencimientos, generará notificaciones sin duplicados y actualizará el estado visual. Nunca modificará documentos emitidos.

## Experiencia de usuario

Crear una sección `Configuración > Autorizaciones fiscales`, con:

- Vigentes.
- Próximas a vencer.
- Futuras.
- Vencidas e historial.
- Filtros por autorización, documento y punto de venta.
- Acciones Nueva autorización y Renovar.

Las alertas aparecerán en la campana, el panel administrativo, la configuración fiscal y la confirmación del documento.

## Permisos

- `fiscal-authorizations.read`
- `fiscal-authorizations.create`
- `fiscal-authorizations.update`
- `fiscal-authorizations.delete`
- `fiscal-authorizations.configure-alerts`

## Orden de implementación

1. Confirmar las clases de remito utilizadas por la empresa.
2. Crear modelo y migración de autorizaciones.
3. Incorporar permisos y seed.
4. Crear CRUD y pantalla de configuración.
5. Implementar resolución automática al confirmar.
6. Guardar el snapshot fiscal en el documento.
7. Incorporar los datos a la impresión.
8. Crear configuración de alertas y tarea diaria.
9. Probar renovaciones, vencimientos, rangos y múltiples puntos de venta.
10. Extender el modelo a CAE o CAEA cuando se implemente su circuito específico.
