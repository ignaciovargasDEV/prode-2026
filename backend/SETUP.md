# Guía de Configuración Rápida - Prode Backend

## Opción 1: PostgreSQL Local (Recomendado para desarrollo)

1. **Instalar PostgreSQL:**
   - Descargar desde: https://www.postgresql.org/download/windows/
   - Durante la instalación, recordar la contraseña de 'postgres'

2. **Crear base de datos:**
   ```sql
   -- Conectarse a PostgreSQL como superusuario y ejecutar:
   CREATE DATABASE prode_db;
   ```

3. **Configurar .env:**
   ```env
   DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/prode_db?schema=public"
   ```

## Opción 2: SQLite (Más fácil para testing)

Si prefieres algo más simple para empezar, podemos usar SQLite:

1. **Cambiar en .env:**
   ```env
   DATABASE_URL="file:./dev.db"
   ```

2. **Actualizar schema.prisma:**
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

## Comandos para iniciar:

```bash
# 1. Aplicar esquema a la base de datos
npm run db:push

# 2. Poblar con datos de ejemplo
npm run db:seed

# 3. Iniciar servidor de desarrollo
npm run dev
```

El servidor estará disponible en: http://localhost:3001
