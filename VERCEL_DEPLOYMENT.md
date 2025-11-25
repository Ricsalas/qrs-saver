# 🚀 Guía de Despliegue a Vercel - QRS Saver

## ✅ Checklist Pre-Despliegue

- [x] Build funciona correctamente (`npm run build`)
- [x] Base de datos configurada (Neon)
- [x] Código en GitHub
- [ ] Variables de entorno configuradas en Vercel

---

## Paso 1: Hacer Commit y Push a GitHub

Primero, asegúrate de que todos los cambios estén en GitHub:

```bash
# Agregar todos los archivos nuevos
git add .

# Hacer commit
git commit -m "feat: add database support with Prisma and Neon, cron jobs, and multi-source fetchers"

# Push a GitHub
git push origin main
```

---

## Paso 2: Crear Proyecto en Vercel

1. **Ve a [vercel.com](https://vercel.com)** e inicia sesión (usa tu cuenta de GitHub)

2. **Haz clic en "Add New Project"** o **"New Project"**

3. **Importa tu repositorio**:
   - Busca y selecciona `qrs-saver` de tu lista de repositorios
   - Si no aparece, haz clic en "Adjust GitHub App Permissions" y autoriza a Vercel

4. **Configuración del proyecto**:
   - Framework Preset: **Next.js** (debería estar detectado automáticamente)
   - Root Directory: `./` (dejar por defecto)
   - Build Command: `npm run build` (automático)
   - Output Directory: `.next` (automático)
   - Install Command: `npm install` (automático)

---

## Paso 3: Configurar Variables de Entorno

**⚠️ MUY IMPORTANTE**: Agrega estas variables antes de desplegar:

### Variables Requeridas:

1. **`DATABASE_URL`**
   - **Value**: Tu URL de Neon (la misma que usas en `.env` local)
   - **Formato**: `postgresql://usuario:contraseña@ep-xxxxx.aws.neon.tech/neondb?sslmode=require`
   - **Environment**: Todas (Production, Preview, Development)

2. **`OPENAI_API_KEY`**
   - **Value**: Tu clave de API de OpenAI
   - **Formato**: `sk-...`
   - **Environment**: Todas (Production, Preview, Development)

3. **`CRON_SECRET`**
   - **Value**: Tu secreto para proteger el cron endpoint
   - **Formato**: Cualquier string largo y aleatorio
   - **Environment**: Todas (Production, Preview, Development)

### Cómo agregar variables:

1. En la página de configuración del proyecto, ve a **"Environment Variables"**
2. Para cada variable:
   - Haz clic en **"Add New"**
   - Ingresa el **Name** y **Value**
   - Selecciona todos los **Environments** (Production, Preview, Development)
   - Haz clic en **"Save"**

---

## Paso 4: Desplegar

1. Haz clic en **"Deploy"**
2. Espera 2-3 minutos mientras Vercel:
   - Instala dependencias
   - Genera Prisma Client
   - Construye la aplicación
   - Despliega

3. **¡Listo!** 🎉 Tu app estará disponible en:
   - `https://qrs-saver-[hash].vercel.app`
   - La URL exacta aparecerá en el dashboard

---

## Paso 5: Verificar el Despliegue

### 1. Verificar que la app carga

Visita tu URL de Vercel en el navegador. Deberías ver la interfaz de QRS Saver.

### 2. Verificar el endpoint de ofertas

```bash
curl https://tu-app.vercel.app/api/offers
```

### 3. Poblar la base de datos (Primera vez)

Ejecuta el cron manualmente para poblar la base de datos con ofertas iniciales:

```bash
curl -X POST https://tu-app.vercel.app/api/cron/update-offers \
  -H "Authorization: Bearer TU_CRON_SECRET"
```

(Reemplaza `TU_CRON_SECRET` con el valor que configuraste)

### 4. Verificar el cron job

1. Ve a **Vercel Dashboard** → Tu proyecto → **Settings** → **Cron Jobs**
2. Verifica que `/api/cron/update-offers` esté configurado para correr cada hora (`0 * * * *`)

El cron correrá automáticamente cada hora y actualizará las ofertas.

---

## Paso 6: Configuración Adicional

### Dominio Personalizado (Opcional)

1. Ve a **Settings** → **Domains**
2. Agrega tu dominio personalizado
3. Sigue las instrucciones para configurar DNS

### Monitoreo

- **Logs**: Ve a **Deployments** → Selecciona un deployment → **Functions** → Ver logs
- **Analytics**: Habilita Vercel Analytics en **Settings** → **Analytics**
- **Cron Jobs**: Monitorea en **Settings** → **Cron Jobs**

---

## 🔧 Solución de Problemas

### Error: "DATABASE_URL is not set"

**Solución**:
1. Ve a **Settings** → **Environment Variables**
2. Verifica que `DATABASE_URL` esté configurada
3. Redespliega el proyecto

### Error: "Prisma Client not found"

**Solución**:
1. Verifica que el build command incluya `prisma generate`
2. Ya está configurado en `package.json`: `"build": "prisma generate && next build"`
3. Si persiste, verifica los logs de build en Vercel

### Error de conexión a la base de datos

**Solución**:
1. Verifica que la `DATABASE_URL` sea correcta
2. Asegúrate de que Neon permite conexiones desde Vercel (por defecto sí)
3. Verifica que la base de datos no esté pausada

### El cron no se ejecuta

**Solución**:
1. Verifica que `vercel.json` esté en el repositorio
2. Verifica en **Settings** → **Cron Jobs** que aparezca configurado
3. Revisa los logs del cron en **Deployments**

### Error 401 en el cron

**Solución**:
1. Verifica que `CRON_SECRET` esté configurado en Vercel
2. Vercel agregará automáticamente el header `Authorization: Bearer [CRON_SECRET]` cuando ejecute el cron
3. Si ejecutas manualmente, usa el `CRON_SECRET` correcto

---

## 📊 Post-Despliegue

### Verificar que todo funciona:

1. ✅ App carga correctamente
2. ✅ Endpoint `/api/offers` devuelve ofertas
3. ✅ Endpoint `/api/recommend` funciona con OpenAI
4. ✅ Cron job ejecutándose cada hora
5. ✅ Base de datos actualizándose automáticamente

### Monitorear:

- **Uso de API de OpenAI**: Revisa tu dashboard de OpenAI
- **Cron Jobs**: Revisa logs en Vercel
- **Base de datos**: Revisa en Neon dashboard
- **Errores**: Revisa logs en Vercel

---

## 🔄 Actualizaciones Futuras

Para actualizar la app:

1. Haz cambios en tu código local
2. Haz commit y push:
   ```bash
   git add .
   git commit -m "Descripción de los cambios"
   git push
   ```
3. Vercel desplegará automáticamente la nueva versión

---

## 💰 Costos Estimados

### Gratis:
- **Vercel Hobby Plan**: Despliegues ilimitados, 100GB ancho de banda
- **Neon Free Tier**: 512MB base de datos, suficiente para desarrollo
- **OpenAI API**: Pay-as-you-go, muy económico con GPT-4o-mini

### Para producción con más tráfico:
- Considera planes Pro si necesitas más recursos
- Monitora el uso de OpenAI API
- Escala Neon según necesidades

---

## ✅ Checklist Final

- [ ] Código subido a GitHub
- [ ] Build funciona localmente
- [ ] Variables de entorno configuradas en Vercel:
  - [ ] `DATABASE_URL`
  - [ ] `OPENAI_API_KEY`
  - [ ] `CRON_SECRET`
- [ ] App desplegada y accesible
- [ ] Cron job configurado y ejecutándose
- [ ] Base de datos poblada con ofertas iniciales
- [ ] Endpoints funcionando correctamente

---

¡Listo! Tu app debería estar funcionando en producción. 🚀

