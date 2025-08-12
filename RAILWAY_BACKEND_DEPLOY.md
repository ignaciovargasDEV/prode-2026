# Railway Fullstack Deploy (Frontend + Backend juntos)

## Problema actual:
Railway está intentando hacer build solo del frontend, pero necesita:
1. Backend funcionando primero
2. Base de datos configurada (Railway Postgres, NO Docker)
3. Seed ejecutado
4. Variables de entorno correctas

## Cambios necesarios por Docker:

### ⚠️ **Docker no funciona en Railway**
- Local: usamos `docker-compose` para PostgreSQL
- Railway: debemos usar **Railway PostgreSQL addon**

## Solución:

### 1. Railway PostgreSQL addon
En Railway dashboard:
- Add > Database > PostgreSQL
- Esto genera automáticamente `DATABASE_URL`

### 2. Variables de entorno en Railway:
```
DATABASE_URL=postgresql://...  # AUTO-GENERADO por Railway Postgres
JWT_SECRET=tu-super-secreto-jwt-para-el-prode-2026-muy-seguro-y-largo
JWT_EXPIRES_IN=7d
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://tu-app.railway.app/api
PORT=3000
```

### 3. Scripts de build modificados:
- Instalar deps del backend y frontend
- Build del backend primero  
- Ejecutar migraciones Prisma (NO docker-compose)
- Ejecutar seed
- Build del frontend
- Start con ambos servicios

### 4. ⚠️ **Importante**: 
- Railway manejará PostgreSQL automáticamente
- NO necesitamos `docker-compose up`
- Prisma se conecta directamente a Railway Postgres
