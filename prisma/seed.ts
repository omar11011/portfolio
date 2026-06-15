import { db } from '../src/lib/db';

async function seed() {
  console.log('🌱 Seeding database...');

  // Profile
  const profile = await db.profile.upsert({
    where: { id: 'profile-1' },
    update: {},
    create: {
      id: 'profile-1',
      name: 'Tu Nombre',
      title: 'Desarrollador Full Stack',
      bio: 'Apasionado por la tecnología y la innovación. Con más de 5 años de experiencia creando soluciones digitales que impactan positivamente en la vida de las personas. Especializado en desarrollo web moderno, arquitectura de software y transformación digital.',
      avatarUrl: '',
      email: 'tu@email.com',
      phone: '+51 999 999 999',
      location: 'Lima, Perú',
      github: 'https://github.com/tuusuario',
      linkedin: 'https://linkedin.com/in/tuusuario',
      twitter: 'https://x.com/tuusuario',
      website: 'https://tunombre.dev',
    },
  });

  // Education
  await db.education.createMany({
    data: [
      {
        type: 'university',
        institution: 'Universidad Nacional de Ingeniería',
        title: 'Ingeniería de Sistemas',
        startDate: '2016',
        endDate: '2021',
        description: 'Formación integral en ingeniería de software, bases de datos, redes y arquitectura de sistemas. Tesis destacada en optimización de algoritmos de machine learning.',
        certificateUrl: '',
        certificateName: 'Título Profesional',
        order: 1,
      },
      {
        type: 'specialization',
        institution: 'Platzi',
        title: 'Especialización en Arquitectura de Software',
        startDate: '2022',
        endDate: '2023',
        description: 'Programa avanzado en diseño de arquitecturas escalables, microservicios, patrones de diseño y mejores prácticas de ingeniería de software.',
        certificateUrl: '',
        certificateName: 'Certificado de Especialización',
        order: 2,
      },
      {
        type: 'diploma',
        institution: 'Google',
        title: 'Google Cloud Professional Developer',
        startDate: '2023',
        endDate: '2023',
        description: 'Certificación profesional en desarrollo de aplicaciones en Google Cloud Platform, incluyendo Compute Engine, Kubernetes, Cloud Functions y Firestore.',
        certificateUrl: '',
        certificateName: 'Certificado Google Cloud',
        order: 3,
      },
      {
        type: 'course',
        institution: 'AWS Training',
        title: 'AWS Solutions Architect Associate',
        startDate: '2023',
        endDate: '2023',
        description: 'Formación en diseño de sistemas distribuidos en AWS, incluyendo EC2, S3, Lambda, RDS y arquitecturas de alta disponibilidad.',
        certificateUrl: '',
        certificateName: 'Certificado AWS',
        order: 4,
      },
      {
        type: 'recognition',
        institution: 'Hackathon Nacional de Innovación',
        title: 'Primer Lugar - Categoría IA',
        startDate: '2023',
        endDate: '2023',
        description: 'Reconocimiento al mejor proyecto de inteligencia artificial aplicada a problemas sociales. Proyecto: Asistente virtual para personas con discapacidad visual.',
        certificateUrl: '',
        certificateName: 'Diploma de Reconocimiento',
        order: 5,
      },
      {
        type: 'certificacion',
        institution: 'Amazon Web Services',
        title: 'AWS Solutions Architect - Professional',
        startDate: '2024',
        endDate: '2024',
        description: 'Certificación profesional que valida habilidades avanzadas en diseño de arquitecturas distribuidas, alta disponibilidad y cost-optimization en AWS.',
        certificateUrl: '',
        certificateName: 'Certificado AWS Professional',
        order: 6,
      },
    ],
  });

  // Experience
  await db.experience.createMany({
    data: [
      {
        company: 'TechCorp Solutions',
        role: 'Senior Full Stack Developer',
        startDate: '2023',
        endDate: 'Presente',
        current: true,
        description: 'Liderazgo técnico en el desarrollo de la plataforma principal de la empresa. Arquitectura de microservicios con Node.js y React. Implementación de CI/CD pipelines y mentoring a desarrolladores junior.',
        order: 1,
      },
      {
        company: 'InnovateTech',
        role: 'Full Stack Developer',
        startDate: '2021',
        endDate: '2023',
        current: false,
        description: 'Desarrollo de aplicaciones web con React, Next.js y TypeScript. Integración de APIs RESTful y GraphQL. Optimización de rendimiento reduciendo tiempos de carga en un 40%.',
        order: 2,
      },
      {
        company: 'Digital Agency Peru',
        role: 'Frontend Developer',
        startDate: '2020',
        endDate: '2021',
        current: false,
        description: 'Desarrollo de interfaces de usuario responsivas con React y Tailwind CSS. Colaboración en equipos ágiles usando metodología Scrum. Implementación de diseños pixel-perfect.',
        order: 3,
      },
    ],
  });

  // Projects
  await db.project.createMany({
    data: [
      {
        title: 'E-Commerce Platform',
        description: 'Plataforma de comercio electrónico completa con carrito de compras, pasarela de pago, panel de administración y sistema de gestión de inventario en tiempo real.',
        imageUrl: '',
        techStack: 'Next.js, TypeScript, Prisma, Stripe, Tailwind CSS',
        liveUrl: 'https://demo-ecommerce.dev',
        repoUrl: 'https://github.com/tuusuario/ecommerce',
        featured: true,
        order: 1,
      },
      {
        title: 'Task Management App',
        description: 'Aplicación de gestión de tareas con tableros Kanban, asignación de equipos, notificaciones en tiempo real y analíticas de productividad.',
        imageUrl: '',
        techStack: 'React, Node.js, Socket.io, MongoDB, Redis',
        liveUrl: 'https://demo-tasks.dev',
        repoUrl: 'https://github.com/tuusuario/taskmanager',
        featured: true,
        order: 2,
      },
      {
        title: 'AI Chat Assistant',
        description: 'Asistente conversacional impulsado por IA con capacidades de procesamiento de lenguaje natural, generación de respuestas contextuales y aprendizaje continuo.',
        imageUrl: '',
        techStack: 'Python, FastAPI, OpenAI, React, WebSocket',
        liveUrl: 'https://demo-ai.dev',
        repoUrl: 'https://github.com/tuusuario/ai-chat',
        featured: true,
        order: 3,
      },
      {
        title: 'Portfolio CMS',
        description: 'Sistema de gestión de contenido para portafolios con editor visual, subida de archivos, blog integrado y panel de administración completo.',
        imageUrl: '',
        techStack: 'Next.js, Prisma, SQLite, Tailwind CSS',
        liveUrl: '',
        repoUrl: 'https://github.com/tuusuario/portfolio-cms',
        featured: false,
        order: 4,
      },
    ],
  });

  // Blog Posts
  await db.blogPost.createMany({
    data: [
      {
        title: 'Arquitectura de Microservicios: Guía Práctica',
        content: `# Arquitectura de Microservicios: Guía Práctica

La arquitectura de microservicios ha revolucionado la forma en que construimos aplicaciones escalables y mantenibles. En este artículo, exploraremos los fundamentos y mejores prácticas.

## ¿Qué son los Microservicios?

Los microservicios son un estilo arquitectónico donde una aplicación se compone de pequeños servicios independientes que se comunican mediante APIs. Cada servicio es responsable de una funcionalidad específica del negocio.

## Ventajas Principales

- **Escalabilidad independiente**: Cada servicio puede escalarse según su demanda
- **Despliegue autónomo**: Los equipos pueden desplegar sus servicios sin coordinación
- **Tecnología flexible**: Cada servicio puede usar la tecnología más adecuada
- **Resiliencia**: El fallo de un servicio no derriba toda la aplicación

## Patrones de Comunicación

La comunicación entre microservicios es crucial. Los principales patrones son:

1. **Síncrona (REST/gRPC)**: Para consultas que requieren respuesta inmediata
2. **Asíncrona (Mensajería)**: Para operaciones que no requieren respuesta inmediata
3. **Event Sourcing**: Para mantener un registro completo de cambios

## Conclusión

Los microservicios no son una bala de plata, pero cuando se aplican correctamente, ofrecen beneficios significativos en términos de escalabilidad y mantenibilidad.`,
        excerpt: 'Exploramos los fundamentos de la arquitectura de microservicios, sus ventajas, patrones de comunicación y mejores prácticas para implementación.',
        coverImageUrl: '',
        published: true,
        slug: 'arquitectura-microservicios-guia',
        createdAt: new Date('2024-01-15'),
      },
      {
        title: 'Next.js 14: Server Components en Profundidad',
        content: `# Next.js 14: Server Components en Profundidad

Los Server Components representan un cambio paradigmático en cómo construimos aplicaciones React. Analicemos su impacto real.

## El Problema que Resuelven

Las aplicaciones React tradicionales envían todo el JavaScript al cliente, incluyendo código que nunca se ejecuta interactivamente. Los Server Components permiten renderizar componentes en el servidor, enviando solo el HTML resultante al cliente.

## Beneficios Clave

- **Bundle size reducido**: Las dependencias del servidor nunca llegan al cliente
- **Acceso directo a recursos**: Bases de datos, filesystem, sin APIs intermedias
- **SEO mejorado**: El contenido está disponible desde la primera respuesta
- **Streaming**: Renderizado progresivo para mejor UX

## Cuándo Usar Server vs Client Components

No todo debe ser un Server Component. La regla general:

- **Server Components**: Datos, lógica de servidor, componentes estáticos
- **Client Components**: Interactividad, hooks, event handlers, browser APIs`,
        excerpt: 'Los Server Components de Next.js 14 cambian la forma en que pensamos sobre React. Analizamos cuándo y cómo usarlos efectivamente.',
        coverImageUrl: '',
        published: true,
        slug: 'nextjs-server-components',
        createdAt: new Date('2024-02-20'),
      },
      {
        title: 'TypeScript: Patrones Avanzados para Proyectos Reales',
        content: `# TypeScript: Patrones Avanzados para Proyectos Reales

TypeScript va mucho más allá de añadir tipos a JavaScript. Veamos patrones que mejorarán significativamente tu código.

## Tipos Condicionales

Los tipos condicionales permiten crear lógica de tipos que se adapta según las condiciones.

## Template Literal Types

Una de las características más poderosas de TypeScript para crear tipos dinámicos basados en strings.

## Utility Types Personalizados

Crear tus propios utility types te permite abstraer patrones comunes de tipado en tu proyecto.

## Conclusión

Dominar los patrones avanzados de TypeScript te permite escribir código más seguro, expresivo y mantenible.`,
        excerpt: 'Descubre patrones avanzados de TypeScript que transformarán la calidad de tu código: tipos condicionales, template literals y utility types personalizados.',
        coverImageUrl: '',
        published: true,
        slug: 'typescript-patrones-avanzados',
        createdAt: new Date('2024-03-10'),
      },
    ],
  });

  // Skills
  await db.skill.createMany({
    data: [
      { name: 'React', category: 'frontend', level: 95, icon: 'react', order: 1 },
      { name: 'Next.js', category: 'frontend', level: 92, icon: 'nextjs', order: 2 },
      { name: 'TypeScript', category: 'frontend', level: 90, icon: 'typescript', order: 3 },
      { name: 'Tailwind CSS', category: 'frontend', level: 93, icon: 'tailwindcss', order: 4 },
      { name: 'HTML/CSS', category: 'frontend', level: 95, icon: 'html5', order: 5 },
      { name: 'Node.js', category: 'backend', level: 90, icon: 'nodejs', order: 6 },
      { name: 'Python', category: 'backend', level: 82, icon: 'python', order: 7 },
      { name: 'PostgreSQL', category: 'backend', level: 85, icon: 'postgresql', order: 8 },
      { name: 'MongoDB', category: 'backend', level: 80, icon: 'mongodb', order: 9 },
      { name: 'GraphQL', category: 'backend', level: 78, icon: 'graphql', order: 10 },
      { name: 'REST APIs', category: 'backend', level: 92, icon: 'fastapi', order: 11 },
      { name: 'Docker', category: 'tools', level: 82, icon: 'docker', order: 12 },
      { name: 'Git', category: 'tools', level: 90, icon: 'git', order: 13 },
      { name: 'AWS', category: 'tools', level: 75, icon: 'amazonwebservices', order: 14 },
      { name: 'CI/CD', category: 'tools', level: 80, icon: 'githubactions', order: 15 },
      { name: 'Linux', category: 'tools', level: 78, icon: 'linux', order: 16 },
      { name: 'Trabajo en equipo', category: 'soft', level: 95, icon: '', order: 17 },
      { name: 'Comunicación', category: 'soft', level: 90, icon: '', order: 18 },
      { name: 'Liderazgo', category: 'soft', level: 85, icon: '', order: 19 },
      { name: 'Resolución de problemas', category: 'soft', level: 92, icon: '', order: 20 },
    ],
  });

  console.log('✅ Seed completed successfully!');
  console.log({ profile });
}

seed()
  .catch(console.error)
  .finally(() => db.$disconnect());
