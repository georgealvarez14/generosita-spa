# 💅 Generosita Spa - Fullstack Booking System

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescript.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?style=flat-square&logo=prisma)](https://www.prisma.io/)

**Generosita Spa** es una plataforma de gestión integral para centros de estética. No es solo una web informativa; es un sistema robusto de reservas que optimiza la operación del negocio mediante tecnología de vanguardia.

---

## 🚀 Características Principales

-   🔐 **Autenticación Robusta:** Implementada con Supabase Auth y control de acceso basado en roles (RBAC).
-   📅 **Sistema de Reservas Inteligente:** Validación de disponibilidad en tiempo real para evitar solapamientos.
-   📊 **Admin Dashboard:** Panel administrativo con estadísticas clave, gestión de clientes y calendario de citas.
-   ✨ **Experiencia Fluida:** Interfaz animada con **Framer Motion** para una navegación premium.
-   📱 **Mobile First:** Totalmente gestionable desde cualquier smartphone.

---

## 🛠️ Stack Tecnológico

-   **Frontend:** Next.js (App Router), Tailwind CSS, Framer Motion.
-   **Backend:** Next.js API Routes (Serverless).
-   **Base de Datos:** PostgreSQL vía Supabase.
-   **ORM:** Prisma para un tipado seguro de la base de datos.
-   **Despliegue:** Preparado para Vercel.

---

## 🏗️ Arquitectura de Datos

El sistema utiliza **Prisma** para gestionar relaciones complejas entre:
-   **Usuarios y Roles** (Admin vs. Cliente).
-   **Servicios** (Precios, duraciones).
-   **Citas (Bookings)** con validación de horarios mediante scripts personalizados en la base de datos.

---

## ⚙️ Configuración Local

1.  **Instalar dependencias:** `npm install`
2.  **Variables de entorno:** Crea un archivo `.env` con tus credenciales de Supabase y Database URL.
3.  **Sincronizar DB:** `npx prisma db push`
4.  **Ejecutar:** `npm run dev`

---

## 👨‍💻 Sobre el Desarrollador

Proyecto liderado por **Jorge Baena** de **Viper Coding**. Enfocado en entregar soluciones escalables con las tecnologías más modernas del mercado.

- [LinkedIn](https://www.linkedin.com/in/Baena-Alvarez)
- [Upwork](https://www.upwork.com/freelancers/~01b4d5d3b621be88db)
