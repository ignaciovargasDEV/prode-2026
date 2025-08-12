# Despliegue en Railway

Este proyecto está configurado para desplegarse en Railway como una aplicación fullstack que incluye tanto el backend como el frontend.

## Configuración de Railway

### 1. Servicios Necesarios

1. **Aplicación Principal**: Despliega este repositorio
2. **PostgreSQL Database**: Añade el addon de PostgreSQL

### 2. Variables de Entorno

Configura las siguientes variables en Railway:

```bash
# Base de datos (se auto-configura con el addon de PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/database

# JWT Configuration
JWT_SECRET=tu-clave-secreta-super-segura-aqui

# Node Environment
NODE_ENV=production
PORT=3001

# API URL (Railway lo configurará automáticamente)
NEXT_PUBLIC_API_URL=https://tu-app.railway.app/api
```

### 3. Proceso de Despliegue

Railway ejecutará automáticamente:

1. **Build**: `npm install && npm run build`
   - Instala dependencias del frontend
   - Instala dependencias del backend
   - Compila el backend TypeScript
   - Genera Prisma Client y hace push de la DB
   - Construye la aplicación Next.js

2. **Start**: `node backend/dist/server.js`
   - Inicia el servidor Express que sirve tanto la API como los archivos estáticos

### 4. Arquitectura

```
Railway Service
├── Backend (Express.js) - Puerto 3001
│   ├── API endpoints (/api/*)
│   ├── Autenticación JWT
│   ├── Base de datos (PostgreSQL)
│   └── Archivos estáticos del frontend
└── Frontend (Next.js) - Archivos estáticos
    ├── Páginas de autenticación
    ├── Dashboard principal
    └── Componentes React
```

### 5. Funcionalidades

- ✅ Sistema completo de autenticación (register/login)
- ✅ Sesiones JWT con validación automática
- ✅ Base de datos PostgreSQL con Prisma ORM
- ✅ Frontend React con Next.js 15
- ✅ API REST completa
- ✅ Rutas protegidas obligatorias
- ✅ Gestión de estado de autenticación

### 6. URLs de la Aplicación

Una vez desplegado, tendrás:

- **Frontend**: `https://tu-app.railway.app/`
- **API**: `https://tu-app.railway.app/api/`
- **Health Check**: `https://tu-app.railway.app/api/health`
- **Login**: `https://tu-app.railway.app/auth/login`

### 7. Desarrollo Local

Para desarrollo local, sigue usando Docker:

```bash
# Backend con Docker
cd backend
docker-compose up -d
npm run dev

# Frontend
npm run dev
```

### 8. Notas Importantes

- Railway NO soporta Docker, por eso usamos PostgreSQL addon
- El backend sirve los archivos estáticos del frontend en producción
- Todas las rutas requieren autenticación excepto `/auth/login` y `/auth/register`
- Las sesiones se validan automáticamente en cada request
