# Hotelería — Demo de interfaz (solo frontend)

Maqueta funcional de un sistema de gestión hotelera, pensada como demostración visual e interactiva (sin backend real; los datos son simulados con JavaScript y `localStorage`).

## Cómo abrir la demo
1. Descomprimí el archivo ZIP.
2. Abrí `index.html` en tu navegador (doble clic, o clic derecho → "Abrir con" → tu navegador).
3. Elegí una sucursal, ingresá cualquier usuario/contraseña (es una demo) y navegá el sistema.

No necesita instalación, servidor ni conexión a base de datos — es HTML, CSS y JavaScript puro.

## Qué incluye
- **Login con selección de sucursal** (`index.html`): primero se elige la sucursal, luego se ingresan las credenciales.
- **Panel principal** (`dashboard.html`): estadísticas, mapa visual de habitaciones y reservas recientes.
- **Habitaciones** (`habitaciones.html`): listado filtrable, precios y estado de cada habitación.
- **Reservas** (`reservas.html`): listado de reservas con formulario de alta.
- **Huéspedes** (`huespedes.html`): ficha y listado de huéspedes.
- **Facturación** (`facturacion.html`): facturas con subtotal, IVA y total.
- **Reportes** (`reportes.html`): gráficos de ingresos y comparativo entre sucursales.

## Dos sucursales, datos independientes
- **Sucursal Centro** (Asunción): 30 habitaciones numeradas **101 a 130**.
- **Sucursal Ciudad del Este**: 22 habitaciones numeradas **201 a 222**.

Cada sucursal tiene su propia numeración de habitaciones, ocupación, reservas, huéspedes y facturación — son independientes entre sí, tal como se pidió.

## Multi-moneda
Todo el sistema puede alternar entre **Guaraníes (Gs)**, **Dólares (US$)** y **Reales (R$)** con el selector ubicado en la barra superior de cada pantalla. Los montos base están en guaraníes y se convierten automáticamente (tasas de referencia definidas en `assets/app.js`).

## Estructura de archivos
```
hoteleria/
├── index.html          → Login + selección de sucursal
├── dashboard.html       → Panel principal
├── habitaciones.html    → Gestión de habitaciones
├── reservas.html        → Gestión de reservas
├── huespedes.html        → Gestión de huéspedes
├── facturacion.html      → Facturación
├── reportes.html         → Reportes y estadísticas
└── assets/
    ├── styles.css        → Sistema de diseño (colores, tipografía, componentes)
    └── app.js             → Datos simulados y lógica compartida
```

## Notas
- Es una demostración de **frontend únicamente**: los datos se generan en el navegador y no se guardan en un servidor.
- Para producción se necesitaría conectar cada pantalla a una API/backend real (autenticación, base de datos de habitaciones, reservas, pagos, etc.).
