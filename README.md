# Entrega Nº 1 -- Backend II

### Alumna: María Pía Zaniboni

## 📌 Descripción del Proyecto

Este repositorio corresponde a la **Entrega 1** de la materia **Backend
II**, donde se implementa:

-   CRUD de usuarios
-   Registro con contraseña encriptada con **bcrypt**
-   Autenticación y autorización utilizando **Passport**
-   Generación de **JWT** para manejo de sesiones
-   Validación del usuario autenticado mediante `/api/sessions/current`
-   Rutas para frontend utilizando Handlebars

------------------------------------------------------------------------

## 📥 Clonar el Proyecto

Para descargar el repositorio:

``` bash
git clone https://github.com/PiaZaniboni/comision-85605-maria-pia-zaniboni.git
```

Luego ingresar al directorio:

``` bash
cd comision-85605-maria-pia-zaniboni
```

------------------------------------------------------------------------

## 📦 Instalar Dependencias

Ejecutar:

``` bash
npm i
```

------------------------------------------------------------------------

## 🔐 Configuración del Archivo `.env`

El proyecto incluye un archivo **`.env.example`** con las claves que se
deben configurar.

Crear un archivo nuevo llamado **`.env`** en la raíz del proyecto y
completar las variables necesarias siguiendo de guía ese ejemplo.

🔒 **Las claves reales (Mongo y JWT) se encuentran en un archivo enviado
mediante un link de Drive**, que contiene las credenciales seguras.

------------------------------------------------------------------------

## 🛣️ Rutas de la API

### Sesiones

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/sessions/register` | Registrar un nuevo usuario (**solo admin**) |
| POST | `/api/sessions/login` | Login de usuario y creación de JWT |
| GET  | `/api/sessions/current` | Devuelve los datos del usuario logueado en formato JSON |
| GET  | `/api/sessions/logout` | Logout y eliminación de la cookie de sesión |

### Usuarios

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET  | `/api/users/` | Listar todos los usuarios (**solo admin**) |

------------------------------------------------------------------------

## 🌐 Rutas Frontend (Handlebars)

| Ruta | Descripción |
|------|-------------|
| [Login](http://localhost:3000/login) | Formulario de login |
| [Registro](http://localhost:3000/register) | Formulario de registro |
| [Perfil](http://localhost:3000/current) | Página que muestra los datos del usuario logueado |
| `/logout` | Logout y redirección al login |

---

## ▶️ Iniciar el Proyecto

```bash
npm run start
```

Luego abrir en el navegador:  

- [Login](http://localhost:3000/login)  
- [Registro](http://localhost:3000/register)  
- [Perfil](http://localhost:3000/current)  

