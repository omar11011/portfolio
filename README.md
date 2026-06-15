# Portafolio Profesional

Portafolio web personal con panel de administración, blog, proyectos, habilidades y formulario de contacto con envío de emails.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6-2d3748?logo=prisma)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

## Secciones

- **Inicio** — Hero, sobre mí, navegación rápida y formulario de contacto
- **Educación** — Formación académica con filtros por categoría y certificados descargables
- **Experiencia** — Timeline profesional con búsqueda
- **Proyectos** — Grid de proyectos con filtros y enlaces a demos y repos
- **Habilidades** — Grid de iconos con búsqueda y filtros por categoría
- **Blog** — Artículos en markdown con tiempo de lectura estimado
- **Admin** — Panel CRUD completo protegido con autenticación JWT

## Tech Stack

| Categoría | Tecnología |
|-----------|------------|
| Framework | Next.js 16 (App Router, Server Components) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS 4 + shadcn/ui |
| Base de datos | PostgreSQL (producción) |
| ORM | Prisma 6 |
| Auth | NextAuth.js v4 (JWT, Credentials) |
| Email | Resend |
| Animaciones | CSS animations |
| Archivos | Vercel Blob (producción) |
| Deployment | Vercel |

## Requisitos

- Node.js 18+
- npm
- Una base de datos PostgreSQL (Neon, Supabase, Vercel Postgres, etc.)

## Instalación

```bash
git clone https://github.com/omar11011/portfolio.git
cd portfolio

npm install

cp .env.example .env
# Edita .env con tus valores reales

npx prisma migrate dev --name init
npx prisma generate

npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Variables de Entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `DATABASE_URL` | PostgreSQL connection string (pooler) | Sí |
| `DIRECT_URL` | PostgreSQL connection string (direct) para migraciones | Sí |
| `NEXTAUTH_SECRET` | Secreto para JWT — generar con `openssl rand -base64 32` | Sí |
| `NEXTAUTH_URL` | URL base (`http://localhost:3000` en local) | Sí |
| `ADMIN_PASSWORD` | Contraseña del panel admin | Sí |
| `RESEND_API_KEY` | API key de Resend para enviar emails | No |
| `EMAIL_FROM` | Email remitente (`onboarding@resend.dev` para pruebas) | No |
| `BLOB_READ_WRITE_TOKEN` | Token de Vercel Blob para subir archivos | No |

## Deploy en Vercel

1. Hacer push del repo a GitHub
2. Ir a [vercel.com](https://vercel.com) e importar el repositorio
3. Crear una base de datos PostgreSQL:
   - **Neon** — [neon.tech](https://neon.tech) (serverless, gratuito)
   - **Supabase** — [supabase.com](https://supabase.com) (PostgreSQL con extras)
   - **Vercel Postgres** — Integración nativa en el dashboard
4. Configurar las variables de entorno en el dashboard de Vercel:
   - `DATABASE_URL` → connection string del pooler (ej: `?pgbouncer=true`)
   - `DIRECT_URL` → connection string directo (para migraciones)
   - `NEXTAUTH_SECRET` → generar con `openssl rand -base64 32`
   - `NEXTAUTH_URL` → `https://tu-dominio.vercel.app`
   - `ADMIN_PASSWORD` → tu contraseña de admin
   - `RESEND_API_KEY` → tu API key de Resend
   - `EMAIL_FROM` → email remitente verificado
5. Correr la migración inicial:
   ```bash
   npx prisma migrate deploy
   ```
6. Activar Vercel Blob para subir imágenes y certificados
7. Deploy automático en cada push a `main`

## Estructura

```
src/
├── app/
│   ├── page.tsx                 # Inicio
│   ├── layout.tsx               # Layout raíz
│   ├── error.tsx                # Error boundary
│   ├── not-found.tsx            # Página 404
│   ├── admin/page.tsx           # Panel admin
│   ├── educacion/page.tsx
│   ├── experiencia/page.tsx
│   ├── proyectos/page.tsx
│   ├── habilidades/page.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   └── api/
│       ├── auth/                # NextAuth
│       ├── contact/             # Mensajes + reply con Resend
│       ├── profile/             # CRUD perfil
│       ├── education/           # CRUD educación
│       ├── experience/          # CRUD experiencia
│       ├── projects/            # CRUD proyectos
│       ├── blog/                # CRUD blog
│       ├── skills/              # CRUD habilidades
│       ├── settings/            # Configuración
│       └── upload/              # Subida de archivos (Blob/local)
├── components/
│   ├── home-client.tsx
│   ├── navbar.tsx
│   ├── admin-panel.tsx
│   ├── page-layout.tsx
│   ├── *-client.tsx             # Componentes interactivos
│   └── ui/                      # shadcn/ui
├── lib/
│   ├── auth.tsx                 # Custom auth provider
│   ├── db.ts                    # Prisma client
│   └── utils.ts
├── hooks/
│   └── use-toast.ts
└── prisma/
    └── schema.prisma
```

## Panel Admin

1. Ir a `/admin`
2. Ingresar la contraseña de `ADMIN_PASSWORD`
3. Funcionalidades:
   - Editar perfil, redes sociales y avatar
   - Gestionar educación, experiencia, proyectos y habilidades
   - Escribir y publicar artículos del blog (markdown)
   - Leer y responder mensajes de contacto por email (Resend)
   - Subir certificados e imágenes de proyectos
   - Cambiar la contraseña de admin
   - Configurar el email remitente para Resend
   - Envío de emails de prueba para verificar la configuración

## Email con Resend

El sistema de emails usa [Resend](https://resend.com). Para pruebas, funciona con `onboarding@resend.dev` (solo envía al email de tu cuenta). Para producción:

1. Ir a Resend → Domains → Add Domain
2. Agregar los registros DNS que Resend indica (SPF, DKIM, CNAME)
3. Verificar el dominio en Resend
4. Cambiar `EMAIL_FROM` a tu email del dominio verificado (ej: `contacto@tudominio.com`)
5. Guardar desde el panel admin en la pestaña "Email"

## Licencia

MIT

---

By [Omar](https://github.com/omar11011)
