# 🛍️ Ecommerce API - Backend con Node.js y MongoDB

> **Proyecto Final - Backend II**  
> **Coderhouse - Comisión 85605**  
> **Autor:** María Pía Zaniboni

API REST para un sistema de ecommerce con autenticación JWT, gestión de productos, carritos y compras con verificación de stock.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Rutas de la API](#️-rutas-de-la-api)
- [Probar la API con Postman](#-probar-la-api-con-postman)
- [Arquitectura del Proyecto](#️-arquitectura-del-proyecto)
- [Funcionalidades Principales](#-funcionalidades-principales)
- [Seguridad](#-seguridad)
- [Testing](#-testing)
- [Base de Datos](#-base-de-datos)
- [Autor](#-autor)

---

## ✨ Características

- ✅ **Arquitectura en capas** (Routes → Controllers → Services → Repositories → DAOs → Models)
- ✅ **Autenticación JWT** con cookies firmadas y httpOnly
- ✅ **Autorización por roles** (admin/user)
- ✅ **Sistema de recuperación de contraseña** con tokens temporales
- ✅ **CRUD completo de productos** (solo admin)
- ✅ **Gestión de carritos** de compra
- ✅ **Lógica de compra inteligente** con verificación de stock
- ✅ **Generación automática de tickets**
- ✅ **Emails transaccionales** (recuperación de contraseña y confirmación de compra)
- ✅ **DTOs** para respuestas seguras (sin datos sensibles)
- ✅ **Compras parciales** (productos sin stock quedan en el carrito)

---

## 🛠️ Tecnologías

- **Runtime:** Node.js
- **Framework:** Express.js
- **Base de datos:** MongoDB con Mongoose
- **Autenticación:** Passport.js + JWT
- **Seguridad:** bcrypt, cookie-parser, helmet
- **Emails:** Nodemailer (SMTP Gmail)
- **Validación:** Express Validator

---

## 📦 Requisitos Previos

- Node.js >= 18.x
- MongoDB >= 6.x
- Cuenta de Gmail con App Password configurada (para emails)

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/PiaZaniboni/comision-85605-maria-pia-zaniboni-entrega-final.git
cd comision-85605-maria-pia-zaniboni-entrega-final
```

### 2. Instalar dependencias

```bash
npm install
```

---

## 🔐 Configuración del Archivo `.env`

El proyecto incluye un archivo **`.env.example`** con las claves que se deben configurar.

Crear un archivo nuevo llamado **`.env`** en la raíz del proyecto y completar las variables necesarias siguiendo de guía ese ejemplo. 

🔒 **Las claves reales (Mongo y JWT) se encuentran en un archivo enviado mediante un link de Drive**, que contiene las credenciales seguras. 

### Estructura del archivo `.env`:

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGO_DB=integrative_practice

# JWT
JWT_SECRET=tu-secreto-super-seguro-cambialo
JWT_EXPIRES=15m

# Cookies
COOKIE_SECRET=otro-secreto-para-cookies
COOKIE_NAME=currentUser

# Bcrypt
BCRYPT_ROUNDS=10

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-app-password-de-gmail
EMAIL_FROM=tu-email@gmail.com

# Frontend URL (para links de recuperación)
FRONTEND_URL=http://localhost:3000
```

### Configurar Gmail App Password

1. Ve a tu cuenta de Google:  https://myaccount.google.com/
2. **Seguridad** → Activa **"Verificación en dos pasos"**
3. Busca **"Contraseñas de aplicaciones"**
4. Genera una contraseña para "Correo" → "Otro (nombre personalizado)"
5. Copia el código de 16 caracteres y úsalo en `EMAIL_PASS` (sin espacios)

---

## ▶️ Iniciar el Proyecto

```bash
npm start
```

El servidor estará disponible en:  **http://localhost:3000**

---

## 🛣️ Rutas de la API

### 🔐 Sesiones (Authentication)

| Método | Ruta | Descripción | Autenticación | Rol |
|--------|------|-------------|---------------|-----|
| POST | `/api/sessions/register` | Registrar un nuevo usuario (público) | No | - |
| POST | `/api/sessions/login` | Login de usuario y creación de JWT | No | - |
| GET  | `/api/sessions/current` | Devuelve los datos del usuario logueado | Sí | user/admin |
| GET  | `/api/sessions/logout` | Logout y eliminación de la cookie de sesión | No | - |
| POST | `/api/sessions/forgot-password` | Solicitar recuperación de contraseña | No | - |
| GET  | `/api/sessions/reset-password/: token` | Validar token de recuperación | No | - |
| POST | `/api/sessions/reset-password/: token` | Restablecer contraseña con token | No | - |

### 👥 Usuarios

| Método | Ruta | Descripción | Autenticación | Rol |
|--------|------|-------------|---------------|-----|
| GET  | `/api/users` | Listar todos los usuarios | Sí | admin |
| GET  | `/api/users/:id` | Obtener usuario por ID | Sí | admin |
| POST | `/api/users` | Crear usuario | Sí | admin |
| PUT  | `/api/users/:id` | Actualizar usuario | Sí | admin |
| DELETE | `/api/users/:id` | Eliminar usuario | Sí | admin |

### 📦 Productos

| Método | Ruta | Descripción | Autenticación | Rol |
|--------|------|-------------|---------------|-----|
| GET  | `/api/products` | Listar productos (público) | No | - |
| GET  | `/api/products/:id` | Obtener producto por ID (público) | No | - |
| POST | `/api/products` | Crear producto | Sí | admin |
| PUT  | `/api/products/:id` | Actualizar producto | Sí | admin |
| DELETE | `/api/products/:id` | Eliminar producto | Sí | admin |

**Query params para listar productos:**
- `limit`: Cantidad de resultados (default: 10)
- `page`: Página (default: 1)
- `category`: Filtrar por categoría
- `sort`: Ordenar por precio (`asc` o `desc`)

### 🛒 Carritos

| Método | Ruta | Descripción | Autenticación | Rol |
|--------|------|-------------|---------------|-----|
| POST | `/api/carts` | Crear carrito nuevo | No | - |
| GET  | `/api/carts/:cid` | Obtener carrito por ID | No | - |
| POST | `/api/carts/: cid/products/: pid` | Agregar producto al carrito | Sí | user |
| PUT  | `/api/carts/:cid/products/:pid` | Actualizar cantidad de producto | Sí | user |
| DELETE | `/api/carts/:cid/products/:pid` | Eliminar producto del carrito | Sí | user |
| DELETE | `/api/carts/:cid` | Vaciar carrito | Sí | user |
| POST | `/api/carts/:cid/purchase` | **Finalizar compra** | Sí | user |

### 🎫 Tickets

| Método | Ruta | Descripción | Autenticación | Rol |
|--------|------|-------------|---------------|-----|
| GET  | `/api/tickets` | Listar tickets (admin:  todos, user: solo suyos) | Sí | user/admin |
| GET  | `/api/tickets/my-tickets` | Mis tickets | Sí | user |
| GET  | `/api/tickets/:id` | Obtener ticket por ID | Sí | user/admin |

---

## 🧪 Probar la API con Postman

### 📥 Importar Colección

En el directorio `/postman` del proyecto encontrarás: 

- `ecommerce-api.postman_collection.json` - Colección con todas las rutas

**Pasos:**

1. Abre Postman
2. Click en **Import** (botón superior izquierdo)
3. Selecciona los archivos `.json` de la carpeta `/postman`
4. ¡Listo!  Ya tenés todas las requests configuradas

### 🔑 Flujo de Prueba Recomendado

#### **1. Registro y Login**

```
1. POST /api/sessions/register - Registrar usuario
2. POST /api/sessions/login - Login (guarda cookie automáticamente)
3. GET /api/sessions/current - Verificar sesión
```

**Ejemplo de registro:**
```json
POST /api/sessions/register
Content-Type: application/json

{
  "first_name": "Joe",
  "last_name": "Simpson",
  "email": "joe.simpson@test.com",
  "age": 3,
  "password": "pass123"
}
```

**Ejemplo de login:**
```json
POST /api/sessions/login
Content-Type: application/json

{
  "email": "Joe.simpson@test.com",
  "password": "pass123"
}
```

#### **2. Productos (como admin)**

```
4. POST /api/products - Crear productos
5. GET /api/products - Listar productos
6. GET /api/products/:id - Ver detalle
```

**Ejemplo de creación de producto:**
```json
POST /api/products
Content-Type: application/json

{
  "title": "Guitarra Eléctrica Ibanez G70",
  "description": "Guitarra eléctrica profesional",
  "code": "GTR003",
  "price": 1050000,
  "stock": 15,
  "category": "Guitarras Eléctricas",
  "thumbnails": ["https://example.com/guitarra2.jpg"]
}
```

#### **3. Carrito y Compra (como user)**

```
7. POST /api/carts - Crear carrito
8. POST /api/carts/: cid/products/:pid - Agregar productos
9. GET /api/carts/:cid - Ver carrito
10. POST /api/carts/:cid/purchase - Finalizar compra ✨
```

#### **4. Recuperación de Contraseña**

```
13. POST /api/sessions/forgot-password - Solicitar reset
14. (Revisar email con link y token)
15. GET /api/sessions/reset-password/:token - Validar token
16. POST /api/sessions/reset-password/:token - Cambiar contraseña
```

### ⚠️ Notas Importantes

- Las **cookies se manejan automáticamente** en Postman después del login
- Para probar como **admin**, usa las credenciales del usuario admin en la colección
- Para probar como **user**, registra un usuario nuevo (el rol será `user` por defecto)
- El endpoint de **purchase** verifica el stock y genera un ticket
- Revisa tu **email** para ver las confirmaciones de compra y recuperación de contraseña

### 📧 Emails que Recibirás

**1. Recuperación de Contraseña:**
- Link con token único
- Válido por 1 hora

**2. Confirmación de Compra:**
- Código de ticket único
- Fecha y hora de compra
- Tabla detallada con productos, cantidades, precios y subtotales
- Total de la compra

---

## 🏗️ Arquitectura del Proyecto

Este proyecto sigue el patrón de **arquitectura en capas**:

```
┌─────────────────┐
│    Routes       │  ← Define endpoints y aplica middlewares
└────────┬────────┘
         │
┌────────▼────────┐
│  Controllers    │  ← Maneja requests/responses y validaciones
└────────┬────────┘
         │
┌────────▼────────┐
│   Services      │  ← Lógica de negocio compleja
└────────┬────────┘
         │
┌────────▼────────┐
│  Repositories   │  ← Validaciones de reglas de negocio
└────────┬────────┘
         │
┌────────▼────────┐
│     DAOs        │  ← Acceso directo a datos (MongoDB)
└────────┬────────┘
         │
┌────────▼────────┐
│    Models       │  ← Schemas de Mongoose
└─────────────────┘
```

**Ventajas:**
- ✅ Separación de responsabilidades
- ✅ Código mantenible y testeable
- ✅ DTOs para respuestas seguras (sin datos sensibles)
- ✅ Fácil de escalar
- ✅ Cada capa tiene una única responsabilidad

### 📁 Estructura de Carpetas

```
src/
├── config/           # Configuración (Passport, DB)
├── controllers/      # Controladores (Request/Response)
├── dao/              # Data Access Objects
├── dto/              # Data Transfer Objects
├── middlewares/      # Middlewares personalizados
├── models/           # Schemas de Mongoose
├── repositories/     # Capa de validación de negocio
├── routes/           # Definición de rutas
├── services/         # Lógica de negocio
├── app.js            # Configuración de Express
└── server.js         # Punto de entrada

postman/              # Colecciones de Postman
public/               # Archivos estáticos
```

---

## ✨ Funcionalidades Principales

### 🔐 Sistema de Autenticación

- **JWT con cookies firmadas y httpOnly** para máxima seguridad
- **Passport.js** con estrategia local
- **Middleware de autorización por roles** (admin/user)
- **Recuperación de contraseña** con tokens temporales (expiran en 1 hora)
- **Validación de contraseña anterior** (no permite usar la misma password)
- **Tokens de un solo uso** (no se pueden reutilizar)

### 🛒 Sistema de Ecommerce

- **CRUD completo de productos** (solo admin puede crear/modificar/eliminar)
- **Gestión de carritos** (agregar, modificar cantidad, eliminar productos)
- **Lógica de compra inteligente:**
  - ✅ Verifica stock en tiempo real antes de comprar
  - ✅ Genera ticket solo con productos disponibles
  - ✅ Deja en el carrito productos sin stock suficiente
  - ✅ Actualiza stock automáticamente tras la compra
  - ✅ Soporta **compras parciales** (207 Multi-Status)
  - ✅ Calcula totales automáticamente

### 📧 Sistema de Emails

- **Recuperación de contraseña** con link único y seguro
- **Confirmación de compra** con detalle completo de productos
- **Templates HTML profesionales** y responsive
- **Integración con Gmail** vía SMTP
- **Manejo de errores** (la compra no falla si el email falla)

### 🎫 Sistema de Tickets

- **Generación automática** de código único (formato: `TICKET-timestamp-random`)
- **Historial de compras** por usuario
- **Autorización:** solo el comprador o admin pueden ver tickets
- **Detalle completo** de productos adquiridos con precios y cantidades
- **Timestamps** automáticos de creación

---

## 🔒 Seguridad

- ✅ **Contraseñas hasheadas** con bcrypt (10 rounds)
- ✅ **Cookies firmadas** con secret (previene manipulación)
- ✅ **JWT con expiración** (15 minutos por defecto)
- ✅ **DTOs ocultan datos sensibles** (password, __v, timestamps internos)
- ✅ **Middleware de roles** (admin/user) en rutas protegidas
- ✅ **Validación de inputs** en todos los endpoints
- ✅ **HttpOnly cookies** (previene ataques XSS)
- ✅ **Helmet. js** para headers de seguridad
- ✅ **CORS configurado** con credentials
- ✅ **Rate limiting** recomendado para producción

---

## 🧪 Testing

### Casos de Prueba Principales

#### ✅ **Compra Exitosa**
1. Crear productos con stock suficiente (como admin)
2. Agregar productos al carrito (como user)
3. Finalizar compra
4. Verificar que se genera el ticket
5. Verificar que el carrito queda vacío
6. Verificar que llega el email de confirmación
7. Verificar que el stock se actualizó

#### ⚠️ **Compra Parcial**
1. Crear producto con stock limitado (ej: 3 unidades)
2. Agregar a carrito con cantidad mayor (ej: 5 unidades)
3. Agregar otro producto con stock suficiente
4. Finalizar compra
5. Verificar respuesta **207 Multi-Status**
6. Verificar que el ticket tiene solo productos con stock
7. Verificar que el carrito tiene solo productos sin stock
8. Verificar email con productos comprados

#### ❌ **Sin Stock**
1. Vaciar stock de un producto
2. Intentar agregarlo al carrito
3. Verificar error `400 - Insufficient stock`

#### 🔐 **Recuperación de Contraseña**
1. Solicitar recuperación con email válido
2. Verificar email recibido con link
3. Extraer token del link
4. Validar token
5. Cambiar contraseña (debe ser diferente a la anterior)
6. Intentar reutilizar el token (debe fallar)
7. Login con nueva contraseña

---

## 📊 Base de Datos

### Colecciones MongoDB

- **users** - Usuarios del sistema
- **products** - Catálogo de productos
- **carts** - Carritos de compra activos
- **tickets** - Tickets/Órdenes generadas
- **passwordresets** - Tokens de recuperación (se auto-eliminan con TTL)

---

## 👨‍💻 Autor

**María Pía Zaniboni**

- GitHub: [@PiaZaniboni](https://github.com/PiaZaniboni)
- LinkedIn: [linkedin.com/in/pia-zaniboni](https://www.linkedin.com/in/pia-zaniboni/)
- Proyecto:  Entrega Final - Backend II
- Comisión: 85605 - Coderhouse

---

## 📄 Licencia

Este proyecto fue desarrollado como parte del curso de Backend de Coderhouse. 

---