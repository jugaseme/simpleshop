<div align="center">

# 🛒 ShopSimple

**Plataforma de E-Commerce Fullstack moderna, segura y escalable**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[Demo en Vivo](#) · [Reportar Bug](../../issues) · [Solicitar Feature](../../issues)

</div>

---

## 📋 Tabla de Contenidos

- [Acerca del Proyecto](#-acerca-del-proyecto)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Modelo de Base de Datos](#-modelo-de-base-de-datos)
- [Funcionalidades](#-funcionalidades)
- [Primeros Pasos](#-primeros-pasos)
- [Variables de Entorno](#-variables-de-entorno)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Despliegue](#-despliegue)
- [Roadmap](#-roadmap)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)
- [Contacto](#-contacto)

---

## 🎯 Acerca del Proyecto

**ShopSimple** es una solución integral de comercio electrónico diseñada desde cero con un enfoque en rendimiento, seguridad y experiencia de usuario. Permite a los negocios gestionar su catálogo de productos, procesar pedidos y administrar clientes a través de una interfaz intuitiva y completamente responsiva.

### ¿Por qué ShopSimple?

- **🚀 Rendimiento:** Frontend optimizado con Vite y React 18, con lazy loading de imágenes y código dividido automáticamente.
- **🔒 Seguridad:** Autenticación basada en JWT, contraseñas encriptadas con bcrypt (salt rounds = 10), protección CORS configurable y validación de datos en cada endpoint.
- **📱 Responsivo:** Diseño mobile-first con CSS Modules y breakpoints adaptativos para una experiencia fluida en smartphones, tablets y escritorio.
- **⚡ Arquitectura Escalable:** Separación clara entre frontend y backend con API REST desacoplada, lista para integrar aplicaciones móviles nativas en el futuro.
- **💳 Pagos Flexibles:** Pasarela de pago simulada incluida para pruebas, con estructura preparada para integración directa con Mercado Pago o Stripe en producción.

---

## 📸 Capturas de Pantalla

> *Próximamente — Capturas del catálogo, carrito, checkout y panel de administración.*

---

## 🛠 Stack Tecnológico

### Frontend
| Tecnología | Propósito |
|---|---|
| **React 18** | Biblioteca de UI con hooks y componentes funcionales |
| **Vite 6** | Bundler ultrarrápido con HMR instantáneo |
| **React Router DOM v6** | Enrutamiento SPA con rutas protegidas |
| **CSS Modules** | Estilos encapsulados por componente, sin colisiones |
| **Lucide React** | Iconografía moderna y liviana (tree-shakeable) |

### Backend
| Tecnología | Propósito |
|---|---|
| **Node.js 22** | Runtime de JavaScript del lado del servidor |
| **Express 4** | Framework HTTP minimalista y flexible |
| **Prisma ORM 5** | ORM moderno con migraciones, tipado y query builder |
| **JWT (jsonwebtoken)** | Tokens de autenticación stateless |
| **bcryptjs** | Hashing seguro de contraseñas |

### Base de Datos & Infraestructura
| Tecnología | Propósito |
|---|---|
| **PostgreSQL 18** | Base de datos relacional robusta y escalable |
| **Vercel** | Hosting del frontend con CDN global y SSL automático |
| **Render / Railway** | Hosting del backend y base de datos en la nube |

---

## 📁 Arquitectura del Proyecto

```text
simpleshop/
├── 📂 database/                    # Scripts SQL nativos
│   ├── schema.sql                  # DDL: tablas, ENUMs, índices y restricciones
│   └── seed.sql                    # Datos iniciales de prueba
│
├── 📂 backend/                     # API REST (Node.js + Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma           # Modelo de datos tipado (ORM)
│   │   └── migrations/             # Historial de migraciones
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # Instancia del cliente Prisma
│   │   ├── controllers/
│   │   │   ├── authController.js   # Registro, login y perfil
│   │   │   ├── productController.js# CRUD de productos y categorías
│   │   │   └── orderController.js  # Gestión de pedidos con transacciones
│   │   ├── middleware/
│   │   │   └── auth.js             # Verificación JWT + autorización por rol
│   │   ├── routes/
│   │   │   ├── authRoutes.js       # POST /register, /login, GET /profile
│   │   │   ├── productRoutes.js    # GET/POST/PUT/DELETE /products
│   │   │   ├── orderRoutes.js      # POST /orders, GET /my-orders, PATCH status
│   │   │   └── paymentRoutes.js    # POST /simulate (pasarela de prueba)
│   │   ├── utils/
│   │   │   └── seed.js             # Script de seed automatizado con Prisma
│   │   └── server.js               # Punto de entrada Express
│   ├── .env.example
│   └── package.json
│
├── 📂 frontend/                    # Aplicación Web SPA (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Barra de navegación con estado reactivo
│   │   │   ├── Footer.jsx          # Pie de página responsivo
│   │   │   └── ProductCard.jsx     # Tarjeta de producto interactiva
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Estado global de autenticación (JWT)
│   │   │   └── CartContext.jsx     # Carrito persistente en localStorage
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Catálogo con buscador y filtros
│   │   │   ├── ProductDetail.jsx   # Vista detallada del producto
│   │   │   ├── Cart.jsx            # Carrito de compras editable
│   │   │   ├── Checkout.jsx        # Formulario de envío y pago
│   │   │   ├── Auth.jsx            # Login y registro de clientes
│   │   │   └── Admin.jsx           # Panel de administración (CRUD + pedidos)
│   │   ├── services/
│   │   │   └── api.js              # Cliente HTTP centralizado con JWT
│   │   ├── App.jsx                 # Router principal y providers
│   │   └── index.css               # Sistema de diseño con variables CSS
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

### ENUMs definidos:
- **`Role`**: `CLIENT` | `ADMIN`
- **`OrderStatus`**: `PENDING` | `PAID` | `PROCESSING` | `SHIPPED` | `DELIVERED` | `CANCELLED`
- **`PaymentStatus`**: `PENDING` | `APPROVED` | `REJECTED` | `REFUNDED`

---

## ✨ Funcionalidades

### 🛍 Tienda (Cliente)
- [x] Catálogo de productos con imágenes, descripciones y precios
- [x] Buscador en tiempo real por nombre y descripción
- [x] Filtrado por categorías dinámicas
- [x] Vista detallada de cada producto con stock disponible
- [x] Carrito de compras persistente (sobrevive recargas del navegador)
- [x] Agregar, quitar y modificar cantidades con validación de stock
- [x] Proceso de Checkout con dirección de envío y simulación de pago
- [x] Historial de pedidos del cliente

### 🔐 Autenticación y Seguridad
- [x] Registro de nuevos clientes con validación de datos
- [x] Login con JWT y sesión persistente
- [x] Contraseñas encriptadas con bcrypt (nunca se almacenan en texto plano)
- [x] Middleware de autorización por roles (CLIENT / ADMIN)
- [x] Protección CORS configurable por entorno

### ⚙️ Panel de Administración
- [x] Dashboard con vista tabular de productos y pedidos
- [x] Crear nuevos productos con imagen, precio, stock y categoría
- [x] Editar productos existentes mediante modal interactivo
- [x] Desactivar productos (eliminación lógica para preservar historial)
- [x] Cambiar estado de pedidos en tiempo real (Pendiente → Pagado → Enviado → Entregado)

### 💳 Pasarela de Pagos
- [x] Simulador de pagos integrado para pruebas de flujo completo
- [x] Simulación de rechazo bancario (tarjetas terminadas en `0000`)
- [x] Estructura preparada para Mercado Pago Checkout Pro

### 📱 Diseño Responsivo
- [x] Mobile-first con breakpoints en 640px, 768px y 860px
- [x] Grid adaptativo para el catálogo de productos
- [x] Navegación optimizada para pantallas táctiles
- [x] CSS Modules para estilos encapsulados sin conflictos

---

## 🚀 Primeros Pasos

### Prerrequisitos

- [Node.js](https://nodejs.org) v18 o superior
- [PostgreSQL](https://www.postgresql.org) v14 o superior
- [Git](https://git-scm.com)

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/jugaseme/simpleshop.git
cd simpleshop

# 2. Instalar dependencias del backend
cd backend
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Edita .env con tu DATABASE_URL y JWT_SECRET

# 4. Ejecutar migraciones y seed de datos
npx prisma migrate dev --name init
npm run seed

# 5. Iniciar el servidor backend
npm run dev
# ✅ Backend corriendo en http://localhost:5000

# 6. En otra terminal, instalar y arrancar el frontend
cd ../frontend
npm install
npm run dev
# ✅ Frontend corriendo en http://localhost:5173
```

### Credenciales de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| **Admin** | `admin@shopsimple.com` | `admin123456` |

---

## 🔑 Variables de Entorno

Crea un archivo `.env` en la carpeta `backend/` con las siguientes variables:

```env
PORT=5000
DATABASE_URL="postgresql://usuario:password@host:5432/shopsimple_db?schema=public"
JWT_SECRET="tu_clave_secreta_aqui"
JWT_EXPIRES_IN="7d"
CLIENT_URL="http://localhost:5173"
```

---

## 📡 Endpoints de la API

### Autenticación (`/api/auth`)
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `POST` | `/register` | Registrar nuevo usuario | ❌ |
| `POST` | `/login` | Iniciar sesión | ❌ |
| `GET` | `/profile` | Obtener perfil del usuario | ✅ JWT |

### Productos (`/api/products`)
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/` | Listar productos (con filtros) | ❌ |
| `GET` | `/categories` | Listar categorías | ❌ |
| `GET` | `/:id` | Detalle de un producto | ❌ |
| `POST` | `/` | Crear producto | ✅ Admin |
| `PUT` | `/:id` | Actualizar producto | ✅ Admin |
| `DELETE` | `/:id` | Desactivar producto | ✅ Admin |

### Pedidos (`/api/orders`)
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `POST` | `/` | Crear nuevo pedido | ✅ JWT |
| `GET` | `/my-orders` | Pedidos del usuario | ✅ JWT |
| `GET` | `/admin/all` | Todos los pedidos | ✅ Admin |
| `PATCH` | `/:id/status` | Actualizar estado del pedido | ✅ Admin |

### Pagos (`/api/payments`)
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `POST` | `/simulate` | Simular procesamiento de pago | ✅ JWT |

---

## 🌐 Despliegue

### Frontend → Vercel
1. Importar repositorio en [vercel.com](https://vercel.com)
2. Root Directory: `frontend`
3. Framework Preset: `Vite`
4. Variable de entorno: `VITE_API_URL` = URL de tu backend

### Backend → Render / Railway
1. Conectar repositorio desde el dashboard
2. Root Directory: `backend`
3. Build Command: `npm install && npx prisma generate`
4. Start Command: `npm start`
5. Configurar variables de entorno: `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`

### Base de Datos → Neon / Supabase / Railway
- Crear instancia PostgreSQL gratuita
- Copiar la cadena de conexión en `DATABASE_URL`
- Ejecutar `npx prisma migrate deploy`

---

## 🗺 Roadmap

- [ ] Integración con Mercado Pago Checkout Pro (producción)
- [ ] Subida de imágenes a Cloudinary o S3
- [ ] Notificaciones por email (confirmación de pedido)
- [ ] Aplicación móvil con React Native + Expo
- [ ] Búsqueda avanzada con Algolia o Elasticsearch
- [ ] Wishlist / Lista de deseos
- [ ] Sistema de reseñas y calificaciones
- [ ] Dashboard de métricas y ventas para administradores

---

## 🤝 Contribuir

Las contribuciones son bienvenidas y apreciadas.

1. Haz un Fork del proyecto
2. Crea tu rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Distribuido bajo la Licencia MIT. Ver [`LICENSE`](LICENSE) para más información.

---

## 📬 Contacto

**Juan Sebastián García Medina**

[![GitHub](https://img.shields.io/badge/GitHub-jugaseme-181717?style=flat-square&logo=github)](https://github.com/jugaseme)

---

<div align="center">

Hecho con ❤️ y ☕ en Colombia 🇨🇴

</div>
