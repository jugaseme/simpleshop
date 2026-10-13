<div align="center">

# 🛒 ShopSimple

**Plataforma de E-Commerce Fullstack moderna, segura y escalable**  
*Desarrollada para producción con React 18, Node.js, Express, PostgreSQL y Prisma ORM*

[![Frontend Deploy](https://img.shields.io/badge/Vercel-Frontend%20Live-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Backend Deploy](https://img.shields.io/badge/Render-API%20Live-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://shopsimple-api-5q3a.onrender.com)
[![Database](https://img.shields.io/badge/PostgreSQL-Cloud%20Active-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)

<br/>

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

<br/>

[⚡ API REST en Vivo (Render)](https://shopsimple-api-5q3a.onrender.com) · [📊 Estado de la API (Health)](https://shopsimple-api-5q3a.onrender.com/api/health) · [📦 Catálogo en Vivo (JSON)](https://shopsimple-api-5q3a.onrender.com/api/products)

</div>

---

> [!TIP]
> ### 🧪 Credenciales de Demostración para Evaluadores / Reclutadores
> Para probar las funcionalidades administrativas sin crear una cuenta nueva:
> - **URL de la API en Producción:** `https://shopsimple-api-5q3a.onrender.com`
> - **Usuario Administrador:** `admin@shopsimple.com`
> - **Contraseña:** `admin123456`
> - **Pasarela de Pago de Prueba:** Acepta cualquier número de tarjeta. *(Tip: Si termina en `0000` simula un rechazo bancario para probar flujos de error).*

---

## 📋 Tabla de Contenidos

- [Acerca del Proyecto](#-acerca-del-proyecto)
- [Aspectos de Ingeniería Destacados](#-aspectos-de-ingeniería-destacados)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Modelo de Base de Datos](#-modelo-de-base-de-datos)
- [Funcionalidades](#-funcionalidades)
- [Endpoints de la API en Producción](#-endpoints-de-la-api-en-producción)
- [Instalación Local](#-instalación-local)
- [Despliegue e Infraestructura](#-despliegue-e-infraestructura)
- [Estrategia para Expansión Móvil](#-estrategia-para-expansión-móvil)
- [Roadmap](#-roadmap)
- [Licencia](#-licencia)
- [Contacto](#-contacto)

---

## 🎯 Acerca del Proyecto

**ShopSimple** es una plataforma de comercio electrónico diseñada para resolver los desafíos habituales del desarrollo web comercial: rendimiento de carga, consistencia en la gestión de inventario, seguridad en las transacciones y una interfaz de usuario completamente responsiva.

El proyecto está concebido con una arquitectura **API-First desacoplada**, lo que permite que el mismo backend en la nube pueda alimentar la tienda web actual y, a futuro, aplicaciones móviles nativas para iOS y Android sin modificar la lógica de negocio.

---

## 💼 Aspectos de Ingeniería Destacados

Este proyecto fue desarrollado aplicando buenas prácticas de ingeniería de software para entornos de producción:

1. **Transacciones Atómicas (ACID) en Pedidos:**  
   La creación de órdenes se ejecuta dentro de transacciones de base de datos (`prisma.$transaction`). Si el stock de algún producto es insuficiente o una operación falla a mitad del proceso, se revierte toda la operación (rollback automático), evitando ventas de productos sin inventario o inconsistencias contables.
2. **Autenticación Stateless con JWT y Roles (RBAC):**  
   Implementación de tokens JWT firmados con expiración configurable y middleware de autorización para proteger endpoints críticos (creación, edición y borrado de productos, cambios de estado en pedidos).
3. **Seguridad en Almacenamiento de Credenciales:**  
   Hasheo irreversible de contraseñas con `bcryptjs` utilizando un factor de costo (*salt rounds*) de 10. Las contraseñas en texto plano nunca tocan la base de datos ni los logs.
4. **Política CORS Dinámica para Entornos Multi-Cloud:**  
   Middleware de CORS configurado para admitir dinámicamente dominios de producción (Vercel), entornos locales (`localhost:5173`) y clientes sin origen (Postman o futuras apps móviles).
5. **Persistencia Reactiva en Frontend:**  
   Estado global de carrito y sesión mediante Context API con sincronización en `localStorage`, garantizando que el usuario conserve su carrito tras recargar la página.
6. **CI/CD Continuo con GitHub:**  
   Integración continua: cada `git push` a la rama `main` dispara automáticamente las pruebas de compilación y el despliegue tanto en **Vercel** (Frontend) como en **Render** (Backend y migraciones de DB).

---

## 🛠 Stack Tecnológico

### Frontend
- **React 18** — Componentes funcionales, hooks personalizados y Context API.
- **Vite 6** — Empaquetador ultrarrápido con Hot Module Replacement (HMR).
- **React Router DOM v6** — Enrutamiento del lado del cliente con vistas protegidas.
- **CSS Modules** — Estilos con aislamiento de alcance (*scoped styles*) sin colisiones.
- **Lucide React** — Iconografía moderna, consistente y liviana.

### Backend
- **Node.js 22** — Runtime de JavaScript moderno con soporte nativo de ES Modules.
- **Express 4** — Framework REST minimalista, modular y de alto rendimiento.
- **Prisma ORM 5** — Mapeador objeto-relacional con tipado estricto, migraciones automáticas y pool de conexiones.
- **JSON Web Tokens (JWT)** — Autenticación segura y sin estado.
- **bcryptjs** — Encriptación criptográfica de contraseñas.

### Infraestructura y Nube
- **PostgreSQL 18 (Cloud)** — Servidor relacional alojado en la nube con backups automáticos y tipos ENUM.
- **Render** — Despliegue del backend Node.js en contenedor con auto-restart y health checks.
- **Vercel** — Despliegue del frontend SPA con distribución mediante CDN global y SSL automático.

---

## 📁 Arquitectura del Proyecto

```text
simpleshop/
├── 📂 database/                    # Scripts SQL nativos y esquemas
│   ├── schema.sql                  # DDL de PostgreSQL (tablas, ENUMs, índices)
│   ├── seed.sql                    # Datos iniciales de prueba
│   └── shopsimple_db.sql           # Backup / Dump completo de la base de datos
│
├── 📂 backend/                     # API REST (Node.js + Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma           # Esquema del ORM y relaciones
│   │   └── migrations/             # Historial de migraciones SQL
│   ├── src/
│   │   ├── config/db.js            # Conexión Prisma Client
│   │   ├── controllers/            # Controladores (auth, productos, pedidos)
│   │   ├── middleware/auth.js      # Verificación JWT y autorización de roles
│   │   ├── routes/                 # Rutas modulares (/auth, /products, /orders, /payments)
│   │   ├── utils/seed.js           # Script de carga inicial de datos
│   │   └── server.js               # Entrada principal de Express
│   ├── .env.example
│   └── package.json
│
├── 📂 frontend/                    # Aplicación Web SPA (React + Vite)
│   ├── src/
│   │   ├── components/             # Navbar, Footer, ProductCard
│   │   ├── context/                # AuthContext (JWT) y CartContext (persistencia)
│   │   ├── pages/                  # Home, ProductDetail, Cart, Checkout, Auth, Admin
│   │   ├── services/api.js         # Cliente HTTP centralizado con interceptor de token
│   │   ├── App.jsx                 # Enrutador principal
│   │   └── index.css               # Variables CSS y sistema de diseño
│   ├── index.html
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🗄 Modelo de Base de Datos

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   USERS      │       │  CATEGORIES  │       │   PRODUCTS   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │       │ id (PK)      │
│ name         │       │ name (UK)    │───┐   │ name         │
│ email (UK)   │       │ slug (UK)    │   │   │ slug (UK)    │
│ password_hash│       │ description  │   └──▶│ category_id  │
│ role (ENUM)  │       │ image_url    │       │ price        │
│ phone        │       └──────────────┘       │ stock        │
│ address      │                              │ image_url    │
└──────┬───────┘                              │ is_active    │
       │                                      └──────┬───────┘
       │ 1:N                                         │
       ▼                                             │
┌──────────────┐       ┌──────────────┐              │
│   ORDERS     │       │ ORDER_ITEMS  │              │
├──────────────┤       ├──────────────┤              │
│ id (PK)      │──┐    │ id (PK)      │              │
│ user_id (FK) │  │    │ order_id (FK)│◀─────────────┘
│ total_amount │  └───▶│ product_id   │
│ status       │       │ quantity     │
│ payment_*    │       │ unit_price   │
│ shipping_addr│       │ subtotal     │
└──────────────┘       └──────────────┘
```

---

## ✨ Funcionalidades Principales

### Para Clientes:
- **Catálogo Dinámico:** Filtrado instantáneo por categorías y buscador reactivo por texto.
- **Detalle de Producto:** Especificaciones completas, selector de cantidad y visualizador de stock en tiempo real.
- **Carrito de Compras:** Cálculo en vivo de subtotales y totales, incremento/decremento y eliminación de productos con persistencia en navegador.
- **Proceso de Checkout:** Formulario validado de datos de envío y pasarela de pago simulada para tarjetas de crédito/débito.
- **Autenticación Completa:** Registro seguro de clientes e inicio de sesión persistente.

### Para Administradores:
- **Panel de Control (Dashboard):** Vista integral de productos e historial de órdenes.
- **CRUD de Inventario:** Creación y edición de productos a través de formularios modales interactivos.
- **Baja Lógica (*Soft Delete*):** Desactivación segura de productos sin romper la integridad referencial de pedidos históricos.
- **Gestión de Pedidos:** Actualización en tiempo real del estado de entrega (`PENDING` → `PAID` → `PROCESSING` → `SHIPPED` → `DELIVERED` → `CANCELLED`).

---

## 📡 Endpoints de la API en Producción

**Base URL:** `https://shopsimple-api-5q3a.onrender.com`

| Método | Endpoint | Descripción | Acceso |
|:---:|---|---|:---:|
| `GET` | `/` | Información general y estado de la API | Público |
| `GET` | `/api/health` | Health check del servidor (uptime y timestamp) | Público |
| `POST` | `/api/auth/register` | Registro de nuevos clientes | Público |
| `POST` | `/api/auth/login` | Inicio de sesión y entrega de token JWT | Público |
| `GET` | `/api/auth/profile` | Datos de perfil del usuario logueado | 🔒 Requiere JWT |
| `GET` | `/api/products` | Lista de productos (filtros por categoría y búsqueda) | Público |
| `GET` | `/api/products/categories` | Lista de categorías disponibles | Público |
| `GET` | `/api/products/:id` | Detalle específico de un producto | Público |
| `POST` | `/api/products` | Crear nuevo producto | 🛡️ Solo Admin |
| `PUT` | `/api/products/:id` | Editar información o inventario de producto | 🛡️ Solo Admin |
| `DELETE` | `/api/products/:id` | Desactivar producto del catálogo | 🛡️ Solo Admin |
| `POST` | `/api/orders` | Procesar pedido y descontar stock atómicamente | 🔒 Requiere JWT |
| `GET` | `/api/orders/my-orders` | Historial de pedidos del cliente | 🔒 Requiere JWT |
| `GET` | `/api/orders/admin/all` | Listado completo de órdenes para administración | 🛡️ Solo Admin |
| `PATCH` | `/api/orders/:id/status`| Actualizar estado de despacho de una orden | 🛡️ Solo Admin |
| `POST` | `/api/payments/simulate`| Simulación de procesamiento de pago | 🔒 Requiere JWT |

---

## 💻 Instalación Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/jugaseme/simpleshop.git
cd simpleshop

# 2. Configurar el Backend
cd backend
npm install
cp .env.example .env
# Configura DATABASE_URL con tus credenciales de PostgreSQL

# 3. Migrar base de datos y cargar datos iniciales
npx prisma migrate dev --name init
npm run seed

# 4. Iniciar servidor backend
npm run dev
# -> Corriendo en http://localhost:5000

# 5. En otra terminal, configurar e iniciar el Frontend
cd ../frontend
npm install
npm run dev
# -> Corriendo en http://localhost:5173
```

---

## 🌐 Despliegue e Infraestructura

El proyecto se encuentra en producción mediante la siguiente arquitectura:

- **Frontend en Vercel:** Compilado como SPA estática ultrarrápida servida mediante Edge Network con compresión Gzip.
- **Backend en Render:** Servicio web de Node.js en contenedor Linux, con reinicio automático ante fallos y escalabilidad vertical.
- **Base de Datos en Render PostgreSQL:** Instancia PostgreSQL gestionada con SSL obligatorio (`sslmode=require`) y pool de conexiones activo.

---

## 📱 Estrategia para Expansión Móvil

La arquitectura de **ShopSimple** fue concebida para permitir el desarrollo inmediato de una aplicación móvil:

- **Framework sugerido:** **React Native con Expo**, permitiendo compartir el 80% de la lógica ya implementada (servicios de API, tipados, helpers de cálculo y contextos).
- **Consumo de la API:** La aplicación móvil consume directamente los endpoints `https://shopsimple-api-5q3a.onrender.com/api/...` mediante el encabezado `Authorization: Bearer <token>`.
- **Manejo de Sesión Segura:** En móviles, el token JWT se almacena utilizando **`expo-secure-store`** (integración nativa con iOS Keychain y Android KeyStore).
- **Notificaciones Push:** Integración con **Expo Push Notifications** para avisar al cliente cuando el estado de su pedido cambie en el panel administrativo.

---

## 🗺 Roadmap

- [x] Arquitectura Fullstack e integración de base de datos relacional.
- [x] Autenticación JWT y control de roles (Cliente / Admin).
- [x] Panel de administración interactivo con gestión de productos y pedidos.
- [x] Despliegue continuo en la nube (Vercel + Render + PostgreSQL Cloud).
- [ ] Integración con SDK de Mercado Pago / Stripe en producción.
- [ ] Carga y optimización de imágenes en la nube con Cloudinary.
- [ ] Notificaciones transaccionales automáticas vía email (SendGrid/Resend).
- [ ] Desarrollo de la aplicación móvil nativa con React Native y Expo.

---

## 📄 Licencia

Este proyecto está bajo la Licencia **MIT** — puedes utilizarlo, modificarlo y distribuirlo libremente. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

## 📬 Contacto / Autor

**Juan Sebastián García Medina**  
Desarrollador Fullstack

- **GitHub:** [@jugaseme](https://github.com/jugaseme)
- **Repositorio:** [github.com/jugaseme/simpleshop](https://github.com/jugaseme/simpleshop)
