#!/usr/bin/env node

// Solo usar axios si está disponible, sino usar fetch nativo
let axios;
try {
  axios = require('axios');
} catch (error) {
  console.log('⚠️  axios no está disponible, usando fetch nativo');
}

const API_BASE = 'http://localhost:3001/api';

async function checkEndpoint(endpoint, description) {
  try {
    let response;
    
    if (axios) {
      response = await axios.get(`${API_BASE}${endpoint}`);
      console.log(`✅ ${description}: OK (${response.status})`);
    } else {
      // Usar fetch nativo si axios no está disponible
      const fetchResponse = await fetch(`${API_BASE}${endpoint}`);
      response = { status: fetchResponse.status };
      console.log(`✅ ${description}: OK (${response.status})`);
    }
    
    return true;
  } catch (error) {
    console.log(`❌ ${description}: FAILED`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error: ${error.response.data?.error || 'Unknown error'}`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
    return false;
  }
}

async function checkAPI() {
  console.log('🔍 Verificando endpoints del backend...\n');
  
  const checks = [
    ['/health', 'Health Check'],
    ['/users', 'Lista de usuarios'],
    ['/matches', 'Lista de partidos'],
    ['/matches/upcoming', 'Partidos próximos'],
    ['/ranking/global', 'Ranking global'],
  ];
  
  let passed = 0;
  
  for (const [endpoint, description] of checks) {
    const success = await checkEndpoint(endpoint, description);
    if (success) passed++;
  }
  
  console.log(`\n📊 Resultado: ${passed}/${checks.length} endpoints funcionando`);
  
  if (passed === checks.length) {
    console.log('\n🎉 ¡Todo está funcionando correctamente!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Abrir http://localhost:3000 en tu navegador');
    console.log('2. Ir a /pronosticos para hacer predicciones');
    console.log('3. Ir a /perfil para editar tu información');
    console.log('4. Ir a /historial para ver tus estadísticas');
  } else {
    console.log('\n⚠️  Algunos endpoints no están funcionando');
    console.log('\n🔧 Soluciones recomendadas:');
    console.log('1. Verificar que el backend esté corriendo: npm run dev');
    console.log('2. Verificar la base de datos: npm run db:push');
    console.log('3. Poblar con datos: npm run db:seed');
  }
}

checkAPI().catch(console.error);
