#!/usr/bin/env node

/**
 * Script para remover decoración festiva
 * Uso: node scripts/remove-holiday.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🎄 ===============================================');
console.log('   REMOVIENDO DECORACIÓN FESTIVA');
console.log('===============================================\n');

const rootDir = process.cwd();
let successCount = 0;
let errorCount = 0;

// Archivos y carpetas a eliminar
const filesToRemove = [
  'components/holiday',
  'styles/holiday.css',
];

// Archivos a modificar
const filesToModify = [
  {
    path: '.env.local',
    find: 'NEXT_PUBLIC_HOLIDAY_MODE=true',
    replace: 'NEXT_PUBLIC_HOLIDAY_MODE=false',
    description: 'Desactivar holiday mode en .env.local',
  },
  {
    path: 'app/globals.css',
    find: "@import '../styles/holiday.css';",
    replace: "/* @import '../styles/holiday.css'; */",
    description: 'Comentar import de holiday.css',
  },
];

// Función para eliminar archivos/carpetas
function removeFileOrDir(relativePath) {
  const fullPath = path.join(rootDir, relativePath);
  
  try {
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`✅ Eliminada carpeta: ${relativePath}`);
      } else {
        fs.unlinkSync(fullPath);
        console.log(`✅ Eliminado archivo: ${relativePath}`);
      }
      successCount++;
    } else {
      console.log(`⚠️  No encontrado: ${relativePath}`);
    }
  } catch (error) {
    console.error(`❌ Error al eliminar ${relativePath}:`, error.message);
    errorCount++;
  }
}

// Función para modificar archivos
function modifyFile({ path: filePath, find, replace, description }) {
  const fullPath = path.join(rootDir, filePath);
  
  try {
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      if (content.includes(find)) {
        content = content.replace(new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ ${description}`);
        successCount++;
      } else {
        console.log(`⚠️  No se encontró el texto a reemplazar en: ${filePath}`);
      }
    } else {
      console.log(`⚠️  Archivo no encontrado: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error al modificar ${filePath}:`, error.message);
    errorCount++;
  }
}

// Ejecutar eliminaciones
console.log('📁 Eliminando archivos festivos...\n');
filesToRemove.forEach(removeFileOrDir);

// Ejecutar modificaciones
console.log('\n📝 Modificando configuración...\n');
filesToModify.forEach(modifyFile);

// Resumen
console.log('\n===============================================');
console.log('   RESUMEN');
console.log('===============================================');
console.log(`✅ Operaciones exitosas: ${successCount}`);
console.log(`❌ Errores: ${errorCount}`);

if (errorCount === 0) {
  console.log('\n✨ ¡Decoración festiva removida exitosamente!');
  console.log('\n💡 Próximos pasos:');
  console.log('   1. Reiniciar el servidor: npm run dev');
  console.log('   2. (Opcional) Limpiar caché: rm -rf .next\n');
} else {
  console.log('\n⚠️  Algunos archivos no pudieron ser procesados.');
  console.log('   Revisa los errores arriba y ejecuta el script nuevamente.\n');
  process.exit(1);
}

// Opcional: Preguntar si desea remover también el código condicional
console.log('📋 NOTA: El código condicional en los componentes se mantendrá.');
console.log('   Para removerlo completamente, busca: git grep "HOLIDAY MODE"');
console.log('   Y elimina los bloques marcados manualmente.\n');

console.log('===============================================\n');
