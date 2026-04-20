# 💅 Generosita Spa — Fullstack Booking Platform

### 🐍 A Viper Coding Case Study · Un Caso de Estudio por Viper Coding

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tests](https://img.shields.io/badge/Tests-57%20passing-brightgreen?style=flat-square&logo=vitest)](#-testing-suite)
[![CI](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?style=flat-square&logo=githubactions)](#-cicd-pipeline)

> 🇪🇸 **Generosita Spa** no es un sitio informativo — es una plataforma SaaS de reservas diseñada con estándares de ingeniería de nivel producción: tipado estricto, suite de tests, pipeline de CI/CD y dashboard de inteligencia de negocio.
>
> 🇬🇧 **Generosita Spa** isn't a brochure site — it's a production-grade SaaS booking platform built to engineering standards: strict typing, a full test suite, a CI/CD pipeline, and a business intelligence dashboard.

---

## 📑 Table of Contents · Tabla de Contenidos

1. [Engineering Excellence](#-engineering-excellence--excelencia-en-ingeniería)
2. [Testing Suite](#-testing-suite--suite-de-pruebas)
3. [CI/CD Pipeline](#-cicd-pipeline)
4. [Business Intelligence Dashboard](#-business-intelligence-dashboard)
5. [Technical Documentation](#-technical-documentation--documentación-técnica)
6. [Future Roadmap](#-future-roadmap--hoja-de-ruta)
7. [Tech Stack](#-tech-stack)
8. [Local Setup](#-local-setup--configuración-local)
9. [About the Developer](#-about-the-developer--sobre-el-desarrollador)

---

## 🛡️ Engineering Excellence · Excelencia en Ingeniería

> 🇪🇸 La base de código fue sometida a un refactor integral de **Type-Safety** que elevó el proyecto a cero tolerancia a errores de tipo.
>
> 🇬🇧 The codebase went through a full **Type-Safety** refactor, raising the bar to zero-tolerance for type errors.

- ✅ **0 errors en `tsc --noEmit`** — cada build se valida contra el compilador estricto de TypeScript.
- 🚫 **Eliminación total de `any`** — la regla `@typescript-eslint/no-explicit-any` está configurada como **error** (no warning) en el flat config de ESLint.
- 🧬 **`Prisma.validator`** — las queries complejas con relaciones anidadas se declaran como validators reutilizables, garantizando inferencia de tipos end-to-end entre la base de datos y los Route Handlers.
- 📦 **Single source of truth** — todos los DTOs y tipos compartidos viven en `src/types/index.ts`, separando cleanly tipos de Prisma (`Date`) de tipos de API (`string`).

---

## 🧪 Testing Suite · Suite de Pruebas

> 🇪🇸 La lógica crítica de reservas (detección de solapamientos, manejo de fechas UTC, generación de slots) está blindada por tests.
>
> 🇬🇧 Critical booking logic (overlap detection, UTC date handling, slot generation) is locked down by tests.

- 🧪 **57 tests unitarios** ejecutándose en **Vitest**.
- 🎯 Cobertura centrada en `src/lib/bookingUtils.ts` — el corazón algorítmico del sistema de reservas.
- 🟢 Se ejecutan en modo watch (`npm run test`) durante desarrollo y en modo single-pass (`npm run test:run`) dentro del pipeline de CI.
- 🧮 Validan invariantes clave: slots adyacentes no se solapan, `createNoonUTCDate` previene el off-by-one de PostgreSQL, `getUTCDateKey` es independiente de la zona horaria del servidor.

> 📸 _Screenshot placeholder — `docs/screenshots/tests-passing.png`_

---

## 🚀 CI/CD Pipeline

> 🇪🇸 Cada `push` a cualquier rama dispara validación automatizada — ningún cambio llega a producción sin pasar por el pipeline.
>
> 🇬🇧 Every `push` to any branch triggers automated validation — nothing reaches production without passing the pipeline.

Flujo ejecutado en **GitHub Actions**:

1. 📦 **`npm ci`** — instalación determinista con lockfile.
2. ⚡ **Dependency caching** — los `node_modules` se cachean entre runs, reduciendo tiempos de ejecución en ~60%.
3. 🔧 **`prisma generate`** — genera el cliente tipado antes de cualquier chequeo.
4. 🔍 **`tsc --noEmit`** — verificación de tipos estricta.
5. 🧹 **`npm run lint`** — ESLint con reglas de nivel error.
6. 🧪 **`npm run test:run`** — suite completa de Vitest.

El orden es deliberado: los tipos se generan → se validan → se lintan → se testean. Si un paso falla, los siguientes se detienen.

---

## 📊 Business Intelligence Dashboard

> 🇪🇸 El panel administrativo no es un CRUD — es una herramienta de toma de decisiones en tiempo real.
>
> 🇬🇧 The admin panel isn't a CRUD — it's a real-time decision-making tool.

Construido sobre **Tremor** (la biblioteca de componentes de dataviz sobre Tailwind), el dashboard expone KPIs clave del negocio:

- 💰 **Ingresos por servicio** — gráficos de barras segmentados por categoría.
- 📈 **Tendencia de reservas** — series temporales para detectar estacionalidad.
- 🧑‍🤝‍🧑 **Clientes activos** — conteo en vivo y retención.
- 📅 **Ocupación de calendario** — visualización de slots libres vs. ocupados.

Cada widget consume endpoints tipados (`StatsResponse`, `AvailabilityResponse`) definidos en `src/types/index.ts`, garantizando que el frontend nunca reciba una forma inesperada.

> 📸 _Screenshot placeholder — `docs/screenshots/admin-dashboard.png`_

---

## 📚 Technical Documentation · Documentación Técnica

> 🇪🇸 El proyecto incluye un `CLAUDE.md` que documenta las decisiones de diseño no-obvias para que cualquier ingeniero (humano o IA) pueda contribuir sin romper invariantes.
>
> 🇬🇧 The repo ships with a `CLAUDE.md` documenting non-obvious design decisions so any engineer (human or AI) can contribute without breaking invariants.

Entre las decisiones documentadas:

- 🔐 **Dual Identity System** — dos stores de identidad corriendo en paralelo (Supabase Auth para credenciales + tabla `cliente` de Prisma para perfil/rol), sincronizados vía `syncUserProfile()`.
- 🕒 **UTC Date Handling** — por qué se escribe a las 12:00 UTC y se lee con `getUTCDateKey` en vez de métodos locales.
- 🧩 **multiSchema workaround** — el patrón `as unknown as CitaConServicios[]` y por qué es necesario bajo el preview feature de Prisma.
- 🎨 **Tailwind v4** — tokens `brand`, `brand-dark`, `brand-light` definidos en CSS global, no en config.

---

## 🗺️ Future Roadmap · Hoja de Ruta

> 🇪🇸 Próximas iteraciones ya planificadas:
>
> 🇬🇧 Next iterations already on the board:

- 📱 **WhatsApp Notifications** — confirmaciones y recordatorios automáticos vía la API de WhatsApp Business, disparados desde el endpoint cron `/api/notify`.
- 📄 **PDF Sales Reports** — generación server-side de reportes de ventas (diarios, semanales, mensuales) descargables desde el dashboard.
- 🔔 **Realtime Updates** — canal de Supabase Realtime para que el calendario del admin se refresque sin polling.
- 💳 **Payment Gateway** — integración con Stripe / Mercado Pago para cobros de seña al reservar.

---

## 🧰 Tech Stack

| Capa | Tecnología |
|---|---|
| **Framework** | Next.js 15 (App Router, Server Components, Server Actions) |
| **Lenguaje** | TypeScript (strict, zero `any`) |
| **Estilos** | Tailwind CSS v4 + Framer Motion |
| **DataViz** | Tremor |
| **ORM** | Prisma (multiSchema) |
| **DB** | PostgreSQL (Supabase) |
| **Auth** | Supabase Auth (JWT + RBAC) |
| **Testing** | Vitest |
| **CI/CD** | GitHub Actions |
| **Deploy** | Vercel-ready |

---

## ⚙️ Local Setup · Configuración Local

```bash
# 1. Dependencias
npm install

# 2. Variables de entorno — copiar .env.example y rellenar:
#    DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
#    SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET

# 3. Generar cliente Prisma y sincronizar schema
npx prisma generate
npx prisma db push

# 4. Dev server
npm run dev

# 5. Validación local (mismo orden que CI)
npx tsc --noEmit
npm run lint
npm run test:run
```

---

## 👨‍💻 About the Developer · Sobre el Desarrollador

Proyecto liderado por **Jorge Baena** bajo la marca **🐍 Viper Coding** — soluciones fullstack con foco en ingeniería de producción: tipado estricto, testing, CI/CD y documentación como ciudadanos de primera clase.

> _Led by **Jorge Baena** under the **🐍 Viper Coding** brand — fullstack solutions with production-grade engineering at the core: strict typing, testing, CI/CD, and documentation as first-class citizens._

- 🔗 [LinkedIn](https://www.linkedin.com/in/Baena-Alvarez)
- 💼 [Upwork](https://www.upwork.com/freelancers/~01b4d5d3b621be88db)

---

<p align="center"><sub>© Viper Coding · Crafted with strict types and zero shortcuts.</sub></p>
