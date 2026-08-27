# Sistema de Gestión de Citas y Cupos

Aplicación web full-stack para la administración, programación y reserva de citas, desarrollada con Node.js, Express, React y MySQL. Cuenta con control de acceso basado en roles (Prestadores y Solicitantes), autenticación mediante JWT, transacciones SQL seguras y una interfaz moderna con TailwindCSS.

## Características Principales

- Autenticación segura con JWT y cifrado de contraseñas mediante bcrypt.
- Asignación dinámica de perfiles y roles (Prestador o Solicitante) al primer inicio de sesión.
- Panel de gestión para prestadores (creación de citas con validación de fecha y control de cupos).
- Panel de consulta y reserva para solicitantes (visualización de prestadores disponibles, listado de citas y confirmación de reservas).
- Manejo de transacciones en base de datos (`BEGIN`, `COMMIT`, `ROLLBACK`, `FOR UPDATE`) para evitar sobreventas o duplicidad de cupos.

## Tecnologías Utilizadas

- **Frontend:** React, Vite, TailwindCSS, Axios
- **Backend:** Node.js, Express, MySQL2, jsonwebtoken, bcrypt
- **Base de Datos:** MySQL

## Requisitos Previos

- Node.js instalado en el sistema.
- Servidor MySQL activo.

## Guía de Ejecución

1. **Base de Datos:**
   Importa el archivo SQL de la base de datos en tu gestor MySQL para configurar las tablas necesarias (`usuarios`, `roles`, `usuarios_roles`, `citas`, `cupos`, etc.).

2. **Configurar y Levantar el Backend:**
   Abre una terminal en la carpeta del servidor e integra tus credenciales de base de datos en un archivo `.env`:

```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD= (vacia o la que se tenga)
   DB_NAME=sistema_citas
   JWT_SECRET=scrsc2108
   PORT=3000
```

   Instala las dependencias y arranca el servidor:

```bash
   npm install
   npm run dev
```

3. **Configurar y Levantar el Frontend:**
   Abre otra terminal en la carpeta del cliente web, instala las dependencias y ejecuta el entorno de desarrollo:

```bash
   npm install 
   npm run dev
```

4. **Uso de la Aplicación:**
   Abre en tu navegador el enlace local generado por Vite (usualmente `http://localhost:5173`), regístrate, asigna tu rol y comprueba el flujo completo del sistema.