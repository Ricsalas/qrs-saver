# Guía de Despliegue - QRS Saver

Esta guía te ayudará a publicar QRS Saver en internet usando Vercel (la opción más fácil para Next.js).

## 🚀 Despliegue en Vercel (Recomendado)

### Requisitos previos

1. Una cuenta en [GitHub](https://github.com) (gratis)
2. Una cuenta en [Vercel](https://vercel.com) (gratis)
3. Tu clave de API de OpenAI (`OPENAI_API_KEY`)

### Paso 1: Subir código a GitHub

Si aún no tienes el código en GitHub:

```bash
# Inicializar git (si no lo has hecho)
git init

# Agregar todos los archivos
git add .

# Hacer commit inicial
git commit -m "Initial commit: QRS Saver MVP"

# Crear repositorio en GitHub y luego:
git remote add origin https://github.com/TU-USUARIO/qrs-saver.git
git branch -M main
git push -u origin main
```

**Importante**: Asegúrate de que `.env.local` esté en `.gitignore` (ya está incluido).

### Paso 2: Crear proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión (puedes usar tu cuenta de GitHub)

2. Haz clic en **"Add New Project"** o **"New Project"**

3. **Importa tu repositorio**:
   - Selecciona el repositorio `qrs-saver` de GitHub
   - Si no aparece, autoriza a Vercel a acceder a tus repositorios

4. **Configuración del proyecto**:
   - Vercel detectará automáticamente que es Next.js
   - Framework Preset: **Next.js** (debería estar seleccionado)
   - Root Directory: `./` (dejar por defecto)
   - Build Command: `npm run build` (automático)
   - Output Directory: `.next` (automático)

5. **Variables de entorno** (MUY IMPORTANTE):
   - Haz clic en **"Environment Variables"**
   - Agrega una nueva variable:
     - **Name**: `OPENAI_API_KEY`
     - **Value**: Pega tu clave de API de OpenAI
     - **Environment**: Selecciona todas (Production, Preview, Development)
   - Haz clic en **"Save"**

6. **Desplegar**:
   - Haz clic en **"Deploy"**
   - Espera 2-3 minutos mientras Vercel construye y despliega tu app

7. **¡Listo!** 🎉
   - Tu app estará disponible en: `https://qrs-saver-xxxxx.vercel.app`
   - También puedes ver la URL en el dashboard de Vercel

### Paso 3: Configuración adicional

#### Dominio personalizado (opcional)

1. En el dashboard de Vercel, ve a **Settings** → **Domains**
2. Agrega tu dominio (ej: `qrs-saver.com`)
3. Sigue las instrucciones para configurar DNS

#### Despliegues automáticos

- Cada push a `main` desplegará automáticamente
- Los pull requests crearán "preview deployments"
- Puedes ver el historial de despliegues en el dashboard

## 🔧 Solución de problemas

### Error: "OPENAI_API_KEY is not set"

**Solución**: Asegúrate de haber agregado la variable de entorno en Vercel:
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Verifica que `OPENAI_API_KEY` esté configurada
4. Redespliega el proyecto

### Error de build

**Solución**: 
1. Verifica que el build funcione localmente: `npm run build`
2. Revisa los logs de build en Vercel
3. Asegúrate de que todas las dependencias estén en `package.json`

### La app no carga

**Solución**:
1. Revisa los logs en Vercel (pestaña "Logs")
2. Verifica que no haya errores en la consola del navegador
3. Asegúrate de que la variable `OPENAI_API_KEY` esté configurada correctamente

## 📊 Monitoreo

Vercel proporciona:
- **Analytics**: Estadísticas de visitas (requiere plan Pro para detalles avanzados)
- **Logs**: Ver errores y logs en tiempo real
- **Performance**: Métricas de rendimiento de la app

## 🔄 Actualizaciones

Para actualizar la app:

1. Haz cambios en tu código local
2. Haz commit y push a GitHub:
   ```bash
   git add .
   git commit -m "Descripción de los cambios"
   git push
   ```
3. Vercel desplegará automáticamente la nueva versión

## 💰 Costos

- **Vercel Hobby Plan**: Gratis para proyectos personales
  - Despliegues ilimitados
  - 100 GB de ancho de banda
  - Dominios personalizados
  - SSL automático

- **OpenAI API**: Pay-as-you-go
  - GPT-4o-mini es muy económico (~$0.15 por 1M tokens)
  - Para un MVP, los costos serán mínimos

## ✅ Checklist pre-despliegue

- [ ] El proyecto compila: `npm run build`
- [ ] No hay errores de TypeScript
- [ ] `.env.local` está en `.gitignore`
- [ ] Código subido a GitHub
- [ ] Variable `OPENAI_API_KEY` lista para agregar en Vercel
- [ ] Has probado la app localmente

## 🎯 Próximos pasos después del despliegue

1. Comparte la URL con usuarios para obtener feedback
2. Monitorea el uso de la API de OpenAI
3. Considera agregar analytics (Google Analytics, Vercel Analytics)
4. Optimiza según el feedback de usuarios

---

¿Necesitas ayuda? Revisa la [documentación de Vercel](https://vercel.com/docs) o los logs de despliegue.

