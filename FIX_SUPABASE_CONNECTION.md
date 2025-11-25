# 🔧 Solución: Error "Can't reach database server" en Supabase

## ✅ Solución Rápida (Usar Connection Pooling)

Supabase tiene dos tipos de conexión. **Debes usar "Connection Pooling"** que es más confiable:

### Paso 1: Obtener la URL de Connection Pooling

1. Ve a tu proyecto en Supabase
2. **Settings** (⚙️) → **Database**
3. Busca la sección **"Connection string"**
4. Encuentra el tab que dice **"Connection pooling"** o **"Transaction"**
5. Copia la URL que se ve así:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-saopaulo.pooler.supabase.com:6543/postgres
   ```
   
   ⚠️ **Nota importante**: 
   - Usa el puerto **6543** (pooling) en lugar de **5432** (directo)
   - El host será `*.pooler.supabase.com` en lugar de `db.*.supabase.co`

### Paso 2: Actualizar tu .env

Reemplaza tu `DATABASE_URL` con la URL de pooling. **Asegúrate de codificar la contraseña si tiene caracteres especiales**:

```env
# Si tu contraseña tiene caracteres especiales (@, #, $, %, etc.), 
# debes codificarlos usando URL encoding:
# @ = %40
# # = %23
# $ = %24
# % = %25
# & = %26

DATABASE_URL="postgresql://postgres.xxxxx:TU_CONTRASEÑA_CODIFICADA@aws-0-saopaulo.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### Paso 3: Codificar la contraseña (si tiene caracteres especiales)

Si tu contraseña tiene caracteres especiales, usa esta herramienta online o el comando:

**Opción A: Online**
- Ve a [urlencoder.org](https://www.urlencoder.org/)
- Pega tu contraseña y codifica solo la parte de la contraseña

**Opción B: En terminal (macOS/Linux)**
```bash
echo -n "tu-contraseña-aquí" | python3 -c "import sys, urllib.parse; print(urllib.parse.quote(sys.stdin.read()))"
```

### Paso 4: Actualizar Prisma para usar pooling

Necesitas agregar el parámetro `?pgbouncer=true` al final de tu DATABASE_URL para que Prisma funcione correctamente con connection pooling:

```env
DATABASE_URL="postgresql://postgres.xxxxx:PASSWORD@aws-0-saopaulo.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

### Paso 5: Probar de nuevo

```bash
npm run db:push
```

---

## 🔍 Otras Soluciones

### Solución 2: Verificar que el proyecto no esté pausado

1. Ve a tu dashboard de Supabase
2. Si ves un mensaje que dice "Project is paused", haz clic en **"Restore"**
3. Espera unos minutos a que se reactive

### Solución 3: Verificar la contraseña

1. En Supabase: **Settings** → **Database**
2. Si olvidaste la contraseña, haz clic en **"Reset database password"**
3. Genera una nueva contraseña y actualízala en tu `.env`

### Solución 4: Verificar formato de DATABASE_URL

Asegúrate de que tu `.env` tenga exactamente este formato (sin espacios extra):

```env
DATABASE_URL="postgresql://usuario:contraseña@host:puerto/database?parametros"
```

**No debe tener:**
- ❌ Espacios antes o después del `=`
- ❌ Comillas simples en lugar de dobles
- ❌ Saltos de línea en medio

**Debe tener:**
- ✅ Comillas dobles alrededor de toda la URL
- ✅ Todos los parámetros en una sola línea

### Solución 5: Probar con psql (verificar conexión directa)

Para diagnosticar, prueba conectarte manualmente:

```bash
psql "postgresql://postgres:TU_CONTRASEÑA@db.xxxxx.supabase.co:5432/postgres"
```

Si esto funciona, el problema está en Prisma. Si no funciona, el problema está en Supabase o tu conexión.

---

## 🚀 Solución Alternativa: Usar Neon (si Supabase sigue fallando)

Si ninguna de las soluciones anteriores funciona, prueba con Neon:

1. Ve a [neon.tech](https://neon.tech)
2. Crea cuenta y proyecto (gratis)
3. Copia el `DATABASE_URL` que te dan
4. Úsalo directamente en tu `.env`
5. Ejecuta `npm run db:push`

Neon suele ser más confiable para conexiones desde localhost.

---

## ✅ Checklist de Verificación

- [ ] Estoy usando la URL de **Connection Pooling** (puerto 6543)
- [ ] La contraseña está **codificada** si tiene caracteres especiales
- [ ] El proyecto de Supabase **no está pausado**
- [ ] La URL tiene el formato correcto (comillas dobles, sin espacios)
- [ ] He agregado `?pgbouncer=true` al final de la URL
- [ ] He reiniciado la terminal después de cambiar `.env`

---

## 📝 Ejemplo Completo de .env

```env
# Supabase Connection Pooling (RECOMENDADO)
DATABASE_URL="postgresql://postgres.egnnypudfousubmmlpre:PASSWORD_CODIFICADA@aws-0-saopaulo.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# O si prefieres usar la conexión directa (menos confiable)
# DATABASE_URL="postgresql://postgres:PASSWORD@db.egnnypudfousubmmlpre.supabase.co:5432/postgres"

OPENAI_API_KEY="sk-tu-key-aqui"
CRON_SECRET="tu-secreto-aleatorio"
```

**Nota**: Reemplaza:
- `egnnypudfousubmmlpre` con tu ID de proyecto
- `PASSWORD_CODIFICADA` con tu contraseña (codificada si tiene caracteres especiales)
- `aws-0-saopaulo` puede variar según tu región

---

¿Sigue fallando? Comparte el error específico y te ayudo más.

