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

## Instalación

Si es la primera vez que ejecutas el proyecto:

```bash
npm install
```

## Plugins disponibles

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) usa [Babel](https://babeljs.io/) para Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) usa [SWC](https://swc.rs/) para Fast Refresh

## React Compiler

El React Compiler no está habilitado en esta plantilla. Para agregarlo, consulta [esta documentación](https://react.dev/learn/react-compiler/installation).

## Configuración de ESLint

Si estás desarrollando una aplicación de producción, recomendamos usar TypeScript con reglas de linting conscientes de tipos. Consulta la [plantilla TS](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) para información sobre cómo integrar TypeScript y [`typescript-eslint`](https://typescript-eslint.io) en tu proyecto.
