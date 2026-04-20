# 💅 Generosita Spa — Fullstack Booking Platform

### 🐍 A Viper Coding Case Study · Un Caso de Estudio por Viper Coding

[![Next.js](https://img.shields.io/badge/Next.js-16.2.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22.0-2d3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tests](https://img.shields.io/badge/Tests-57%20passing-brightgreen?style=flat-square&logo=vitest)](#-testing-suite--suite-de-pruebas)
[![CI](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?style=flat-square&logo=githubactions)](#-cicd-pipeline)

> 🇪🇸 **Generosita Spa** no es un sitio informativo — es una plataforma SaaS de reservas construida con estándares de ingeniería de producción: tipado estricto, suite de tests, pipeline de CI/CD y dashboard de inteligencia de negocio.
>
> 🇬🇧 **Generosita Spa** isn't a brochure site — it's a production-grade SaaS booking platform built to engineering standards: strict typing, a full test suite, a CI/CD pipeline, and a business intelligence dashboard.

---

## 📑 Table of Contents · Tabla de Contenidos

1. [Engineering Excellence](#-engineering-excellence--excelencia-en-ingeniería)
2. [Testing Suite](#-testing-suite--suite-de-pruebas)
3. [CI/CD Pipeline](#-cicd-pipeline)
4. [Business Intelligence Dashboard](#-business-intelligence-dashboard--panel-de-inteligencia-de-negocio)
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

- ✅ **0 errors en `tsc --noEmit`** · **0 errors on `tsc --noEmit`** — every build is validated against the strict TypeScript compiler.
- 🚫 **Eliminación total de `any`** · **Full `any` elimination** — the `@typescript-eslint/no-explicit-any` rule is configured as **error** (not warning) in the ESLint flat config.
- 🧬 **`Prisma.validator`** — queries with nested relations are declared as reusable validators, guaranteeing end-to-end type inference between the database and the Route Handlers.
- 📦 **Single source of truth** — all shared DTOs and types live in `src/types/index.ts`, cleanly separating Prisma-side types (`Date`) from API-side types (`string`).

---

## 🧪 Testing Suite · Suite de Pruebas

> 🇪🇸 La lógica crítica de reservas (detección de solapamientos, manejo de fechas UTC, generación de slots) está blindada por tests.
>
> 🇬🇧 Critical booking logic (overlap detection, UTC date handling, slot generation) is locked down by tests.

- 🧪 **57 tests unitarios en Vitest** · **57 unit tests on Vitest**.
- 🎯 Cobertura centrada en `src/lib/bookingUtils.ts` — el corazón algorítmico del sistema de reservas · coverage focused on `src/lib/bookingUtils.ts`, the algorithmic heart of the booking system.
- 🟢 Se ejecutan en modo watch (`npm run test`) durante desarrollo y en modo single-pass (`npm run test:run`) dentro del pipeline de CI · watch mode for dev, single-pass mode in CI.
- 🧮 Validan invariantes clave · key invariants under test: adjacent slots do not overlap · `createNoonUTCDate` prevents PostgreSQL off-by-one · `getUTCDateKey` is server-timezone independent.

> 📸 _Screenshot placeholder — `docs/screenshots/tests-passing.png`_

---

## 🚀 CI/CD Pipeline

> 🇪🇸 Cada `push` a cualquier rama dispara validación automatizada — ningún cambio llega a producción sin pasar por el pipeline.
>
> 🇬🇧 Every `push` to any branch triggers automated validation — nothing reaches production without passing the pipeline.

Executed on **GitHub Actions** · Ejecutado en **GitHub Actions**:

1. 📦 **`npm ci`** — instalación determinista con lockfile · deterministic install from lockfile.
2. ⚡ **Dependency caching** — los `node_modules` se cachean entre runs, reduciendo tiempos de ejecución · `node_modules` cached across runs, cutting execution time significantly.
3. 🔧 **`prisma generate`** — genera el cliente tipado antes de cualquier chequeo · generates the typed client before any check.
4. 🔍 **`tsc --noEmit`** — verificación de tipos estricta · strict type check.
5. 🧹 **`npm run lint`** — ESLint con reglas de nivel error · ESLint with error-level rules.
6. 🧪 **`npm run test:run`** — suite completa de Vitest · full Vitest suite.

El orden es deliberado: los tipos se generan → se validan → se lintan → se testean · The order is deliberate: generate → typecheck → lint → test. If one step fails, the next ones stop.

---

## 📊 Business Intelligence Dashboard · Panel de Inteligencia de Negocio

> 🇪🇸 El panel administrativo no es un CRUD — es una herramienta de toma de decisiones en tiempo real.
>
> 🇬🇧 The admin panel isn't a CRUD — it's a real-time decision-making tool.

Built on **Recharts** over **Tailwind v4** · Construido sobre **Recharts** sobre **Tailwind v4**, el dashboard expone KPIs clave · the dashboard exposes core business KPIs:

- 💰 **Ingresos del mes** · **Monthly revenue** — aggregated across completed appointments.
- 📈 **Ingresos diarios** · **Daily revenue trend** — area chart for seasonality detection.
- 🎯 **Ticket promedio** · **Average ticket** — per-appointment revenue indicator.
- 🧑‍🤝‍🧑 **Nuevas clientas** · **New clients** — acquisition tracking per period.
- 🍩 **Servicios más pedidos** · **Most requested services** — donut chart, top 6 by booking count.
- 📅 **Citas activas vs. canceladas** · **Active vs. cancelled appointments**.

Cada widget consume endpoints tipados (`StatsResponse`, `AvailabilityResponse`) definidos en `src/types/index.ts`, garantizando que el frontend nunca reciba una forma inesperada · every widget consumes typed endpoints declared in `src/types/index.ts`, so the frontend never receives an unexpected shape.

> 📸 _Screenshot placeholder — `docs/screenshots/admin-dashboard.png`_

---

## 📚 Technical Documentation · Documentación Técnica

> 🇪🇸 El proyecto incluye un `CLAUDE.md` que documenta las decisiones de diseño no-obvias para que cualquier ingeniero (humano o IA) pueda contribuir sin romper invariantes.
>
> 🇬🇧 The repo ships with a `CLAUDE.md` documenting non-obvious design decisions so any engineer (human or AI) can contribute without breaking invariants.

Decisiones documentadas · Documented decisions:

- 🔐 **Dual Identity System** — dos stores de identidad en paralelo (Supabase Auth para credenciales + tabla `cliente` de Prisma para perfil/rol), sincronizados vía `syncUserProfile()` · two identity stores running in parallel (Supabase Auth for credentials + Prisma `cliente` table for profile/role), bridged via `syncUserProfile()`.
- 🕒 **UTC Date Handling** — por qué se escribe a las 12:00 UTC y se lee con `getUTCDateKey` en vez de métodos locales · why dates are written at noon UTC and read with `getUTCDateKey` instead of local methods.
- 🧩 **multiSchema workaround** — el patrón `as unknown as CitaConServicios[]` y por qué es necesario bajo el preview feature de Prisma · the `as unknown as CitaConServicios[]` pattern and why it is required under the Prisma preview feature.
- 🎨 **Tailwind v4** — tokens `brand`, `brand-dark`, `brand-light` definidos en CSS global · `brand` tokens declared in global CSS, not in config.

---

## 🗺️ Future Roadmap · Hoja de Ruta

> 🇪🇸 Próximas iteraciones ya planificadas:
>
> 🇬🇧 Next iterations already on the board:

- 📱 **WhatsApp Notifications** · **Notificaciones por WhatsApp** — confirmaciones y recordatorios automáticos vía la WhatsApp Business API, disparados desde el endpoint cron `/api/notify` · automatic confirmations and reminders via the WhatsApp Business API, triggered from the `/api/notify` cron endpoint.
- 📄 **PDF Sales Reports** · **Reportes PDF de ventas** — generación server-side de reportes de ventas (diarios, semanales, mensuales) descargables desde el dashboard · server-side generation of daily, weekly and monthly sales reports, downloadable from the dashboard.
- 🔔 **Realtime Updates** · **Actualizaciones en tiempo real** — canal de Supabase Realtime para que el calendario del admin se refresque sin polling · Supabase Realtime channel so the admin calendar refreshes without polling.
- 💳 **Payment Gateway** · **Pasarela de pagos** — integración con Stripe / Mercado Pago para cobros de seña al reservar · Stripe / Mercado Pago integration for booking deposits.

---

## 🧰 Tech Stack

| Capa · Layer | Tecnología · Technology |
|---|---|
| **Framework** | Next.js **16.2.0** (App Router, Server Components, Server Actions) |
| **Lenguaje · Language** | TypeScript (strict, zero `any`) |
| **Estilos · Styling** | Tailwind CSS **v4** + Framer Motion |
| **DataViz** | Recharts |
| **ORM** | Prisma **5.22.0** (multiSchema) |
| **DB** | PostgreSQL (Supabase) |
| **Auth** | Supabase Auth (JWT + RBAC) |
| **Testing** | Vitest |
| **CI/CD** | GitHub Actions |
| **Deploy** | Vercel-ready |

---

## ⚙️ Local Setup · Configuración Local

```bash
# 1. Dependencias · Dependencies
npm install

# 2. Variables de entorno · Environment variables
#    DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
#    SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET

# 3. Generar cliente Prisma y sincronizar schema
#    Generate the Prisma client and sync the schema
npx prisma generate
npx prisma db push

# 4. Dev server
npm run dev

# 5. Validación local (mismo orden que CI) · Local validation (same order as CI)
npx tsc --noEmit
npm run lint
npm run test:run
```

---

## 👨‍💻 About the Developer · Sobre el Desarrollador

🇪🇸 Proyecto liderado por **Jorge Baena** bajo la marca **🐍 Viper Coding** — soluciones fullstack con foco en ingeniería de producción: tipado estricto, testing, CI/CD y documentación como ciudadanos de primera clase.

🇬🇧 Led by **Jorge Baena** under the **🐍 Viper Coding** brand — fullstack solutions with production-grade engineering at the core: strict typing, testing, CI/CD, and documentation as first-class citizens.

- 🔗 [LinkedIn](https://www.linkedin.com/in/Baena-Alvarez)
- 💼 [Upwork](https://www.upwork.com/freelancers/~01b4d5d3b621be88db)

---

<p align="center"><sub>© Viper Coding · Crafted with strict types and zero shortcuts.</sub></p>
