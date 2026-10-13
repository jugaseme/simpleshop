# 🛒 ShopSimple - E-Commerce Fullstack

Plataforma de comercio electrónico moderna, modular, segura y responsiva construida con **React (Vite)**, **Node.js (Express)**, **PostgreSQL** y **Prisma ORM**.

---

## 📁 Arquitectura del Proyecto

```text
e-comerce/
├── database/               # Scripts SQL DDL y datos de prueba (Seed)
│   ├── schema.sql          # Creación de tablas, ENUMs e índices
│   └── seed.sql            # Datos de prueba para categorías y productos
├── backend/                # API REST (Node.js + Express + Prisma)
│   ├── prisma/             # Esquema y migraciones de Prisma ORM
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/    # Lógica de controladores (auth, productos, pedidos)
│   │   ├── routes/         # Rutas de la API (/api/auth, /api/products, etc.)
│   │   ├── middleware/     # Autenticación JWT, verificación de roles (admin)
│   │   ├── config/         # Conexión a base de datos y variables de entorno
│   │   └── server.js       # Punto de entrada Express
│   ├── .env.example
│   └── package.json
├── frontend/               # Aplicación Web SPA (React + Vite)
│   ├── src/
│   │   ├── components/     # Navbar, Footer, ProductCard, CartModal, etc.
│   │   ├── context/        # Estado global (CartContext, AuthContext)
│   │   ├── pages/          # Home, ProductDetail, Cart, Checkout, Login, Admin
│   │   ├── services/       # Conectores HTTP para la API
│   │   └── styles/         # CSS Modules y estilos globales
│   ├── index.html
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🗄️ Modelo de Base de Datos (PostgreSQL)

### Tablas Principales:
1. **`users`**: Gestión de clientes y administradores con contraseñas encriptadas con bcrypt y roles (`CLIENT`, `ADMIN`).
2. **`categories`**: Categorización del catálogo con slugs amigables para SEO.
3. **`products`**: Productos con precio, stock, imagen, descripción, categoría y estado activo.
4. **`orders`**: Pedidos asociados a usuarios, con total, dirección de envío, estado del pedido y estado del pago.
5. **`order_items`**: Detalle del pedido con relación al producto, cantidad, precio unitario histórico y subtotal.

---

## 📱 Asesoramiento Estratégico y Técnico para Futuras Apps Móviles

Para expandir **ShopSimple** a iOS y Android sin rehacer el backend ni duplicar la lógica de negocio, se recomienda:

### 1. Stack Móvil Recomendado: **React Native con Expo**
- **Reutilización de conocimiento:** Mismo lenguaje (JavaScript/TypeScript), misma estructura de componentes y hooks (`useEffect`, `useState`, contextos).
- **Multiplataforma real:** Un solo código base para compilar tanto para Android (APK/AAB) como para iOS (IPA).
- **Expo Router:** Enrutamiento basado en archivos (similar a Next.js) que facilita la navegación fluida.

### 2. Arquitectura de API desacoplada (API First)
- Nuestro backend en Express provee endpoints REST estandarizados con respuestas JSON y códigos HTTP estándar.
- La futura app móvil consumirá exactamente los mismos endpoints:
  - `POST /api/auth/login` y `POST /api/auth/register`
  - `GET /api/products` y `GET /api/products/:id`
  - `POST /api/orders` y `GET /api/orders/my-orders`

### 3. Seguridad y Persistencia de Sesión
- En la web se usan Cookies `httpOnly` o `localStorage`.
- En móviles se debe usar **`expo-secure-store`** (iOS Keychain y Android EncryptedSharedPreferences) para almacenar el token JWT de forma segura contra ataques físicos o de extracción.

### 4. Pasarelas de Pago en Móvil
- **Mercado Pago:** SDK nativo (`@mercadopago/mobile-rn`) o WebView con Checkout Pro.
- **Stripe:** `@stripe/stripe-react-native` con soporte directo para Google Pay y Apple Pay.

### 5. Notificaciones Push y Experiencia Nativa
- Con **Expo Notifications**, el backend puede enviar notificaciones push automáticas cuando el pedido cambie de estado: *"¡Tu pedido #102 ha sido enviado!"*.

---

## 🌐 Estrategia de Dominio y Despliegue

| Componente | Plataforma Recomendada | Ventajas |
|---|---|---|
| **Frontend** | [Vercel](https://vercel.com) | Despliegue continuo con Git, CDN global rápida, SSL gratuito y configuración de dominio propio con 1 clic (DNS CNAME). |
| **Backend** | [Render](https://render.com) o [Railway](https://railway.app) | Node.js nativo, reinicios automáticos, variables de entorno seguras, soporte de websockets. |
| **Base de Datos** | PostgreSQL en [Railway](https://railway.app), [Neon](https://neon.tech) o [Supabase](https://supabase.com) | Servidor PostgreSQL administrado en la nube con backups y conexión segura SSL. |

### Configuración de Dominio Propio:
1. Comprar dominio (por ejemplo en Namecheap, GoDaddy o Cloudflare).
2. En Vercel: Añadir el dominio en *Project Settings > Domains*.
3. En el proveedor del dominio:
   - Configurar registro `CNAME` apuntando a `cname.vercel-dns.com` (para `www`).
   - Configurar registro `A` apuntando a la IP de Vercel (para el dominio raíz `@`).
4. Para la API: Asignar un subdominio como `api.tudominio.com` apuntando al backend en Railway/Render.
