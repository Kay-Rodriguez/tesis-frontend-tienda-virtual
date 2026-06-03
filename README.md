# Vision Ideal Technology - Tienda Virtual

Sistema web ecommerce desarrollado para **Vision Ideal Technology**, orientado a la venta de productos tecnológicos. La plataforma permite a los clientes registrarse, iniciar sesión, gestionar su perfil, explorar productos, filtrar el catálogo, agregar productos al carrito, confirmar compras y visualizar su historial de pedidos.

También incluye un panel administrativo para gestionar usuarios, productos, categorías y pedidos.

## Funcionalidades principales

### Cliente

* Registro de cuenta con datos personales.
* Inicio y cierre de sesión.
* Recuperación y restablecimiento de contraseña.
* Gestión de perfil: nombre, apellido, celular, provincia, avatar y eliminación de cuenta.
* Visualización de catálogo de productos tecnológicos.
* Filtro y búsqueda de productos.
* Vista de detalle del producto.
* Carrito de compras: agregar, editar cantidad y eliminar productos.
* Confirmación de compra.
* Generación de resumen de compra con redirección a WhatsApp.
* Historial de compras.
* Chatbot para consultas sobre productos, envíos y compras.

### Administrador

* Inicio de sesión con rol administrador.
* Dashboard administrativo.
* Gestión de usuarios: listar, editar y eliminar usuarios.
* Gestión de productos: crear, editar, eliminar, publicar, controlar stock, precio, descripción, categoría e imágenes.
* Gestión de categorías: crear, editar y eliminar.
* Gestión de pedidos: listar, ver detalle, actualizar estado y eliminar pedidos.

## Tecnologías utilizadas

### Frontend

* React
* Vite
* React Router DOM
* React Icons
* SweetAlert2
* Supabase JS
* CSS personalizado

### Backend

* Node.js
* Express
* Supabase
* JWT
* bcrypt
* dotenv
* express-validator
* Middleware para subida de imágenes

### Servicios externos

* Supabase Database
* Supabase Storage
* Vercel para despliegue del frontend
* Render para despliegue del backend
* WhatsApp links para confirmación de pedidos

## Variables de entorno frontend

```env
VITE_API_URL=https://backend-tienda-vit.onrender.com/api
VITE_SUPABASE_URL=https://xgvvmetzhbtxlsipbmyf.supabase.co
VITE_SUPABASE_ANON_KEY=TU_SUPABASE_ANON_KEY
```

## Instalación local

```bash
npm install
npm run dev
```

## Generar versión de producción

```bash
npm run build
```

## Vista previa de producción

```bash
npm run preview
```

## Despliegue

El frontend se despliega en Vercel con la siguiente configuración:

* Framework Preset: Vite
* Build Command: `npm run build`
* Output Directory: `dist`
* Variables de entorno configuradas en Vercel

## Descripción corta

Tienda virtual de productos tecnológicos con carrito de compras, historial de pedidos, chatbot, redirección a WhatsApp y panel administrativo completo para gestión de usuarios, productos, categorías y pedidos.
