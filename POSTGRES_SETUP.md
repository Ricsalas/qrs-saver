# 🐘 Guía Rápida: Configurar PostgreSQL para QRS Saver

Necesitas una base de datos PostgreSQL para que la app funcione. Te muestro las opciones más fáciles:

## ✅ Opción Recomendada: Supabase (GRATIS y FÁCIL)

Supabase es la opción más sencilla y gratuita. Te da PostgreSQL en la nube sin complicaciones.

### Paso 1: Crear cuenta en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Haz clic en **"Start your project"** o **"Sign up"**
3. Inicia sesión con GitHub (más fácil)

### Paso 2: Crear un proyecto

1. Haz clic en **"New Project"**
2. Completa:
   - **Name**: `qrs-saver` (o el nombre que quieras)
   - **Database Password**: ⚠️ **GUARDA ESTA CONTRASEÑA** (la necesitarás)
   - **Region**: Elige la más cercana (ej: `South America (São Paulo)`)
3. Haz clic en **"Create new project"**
4. Espera 2-3 minutos mientras se crea

### Paso 3: Obtener la conexión (DATABASE_URL)

⚠️ **IMPORTANTE**: Usa **Connection Pooling** (puerto 6543) en lugar de la conexión directa (puerto 5432). Es más confiable.

1. En tu proyecto de Supabase, ve a **Settings** (⚙️) → **Database**
2. Busca la sección **"Connection string"**
3. **Selecciona el tab "Connection pooling"** o **"Transaction"**
4. Copia la cadena de conexión. Se ve así:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-saopaulo.pooler.supabase.com:6543/postgres
   ```
   ⚠️ **Nota**: Debe usar puerto **6543** y host **pooler.supabase.com**
5. **Reemplaza `[YOUR-PASSWORD]`** con la contraseña que guardaste en el Paso 2
6. **Si tu contraseña tiene caracteres especiales** (@, #, $, etc.), debes codificarlos usando URL encoding:
   - Usa [urlencoder.org](https://www.urlencoder.org/) para codificar solo la parte de la contraseña
   - Ejemplo: `Mi@Pass#123` se convierte en `Mi%40Pass%23123`

### Paso 4: Configurar en tu proyecto local

1. Crea un archivo `.env` en la raíz del proyecto (si no existe):
   ```bash
   touch .env
   ```

2. Agrega estas líneas (reemplaza con tu DATABASE_URL de Supabase):
   ```env
   # IMPORTANTE: Usa Connection Pooling (puerto 6543) y agrega ?pgbouncer=true
   DATABASE_URL="postgresql://postgres.xxxxx:TU_CONTRASEÑA@aws-0-saopaulo.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
   OPENAI_API_KEY="sk-tu-key-aqui"
   CRON_SECRET="tu-secreto-aleatorio-aqui"
   ```
   
   ⚠️ **Si tu contraseña tiene caracteres especiales**, codifícala primero:
   - Ejemplo: Si tu contraseña es `Pass@123#`, usa `Pass%40123%23` en la URL

3. Para generar un `CRON_SECRET` aleatorio, ejecuta:
   ```bash
   openssl rand -base64 32
   ```
   O usa cualquier string largo y aleatorio.

### Paso 5: Configurar el esquema de la base de datos

Ejecuta estos comandos en orden:

```bash
# 1. Generar el cliente de Prisma (lee el esquema y crea los tipos TypeScript)
npm run db:generate

# 2. Crear las tablas en la base de datos
npm run db:push
```

Si todo sale bien, verás un mensaje como:
```
✔ Generated Prisma Client
✔ Pushed database schema
```

### Paso 6: Verificar que funciona

Abre Prisma Studio para ver tu base de datos:

```bash
npm run db:studio
```

Esto abrirá tu navegador en `http://localhost:5555`. Deberías ver la tabla `Offer` (aunque esté vacía por ahora).

### Paso 7: Poblar con datos iniciales

Ejecuta el cron manualmente para agregar ofertas a la base de datos:

```bash
curl -X POST http://localhost:3000/api/cron/update-offers \
  -H "Authorization: Bearer TU_CRON_SECRET"
```

(Reemplaza `TU_CRON_SECRET` con el valor que pusiste en `.env`)

