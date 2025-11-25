# 🚀 Cambio Inmediato a Neon

## ✅ Confirmado: Tu proyecto de Supabase está inaccesible

El dominio no se puede resolver, lo que significa que:
- ❌ El proyecto está pausado
- ❌ O hay un problema de conectividad

**Solución: Cambiar a Neon (3 minutos)**

---

## Pasos para Cambiar a Neon

### 1. Crear Cuenta y Proyecto

1. Abre: [neon.tech](https://neon.tech)
2. Haz clic en **"Sign up"** o **"Get started"**
3. Inicia sesión con **GitHub** (un clic)
4. Haz clic en **"Create a project"**
5. Completa:
   - **Project name**: `qrs-saver`
   - **Region**: Elige la más cercana (ej: `US East` o `EU West`)
   - **PostgreSQL version**: 15 (default)
6. Haz clic en **"Create project"**

### 2. Copiar DATABASE_URL

Neon te mostrará automáticamente una **"Connection string"** que se ve así:

```
postgresql://usuario:contraseña@ep-xxxxx-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Copia toda esta URL** (haz clic en el ícono de copiar o selecciónala completa).

### 3. Actualizar tu .env

Abre tu archivo `.env` y **reemplaza** la línea de `DATABASE_URL`:

```env
# Reemplaza con la URL que copiaste de Neon
DATABASE_URL="postgresql://usuario:contraseña@ep-xxxxx-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
OPENAI_API_KEY="sk-tu-key-aqui"
CRON_SECRET="tu-secreto-aleatorio"
```

**Guarda** el archivo.

### 4. Crear las Tablas

Ejecuta:

```bash
npm run db:push
```

Esto debería funcionar **inmediatamente** sin problemas. ✅

Verás algo como:
```
✔ Generated Prisma Client
✔ Pushed database schema
```

### 5. Verificar que Funciona

```bash
# Abre Prisma Studio para ver tu base de datos
npm run db:studio
```

Esto abrirá `http://localhost:5555` donde verás la tabla `Offer`.

### 6. Poblar con Datos Iniciales (Opcional)

Ejecuta el cron para agregar ofertas:

```bash
curl -X POST http://localhost:3000/api/cron/update-offers \
  -H "Authorization: Bearer TU_CRON_SECRET"
```

(Reemplaza `TU_CRON_SECRET` con el valor de tu `.env`)

---

## ✅ Ventajas de Neon

- ✅ **Funciona inmediatamente** - No hay problemas de DNS/pausado
- ✅ **No se pausa** - Siempre disponible
- ✅ **Más fácil de configurar** - Todo funciona de inmediato
- ✅ **Compatible con Vercel** - Funciona perfecto en producción
- ✅ **Gratis** - Plan gratuito generoso

---

## Para Producción (Vercel)

Cuando despliegues en Vercel:

1. Ve a **Vercel Dashboard** → Tu proyecto → **Settings** → **Environment Variables**
2. Agrega:
   - **Name**: `DATABASE_URL`
   - **Value**: La misma URL de Neon que usaste en `.env`
   - **Environment**: Todas (Production, Preview, Development)
3. Guarda y redespliega

---

## 🎉 ¡Listo!

Una vez que hayas ejecutado `npm run db:push` exitosamente, todo funcionará normalmente. La aplicación usará Neon para todas las operaciones de base de datos.

**No necesitas hacer nada más.** Neon manejará todo automáticamente.

---

## ¿Necesitas Ayuda?

Si tienes problemas:
- [Documentación de Neon](https://neon.tech/docs)
- [Comunidad de Neon](https://neon.tech/community)

Pero normalmente funciona inmediatamente sin problemas! 🚀

