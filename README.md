# QRS Saver

A B2C web app that recommends the best food (QSR) deals using OpenAI.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- OpenAI (GPT-4o-mini)
- Deployed on Vercel

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```
OPENAI_API_KEY=your_openai_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app
  /api
    /offers          → returns hardcoded offers
    /recommend       → calls OpenAI and returns best offers
  /page.tsx          → main UI (chat + recommendations)
/components
  ChatInput.tsx
  OfferCard.tsx
/data
  offers.ts
/lib
  openai.ts
/types
  index.ts
```

## How It Works

1. User enters free-text like "algo barato con pollo crispy"
2. System sends user input + JSON list of offers to OpenAI (server-side)
3. OpenAI returns 1-3 recommended offers with reasons
4. UI displays offer cards with chain, name, price, and reason

## Deployment

### Opción 1: Vercel (Recomendado - Más fácil)

Vercel es la plataforma ideal para Next.js. Sigue estos pasos:

#### Paso 1: Preparar el código en GitHub

1. Crea un repositorio en GitHub (si no lo tienes):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/qrs-saver.git
   git push -u origin main
   ```

#### Paso 2: Desplegar en Vercel

1. Ve a [vercel.com](https://vercel.com) y crea una cuenta (o inicia sesión)
2. Haz clic en "Add New Project"
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente que es un proyecto Next.js
5. **IMPORTANTE**: Agrega la variable de entorno:
   - En "Environment Variables", agrega:
     - **Name**: `OPENAI_API_KEY`
     - **Value**: Tu clave de API de OpenAI
6. Haz clic en "Deploy"
7. ¡Listo! Tu app estará disponible en una URL como: `https://qrs-saver.vercel.app`

#### Paso 3: Configuración adicional (opcional)

- **Dominio personalizado**: Puedes agregar tu propio dominio en la configuración del proyecto
- **Variables de entorno**: Todas las variables `.env.local` deben agregarse en Vercel

### Opción 2: Otras plataformas

#### Netlify
1. Conecta tu repositorio de GitHub
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Agrega `OPENAI_API_KEY` en las variables de entorno

#### Railway
1. Conecta tu repositorio
2. Railway detectará Next.js automáticamente
3. Agrega `OPENAI_API_KEY` en las variables de entorno

### Verificación pre-despliegue

Antes de desplegar, asegúrate de:

- ✅ El proyecto compila sin errores: `npm run build`
- ✅ No hay errores de TypeScript: `npm run lint`
- ✅ La variable `OPENAI_API_KEY` está configurada
- ✅ El archivo `.env.local` está en `.gitignore` (no se sube a GitHub)

### Notas importantes

- **Nunca subas tu `.env.local` a GitHub** - ya está en `.gitignore`
- Las variables de entorno deben configurarse en la plataforma de despliegue
- Vercel ofrece despliegues automáticos en cada push a `main`
- El primer despliegue puede tardar 2-3 minutos

