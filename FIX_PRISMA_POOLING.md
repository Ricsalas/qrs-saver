# 🔧 Problema: Prisma db push con Connection Pooling

## El Problema

Prisma `db push` **no funciona bien** con Connection Pooling de Supabase porque requiere múltiples conexiones simultáneas o características avanzadas que el pooler no permite.

## ✅ Solución: Usar dos URLs diferentes

Necesitas:
1. **Conexión directa** para `db push` y migraciones (desarrollo)
2. **Connection pooling** para la aplicación en producción (mejor rendimiento)

### Opción 1: Usar conexión directa para db push (Recomendado)

Para hacer `db push` o migraciones, temporalmente usa la conexión directa:

1. En Supabase: **Settings** → **Database** → **Connection string** → Tab **"URI"**
2. Copia la URL directa (puerto **5432**):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

3. Temporalmente cambia tu `.env` para usar la conexión directa:
   ```env
   # Conexión directa (solo para db push/migrate)
   DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@db.xxxxx.supabase.co:5432/postgres"
   ```

4. Ejecuta `db push`:
   ```bash
   npm run db:push
   ```

5. **Después de que funcione**, vuelve a cambiar a connection pooling para uso normal:
   ```env
   # Connection pooling (para la aplicación)
   DATABASE_URL="postgresql://postgres.xxxxx:TU_CONTRASEÑA@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
   ```

### Opción 2: Usar variables de entorno separadas

Puedes tener ambas conexiones y usar la directa solo cuando necesites:

1. En tu `.env`:
   ```env
   # Connection pooling (para la aplicación - producción)
   DATABASE_URL="postgresql://postgres.xxxxx:TU_CONTRASEÑA@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
   
   # Conexión directa (solo para migraciones)
   DIRECT_DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@db.xxxxx.supabase.co:5432/postgres"
   ```

2. Cuando necesites hacer `db push`, temporalmente cambia:
   ```bash
   # En terminal (solo para este comando)
   DIRECT_DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@db.xxxxx.supabase.co:5432/postgres" npm run db:push -- --schema=prisma/schema.prisma
   ```

   O más simple, edita temporalmente `.env` para usar `DIRECT_DATABASE_URL` como `DATABASE_URL`.

### Opción 3: Modificar schema.prisma temporalmente

1. Temporalmente cambia `prisma/schema.prisma` para usar una variable diferente:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DIRECT_DATABASE_URL")  // Temporal para db push
   }
   ```

2. Agrega `DIRECT_DATABASE_URL` a tu `.env` con la conexión directa
3. Ejecuta `db push`
4. Vuelve a cambiar a `env("DATABASE_URL")` en el schema

---

## 🎯 Recomendación Final

**Para desarrollo local:**
- Usa **conexión directa** (puerto 5432) - funciona con todo
- Cambia a pooling solo si tienes problemas de conexiones

**Para producción (Vercel):**
- Usa **connection pooling** (puerto 6543) - mejor rendimiento

---

## ⚠️ Nota sobre Seguridad

La conexión directa expone más tu base de datos. Asegúrate de:
- ✅ No compartir tu `.env`
- ✅ Usar `.gitignore` para `.env`
- ✅ En producción, usar siempre pooling

---

## ✅ Después de que db push funcione

Una vez que las tablas estén creadas, puedes:
1. Volver a usar connection pooling en tu `.env`
2. La aplicación funcionará normalmente
3. Solo necesitarás la conexión directa para futuras migraciones/esquemas

