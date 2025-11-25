#!/bin/bash

echo "🔍 Verificando si el puerto 6543 está accesible..."
echo ""

# Verificar si podemos alcanzar el pooler
if command -v nc &> /dev/null; then
    echo "Probando conexión a pooler.supabase.com:6543..."
    timeout 3 nc -zv aws-0-us-east-1.pooler.supabase.com 6543 2>&1 | head -1
    echo ""
fi

echo "📝 Si el puerto 6543 está abierto, puedes usar Connection Pooling."
echo ""
echo "Para usar pooling:"
echo "1. Ve a Supabase → Settings → Database"
echo "2. Selecciona tab 'Connection pooling'"
echo "3. Copia la URL (puerto 6543)"
echo "4. Actualiza tu .env"
echo ""
echo "Ejemplo de URL de pooling:"
echo 'DATABASE_URL="postgresql://postgres.xxxxx:CONTRASEÑA@aws-0-saopaulo.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"'