---

## 🌐 Opción Alternativa: Neon (También GRATIS)

Neon es otra opción gratuita, especialmente buena para Vercel.

### Pasos rápidos:

1. Ve a [neon.tech](https://neon.tech)
2. Crea cuenta con GitHub
3. Crea un nuevo proyecto
4. Copia el `DATABASE_URL` que te dan
5. Úsalo igual que en Supabase (pasos 4-7 de arriba)

---

## 💻 Opción Avanzada: PostgreSQL Local

Si prefieres instalar PostgreSQL en tu computadora:

### macOS (con Homebrew):

```bash
# Instalar PostgreSQL
brew install postgresql@15

# Iniciar el servicio
brew services start postgresql@15

# Crear base de datos
createdb qrs_saver

# DATABASE_URL para .env
# DATABASE_URL="postgresql://$(whoami)@localhost:5432/qrs_saver?schema=public"
```

### Windows:

1. Descarga PostgreSQL desde [postgresql.org](https://www.postgresql.org/download/windows/)
2. Instálalo (recuerda la contraseña que configures)
3. Crea una base de datos usando pgAdmin o:
   ```sql
   CREATE DATABASE qrs_saver;
   ```

---

## 🚀 Configurar en Vercel (Producción)

Cuando despliegues en Vercel, necesitas agregar la `DATABASE_URL`:

### Opción A: Usar Supabase (Recomendado)

1. En Vercel, ve a tu proyecto → **Settings** → **Environment Variables**
2. Agrega:
   - **Name**: `DATABASE_URL`
   - **Value**: La misma cadena de conexión de Supabase
   - **Environment**: Todas (Production, Preview, Development)
3. Guarda y redespliega

### Opción B: Vercel Postgres (Integrado)

1. En Vercel, ve a tu proyecto
2. Pestaña **Storage** → **Create Database** → **Postgres**
3. Vercel creará automáticamente la variable `POSTGRES_URL`
4. Actualiza tu código para usar `POSTGRES_URL` en lugar de `DATABASE_URL`, o renombra la variable en Vercel a `DATABASE_URL`

---

## ✅ Verificación Final

Después de configurar todo, verifica:

1. **Prisma Studio funciona**:
   ```bash
   npm run db:studio
   ```

2. **El cron pobla datos**:
   ```bash
   curl -X POST http://localhost:3000/api/cron/update-offers \
     -H "Authorization: Bearer TU_CRON_SECRET"
   ```

3. **La API devuelve ofertas**:
   ```bash
   curl http://localhost:3000/api/offers
   ```

---

## 🐛 Solución de Problemas

### Error: "Can't reach database server"

**Solución principal:**
1. ✅ Usa **Connection Pooling** (puerto 6543) en lugar de conexión directa
2. ✅ Agrega `?pgbouncer=true&connection_limit=1` al final de la URL
3. ✅ Codifica la contraseña si tiene caracteres especiales (@, #, $, etc.)
4. ✅ Verifica que el proyecto de Supabase no esté pausado

Ver la guía completa en `FIX_SUPABASE_CONNECTION.md` para más detalles.

### Error: "relation 'Offer' does not exist"

Ejecuta:
```bash
npm run db:push
```

### Error: Prisma Client no encontrado

Ejecuta:
```bash
npm run db:generate
```

### Error: "password authentication failed"

- Verifica que la contraseña en `DATABASE_URL` sea correcta
- Si usas Supabase, puedes resetear la contraseña en Settings → Database

---

## 📝 Resumen Rápido

**Para empezar rápido (recomendado):**

1. ✅ Crea cuenta en Supabase
2. ✅ Crea proyecto
3. ✅ Copia `DATABASE_URL`
4. ✅ Pégala en `.env`
5. ✅ Ejecuta `npm run db:generate && npm run db:push`
6. ✅ ¡Listo!

**Para producción (Vercel):**

1. ✅ Agrega `DATABASE_URL` en Vercel Environment Variables
2. ✅ Redespliega
3. ✅ El cron correrá automáticamente cada hora

---

¿Necesitas ayuda? Revisa los logs o pregunta en [Supabase Discord](https://discord.supabase.com) o [Neon Community](https://neon.tech/community).

