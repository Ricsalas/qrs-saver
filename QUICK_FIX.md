# ⚡ Solución Rápida: Error de Conexión a Supabase

## 🎯 Recomendación: Usar Neon (5 minutos)

Neon es más confiable para desarrollo local. Pasos:

1. **Crea cuenta**: [neon.tech](https://neon.tech) → Sign up con GitHub
2. **Crea proyecto**: Click "Create project" → Nombre: `qrs-saver`
3. **Copia DATABASE_URL**: Te lo dan automáticamente, se ve así:
   ```
   postgresql://usuario:contraseña@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. **Actualiza `.env`**:
   ```env
   DATABASE_URL="postgresql://usuario:contraseña@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```
5. **Ejecuta**:
   ```bash
   npm run db:push
   ```

✅ **Listo!** Neon funciona inmediatamente sin problemas de conexión.

---

## 🔧 Si Prefieres Arreglar Supabase

### Paso 1: Verificar Proyecto Activo
- Ve a [app.supabase.com](https://app.supabase.com)
- Si dice "Project is paused" → Click "Restore" → Espera 3 minutos

### Paso 2: Resetear Contraseña
1. Settings → Database → "Reset database password"
2. Genera nueva contraseña (guárdala)

### Paso 3: Obtener URL Directa
1. Settings → Database → Connection string → Tab "URI"
2. Copia la URL (puerto 5432)

### Paso 4: Codificar Contraseña (si tiene caracteres especiales)
```bash
python3 -c "import urllib.parse; print(urllib.parse.quote('TU_CONTRASEÑA', safe=''))"
```

### Paso 5: Actualizar .env
```env
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA_CODIFICADA@db.xxxxx.supabase.co:5432/postgres"
```

### Paso 6: Probar
```bash
npm run db:push
```

---

## 💡 ¿Cuál Elegir?

- **Neon**: Más fácil, funciona inmediatamente, no se pausa
- **Supabase**: Más popular, buena integración, puede pausarse

**Recomendación**: Usa Neon para desarrollo y Supabase para producción (si prefieres).

