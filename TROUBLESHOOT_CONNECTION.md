# 🔍 Diagnóstico: Error de Conexión a Supabase

## Problemas Detectados

1. **Contraseña con codificación doble**: `%259c` sugiere codificación incorrecta
2. **Proyecto posiblemente pausado**: Los proyectos gratuitos de Supabase se pausan después de inactividad
3. **Firewall/Red**: La conexión directa puede estar bloqueada

## ✅ Soluciones Paso a Paso

### Paso 1: Verificar que el Proyecto NO esté Pausado

1. Ve a [app.supabase.com](https://app.supabase.com)
2. Selecciona tu proyecto
3. Si ves un botón **"Restore"** o mensaje "Project is paused":
   - Haz clic en **"Restore"**
   - Espera 2-3 minutos
   - Intenta de nuevo

### Paso 2: Obtener la Contraseña Correcta

1. En Supabase: **Settings** → **Database**
2. Si olvidaste la contraseña, haz clic en **"Reset database password"**
3. Genera una **nueva contraseña** (guárdala bien)
4. Copia la nueva contraseña

### Paso 3: Obtener la URL Correcta (Conexión Directa)

1. En Supabase: **Settings** → **Database**
2. Busca la sección **"Connection string"**
3. Selecciona el tab **"URI"** (NO pooling)
4. Debe tener puerto **5432** y host `db.xxxxx.supabase.co`
5. Copia la URL completa

### Paso 4: Codificar la Contraseña Correctamente

Si tu nueva contraseña tiene caracteres especiales, codifícala:

```bash
# En terminal, reemplaza "TU_CONTRASEÑA" con tu contraseña real
python3 -c "import urllib.parse; print(urllib.parse.quote('TU_CONTRASEÑA', safe=''))"
```

O usa [urlencoder.org](https://www.urlencoder.org/) para codificar solo la contraseña.

### Paso 5: Actualizar .env con la URL Correcta

```env
# Usa la URL directa (puerto 5432) para db push
# Reemplaza TU_CONTRASEÑA_CODIFICADA con la contraseña codificada del paso anterior
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA_CODIFICADA@db.egnnypudfousubmmlpre.supabase.co:5432/postgres"
```

**Ejemplo**:
- Si tu contraseña es: `MiPass@123#`
- La contraseña codificada sería: `MiPass%40123%23`
- La URL final: `postgresql://postgres:MiPass%40123%23@db.egnnypudfousubmmlpre.supabase.co:5432/postgres`

### Paso 6: Probar la Conexión Manualmente (Opcional)

Para verificar que la conexión funciona antes de usar Prisma:

```bash
# Instala psql si no lo tienes (macOS)
brew install postgresql

# Prueba la conexión (reemplaza con tu DATABASE_URL)
psql "postgresql://postgres:TU_CONTRASEÑA@db.egnnypudfousubmmlpre.supabase.co:5432/postgres"

# Si conecta, escribe \q para salir
```

### Paso 7: Ejecutar db:push

```bash
npm run db:push
```

---

## 🚀 Solución Alternativa: Usar Neon (Más Confiable)

Si Supabase sigue dando problemas, **Neon** suele funcionar mejor desde localhost:

1. Ve a [neon.tech](https://neon.tech)
2. Crea cuenta con GitHub (gratis)
3. Crea nuevo proyecto
4. Copia el `DATABASE_URL` que te dan (ya viene listo)
5. Pégalo en tu `.env`:
   ```env
   DATABASE_URL="postgresql://usuario:contraseña@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```
6. Ejecuta: `npm run db:push`

**Ventaja**: Neon funciona mejor para desarrollo local y generalmente no tiene problemas de conexión.

---

## ✅ Checklist de Diagnóstico

- [ ] Proyecto de Supabase está activo (no pausado)
- [ ] Tengo la contraseña correcta (o la resetee)
- [ ] La contraseña está codificada correctamente (solo una vez)
- [ ] Estoy usando conexión directa (puerto 5432) para db push
- [ ] La URL en .env no tiene espacios extra
- [ ] Probé con Neon como alternativa

---

## 💡 Tip Final

Si nada funciona, **usa Neon** - es gratis, más fácil de configurar, y generalmente más confiable para desarrollo local. Luego puedes usar Supabase en producción si prefieres.

