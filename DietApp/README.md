# DietApp - React + Vite

Esta aplicación de dieta está construida con React y Vite, proporcionando una configuración mínima para trabajar con React, HMR (Hot Module Replacement) y reglas de ESLint.

## Comandos disponibles

### Desarrollo
```bash
npm run dev
```
Inicia el servidor de desarrollo con Vite en `http://localhost:5173/`
- Incluye Hot Module Replacement (HMR) para cambios en tiempo real
- Recarga automática del navegador cuando guardas cambios

### Compilación para producción
```bash
npm run build
```
Compila y optimiza la aplicación para producción:
- Genera archivos estáticos en la carpeta `dist/`
- Minifica el código
- Optimiza imágenes y otros assets

### Previsualización de producción
```bash
npm run preview
```
Sirve los archivos compilados localmente para probar la versión de producción antes del despliegue.

### Linting
```bash
npm run lint
```
Ejecuta ESLint para verificar la calidad del código.

## Tecnologías y dependencias principales

- **Frontend:**
  - React (^19.1.1)
  - Vite (^7.1.7)
  - Material UI (@mui/material ^7.3.7)
  - @emotion/react (^11.14.0) y @emotion/styled (^11.14.1)
  - Node.js v22.20.0

- **Backend:**
  - Express (^5.2.1)
  - CORS (^2.8.6)
  - Node.js v22.20.0

## Estructura del proyecto

- El frontend utiliza React, Vite y Material UI para la interfaz.
- El backend está construido con Express y sirve los datos desde un archivo JSON.

## Instalación

Asegúrate de tener Node.js v22.20.0 o superior.

Instala dependencias en cada carpeta (DietApp y DietApp-BE):

```bash
cd DietApp
npm install
cd ../DietApp-BE
npm install
```

## Notas

- Material UI se usa para los componentes visuales.
- Express se usa para el backend y la API.
- Consulta package.json en cada carpeta para ver todas las dependencias y versiones.
