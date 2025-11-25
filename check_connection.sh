#!/bin/bash

echo "🔍 Verificando conexión a Supabase..."
echo ""

# Verificar si .env existe
if [ ! -f .env ]; then
    echo "❌ No se encontró archivo .env"
    exit 1
fi

# Mostrar DATABASE_URL (sin mostrar contraseña completa)
echo "📋 DATABASE_URL encontrada:"
grep "DATABASE_URL" .env | sed 's/:[^@]*@/:***@/g'
echo ""

# Verificar formato
DB_URL=$(grep "^DATABASE_URL=" .env | cut -d'=' -f2- | tr -d '"')

if [[ "$DB_URL" == *"%9c"* && "$DB_URL" != *"%259c"* ]]; then
    echo "⚠️  PROBLEMA DETECTADO:"
    echo "   La contraseña no está codificada correctamente"
    echo "   Debe cambiar %9c a %259c"
    echo ""
    echo "✅ Solución:"
    echo "   Abre .env y cambia:"
    echo "   F.Wqiw9d6aeY%9c"
    echo "   por:"
    echo "   F.Wqiw9d6aeY%259c"
    echo ""
elif [[ "$DB_URL" == *"%259c"* ]]; then
    echo "✅ Contraseña parece estar codificada correctamente"
    echo ""
fi

echo "📝 Pasos siguientes:"
echo "   1. Verifica que tu proyecto de Supabase NO esté pausado"
echo "   2. Ve a: https://app.supabase.com"
echo "   3. Si dice 'Restore', haz clic y espera 3 minutos"
echo "   4. Luego ejecuta: npm run db:push"
echo ""
