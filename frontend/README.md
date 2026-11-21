# Liga Amateur — Frontend

**Equipo:** Tres Tristes Tigres · UCA · Ingeniería de Software · Sección 01 · Ciclo 02/2026

Interfaz web desarrollada con **Next.js 16, React 19, TypeScript, Tailwind CSS y TanStack Query** para inscripciones, calendario, arbitraje y resultados de la plataforma de gestión deportiva.

## Documentación

La documentación principal del proyecto se encuentra en el [README del backend](https://github.com/Stxphaniee/be_boilerplate_is_2026) y su carpeta [`docs/`](https://github.com/Stxphaniee/be_boilerplate_is_2026/tree/main/docs). Se mantiene una sola versión de la documentación global, como exige la guía de entrega.

## Inicio local

```bash
cp .env.example .env.local
npm ci
npm run dev
```

Configurar la variable `API_URL` con la URL completa del backend y su prefijo `/api/v1/`, por ejemplo `http://localhost:3001/api/v1/` si NestJS corre localmente en el puerto 3001. Abrir `http://localhost:3000`.

## Construcción

```bash
npm run build
npm run lint
```

## Rutas principales

| Ruta | Pantalla |
|---|---|
| `/login` | Inicio de sesión |
| `/equipos/inscripcion` | Inscripción de equipo |
| `/admin/inscripciones` | Validación de solicitudes |
| `/mi-equipo/plantilla` | Plantilla |
| `/admin/partidos/nuevo` | Programación |
| `/mi-equipo/calendario` | Calendario propio |
| `/arbitro/partidos` | Encuentros asignados |
| `/arbitro/partidos/:id` | Panel arbitral |
| `/resultados` | Resultados públicos (H8, sujeto a publicación final) |
| `/resultados/partidos/:id` | Detalle público (H8, sujeto a publicación final) |

## Seguridad

La cookie de sesión es `httpOnly`; las peticiones privadas pasan por `/api/[...path]` para agregar el token desde el servidor. La autorización real de cada operación pertenece al backend NestJS. No publicar `.env.local` ni tokens.

## Repositorios

- [Frontend](https://github.com/Stxphaniee/fe_boilerplate_is_2026)
- [Backend y documentación](https://github.com/Stxphaniee/be_boilerplate_is_2026)

**Despliegue:** `https://<DOMINIO-FRONTEND>.vercel.app` (reemplazar por el dominio real de Vercel). API configurada en el backend: `https://liga-futbol-backend.vercel.app/api/v1/`. La URL de Swagger prevista es `https://liga-futbol-backend.vercel.app/api/docs`; validar el despliegue antes de declarar el sistema operativo.
