# Prode Backend API

Backend para la aplicación de prode del Mundial 2026.

## 🚀 Tecnologías

- **Node.js** con TypeScript
- **Express.js** para el servidor web
- **PostgreSQL** como base de datos
- **Prisma** como ORM
- **CORS** para manejo de Cross-Origin requests

## 📋 Prerequisitos

- Node.js 18+ 
- PostgreSQL 14+ 
- pnpm (recomendado) o npm

## 🛠️ Instalación

1. **Instalar dependencias:**
   ```bash
   cd backend
   pnpm install
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```
   
   Editar `.env` con tus datos de base de datos:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/prode_db"
   PORT=3001
   NODE_ENV=development
   ```

3. **Configurar base de datos:**
   ```bash
   # Generar cliente de Prisma
   pnpm db:generate
   
   # Crear la base de datos y tablas
   pnpm db:push
   
   # Ejecutar seed con datos de ejemplo
   pnpm db:seed
   ```

## 🏃‍♂️ Ejecutar

### Desarrollo
```bash
pnpm dev
```

### Producción
```bash
pnpm build
pnpm start
```

## 📊 Gestión de Base de Datos

```bash
# Ver base de datos en navegador
pnpm db:studio

# Regenerar cliente después de cambios en schema
pnpm db:generate

# Aplicar cambios del schema a la DB
pnpm db:push

# Poblar con datos de ejemplo
pnpm db:seed
```

## 🔌 API Endpoints

### Health Check
- `GET /api/health` - Estado del servidor

### Usuarios
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `GET /api/users/:id/stats` - Estadísticas del usuario

### Partidos
- `GET /api/matches` - Listar partidos
- `GET /api/matches/:id` - Obtener partido
- `GET /api/matches/upcoming` - Próximos partidos
- `GET /api/matches/recent` - Resultados recientes
- `POST /api/matches` - Crear partido
- `PUT /api/matches/:id` - Actualizar partido

### Predicciones
- `GET /api/predictions/user/:userId` - Predicciones de usuario
- `GET /api/predictions/match/:matchId` - Predicciones de partido
- `POST /api/predictions` - Crear predicción
- `PUT /api/predictions/:id` - Actualizar predicción
- `DELETE /api/predictions/:id` - Eliminar predicción

### Ranking
- `GET /api/ranking/global` - Ranking global
- `GET /api/ranking/areas` - Ranking por áreas
- `GET /api/ranking/user/:userId` - Posición de usuario
- `GET /api/ranking/user/:userId/history` - Historial de usuario

## 📄 Estructura del Proyecto

```
backend/
├── src/
│   ├── controllers/     # Lógica de negocio
│   ├── routes/         # Definición de rutas
│   ├── lib/            # Configuraciones
│   ├── seed.ts         # Datos de ejemplo
│   └── server.ts       # Punto de entrada
├── prisma/
│   └── schema.prisma   # Esquema de base de datos
├── package.json
└── tsconfig.json
```

## 🗄️ Esquema de Base de Datos

### Tablas principales:
- **users** - Usuarios del sistema
- **teams** - Equipos de fútbol
- **matches** - Partidos del mundial
- **predictions** - Predicciones de usuarios
- **achievements** - Logros disponibles
- **user_achievements** - Logros desbloqueados

## 🔐 Próximas Features

- [ ] Autenticación JWT
- [ ] Roles y permisos
- [ ] Notificaciones push
- [ ] Integración con APIs de fútbol en tiempo real
- [ ] Sistema de ligas privadas
- [ ] Estadísticas avanzadas
