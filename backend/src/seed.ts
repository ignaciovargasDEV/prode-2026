import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Crear equipos del Mundial 2022
  console.log('Creating teams...')
    const teams = [
    { name: 'Arabia Saudí', country: 'Arabia Saudí' },
    { name: 'Argentina', country: 'Argentina' },
    { name: 'Australia', country: 'Australia' },
    { name: 'Bélgica', country: 'Bélgica' },
    { name: 'Brasil', country: 'Brasil' },
    { name: 'Camerún', country: 'Camerún' },
    { name: 'Canadá', country: 'Canadá' },
    { name: 'Chile', country: 'Chile' },
    { name: 'Colombia', country: 'Colombia' },
    { name: 'Costa Rica', country: 'Costa Rica' },
    { name: 'Croacia', country: 'Croacia' },
    { name: 'Dinamarca', country: 'Dinamarca' },
    { name: 'Ecuador', country: 'Ecuador' },
    { name: 'España', country: 'España' },
    { name: 'Estados Unidos', country: 'Estados Unidos' },
    { name: 'Francia', country: 'Francia' },
    { name: 'Gales', country: 'Gales' },
    { name: 'Alemania', country: 'Alemania' },
    { name: 'Ghana', country: 'Ghana' },
    { name: 'Inglaterra', country: 'Inglaterra' },
    { name: 'Irán', country: 'Irán' },
    { name: 'Italia', country: 'Italia' },
    { name: 'Japón', country: 'Japón' },
    { name: 'Marruecos', country: 'Marruecos' },
    { name: 'México', country: 'México' },
    { name: 'Países Bajos', country: 'Países Bajos' },
    { name: 'Polonia', country: 'Polonia' },
    { name: 'Portugal', country: 'Portugal' },
    { name: 'Catar', country: 'Catar' },
    { name: 'Senegal', country: 'Senegal' },
    { name: 'Serbia', country: 'Serbia' },
    { name: 'Corea del Sur', country: 'Corea del Sur' },
    { name: 'Suiza', country: 'Suiza' },
    { name: 'Túnez', country: 'Túnez' },
    { name: 'Uruguay', country: 'Uruguay' }
  ]

  const createdTeams = await Promise.all(
    teams.map(team => 
      prisma.team.upsert({
        where: { name: team.name },
        update: {},
        create: team
      })
    )
  )

  console.log(`Created ${createdTeams.length} teams`)

  // Crear usuarios de ejemplo
  console.log('Creating users...')
  const users = [
    { email: 'juan.perez@empresa.com', nombre: 'Juan', apellido: 'Pérez', area: 'Tecnología' },
    { email: 'maria.gonzalez@empresa.com', nombre: 'María', apellido: 'González', area: 'Marketing' },
    { email: 'carlos.rodriguez@empresa.com', nombre: 'Carlos', apellido: 'Rodríguez', area: 'Ventas' },
    { email: 'ana.martinez@empresa.com', nombre: 'Ana', apellido: 'Martínez', area: 'Tecnología' },
    { email: 'laura.fernandez@empresa.com', nombre: 'Laura', apellido: 'Fernández', area: 'Recursos Humanos' },
    { email: 'diego.lopez@empresa.com', nombre: 'Diego', apellido: 'López', area: 'Marketing' }
  ]

  const createdUsers = await Promise.all(
    users.map(user => 
      prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: user
      })
    )
  )

  console.log(`Created ${createdUsers.length} users`)

  // Crear partidos del Mundial 2022 (algunos ejemplos representativos)
  console.log('Creating matches...')
  const matches = [
    // Fase de Grupos - Grupo A
    {
      fecha: new Date('2022-11-20T15:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Catar')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Ecuador')!.id,
      fase: 'GRUPOS',
      status: 'FINALIZADO',
      homeGoals: 0,
      awayGoals: 2
    },
    {
      fecha: new Date('2022-11-21T18:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Senegal')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Países Bajos')!.id,
      fase: 'GRUPOS',
      status: 'FINALIZADO',
      homeGoals: 0,
      awayGoals: 2
    },
    // Grupo B
    {
      fecha: new Date('2022-11-21T12:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Inglaterra')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Irán')!.id,
      fase: 'GRUPOS',
      status: 'FINALIZADO',
      homeGoals: 6,
      awayGoals: 2
    },
    {
      fecha: new Date('2022-11-21T19:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Estados Unidos')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Gales')!.id,
      fase: 'GRUPOS',
      status: 'FINALIZADO',
      homeGoals: 1,
      awayGoals: 1
    },
    // Grupo C
    {
      fecha: new Date('2022-11-22T15:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Argentina')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Arabia Saudí')!.id,
      fase: 'GRUPOS',
      status: 'FINALIZADO',
      homeGoals: 1,
      awayGoals: 2
    },
    {
      fecha: new Date('2022-11-22T18:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'México')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Polonia')!.id,
      fase: 'GRUPOS',
      status: 'FINALIZADO',
      homeGoals: 0,
      awayGoals: 0
    },
    // Grupo D
    {
      fecha: new Date('2022-11-22T12:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Dinamarca')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Túnez')!.id,
      fase: 'GRUPOS',
      status: 'FINALIZADO',
      homeGoals: 0,
      awayGoals: 0
    },
    {
      fecha: new Date('2022-11-22T21:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Francia')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Australia')!.id,
      fase: 'GRUPOS',
      status: 'FINALIZADO',
      homeGoals: 4,
      awayGoals: 1
    },
    // Grupo E
    {
      fecha: new Date('2022-11-23T12:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Alemania')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Japón')!.id,
      fase: 'GRUPOS',
      status: 'FINALIZADO',
      homeGoals: 1,
      awayGoals: 2
    },
    {
      fecha: new Date('2022-11-23T15:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'España')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Costa Rica')!.id,
      fase: 'GRUPOS',
      status: 'FINALIZADO',
      homeGoals: 7,
      awayGoals: 0
    },
    // Grupo F
    {
      fecha: new Date('2022-11-23T18:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Marruecos')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Croacia')!.id,
      fase: 'GRUPOS',
      status: 'FINALIZADO',
      homeGoals: 0,
      awayGoals: 0
    },
    {
      fecha: new Date('2022-11-23T21:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Bélgica')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Canadá')!.id,
      fase: 'GRUPOS',
      status: 'FINALIZADO',
      homeGoals: 1,
      awayGoals: 0
    },
    // Grupo G
    {
      fecha: new Date('2022-11-24T12:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Suiza')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Camerún')!.id,
      fase: 'GRUPOS',
      status: 'FINALIZADO',
      homeGoals: 1,
      awayGoals: 0
    },
    {
      fecha: new Date('2022-11-24T15:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Uruguay')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Corea del Sur')!.id,
      fase: 'GRUPOS',
      status: 'FINALIZADO',
      homeGoals: 0,
      awayGoals: 0
    },
    // Grupo H
    {
      fecha: new Date('2022-11-24T18:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Portugal')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Ghana')!.id,
      fase: 'GRUPOS',
      status: 'FINALIZADO',
      homeGoals: 3,
      awayGoals: 2
    },
    {
      fecha: new Date('2022-11-24T21:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Brasil')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Serbia')!.id,
      fase: 'GRUPOS',
      status: 'FINALIZADO',
      homeGoals: 2,
      awayGoals: 0
    },
    // Algunos partidos de Octavos de Final
    {
      fecha: new Date('2022-12-03T15:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Países Bajos')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Estados Unidos')!.id,
      fase: 'OCTAVOS',
      status: 'FINALIZADO',
      homeGoals: 3,
      awayGoals: 1
    },
    {
      fecha: new Date('2022-12-03T19:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Argentina')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Australia')!.id,
      fase: 'OCTAVOS',
      status: 'FINALIZADO',
      homeGoals: 2,
      awayGoals: 1
    },
    {
      fecha: new Date('2022-12-04T15:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Francia')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Polonia')!.id,
      fase: 'OCTAVOS',
      status: 'FINALIZADO',
      homeGoals: 3,
      awayGoals: 1
    },
    {
      fecha: new Date('2022-12-04T19:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Inglaterra')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Senegal')!.id,
      fase: 'OCTAVOS',
      status: 'FINALIZADO',
      homeGoals: 3,
      awayGoals: 0
    },
    // Cuartos de Final
    {
      fecha: new Date('2022-12-09T15:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Croacia')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Brasil')!.id,
      fase: 'CUARTOS',
      status: 'FINALIZADO',
      homeGoals: 1,
      awayGoals: 1
    },
    {
      fecha: new Date('2022-12-09T19:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Países Bajos')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Argentina')!.id,
      fase: 'CUARTOS',
      status: 'FINALIZADO',
      homeGoals: 2,
      awayGoals: 2
    },
    {
      fecha: new Date('2022-12-10T15:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Marruecos')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Portugal')!.id,
      fase: 'CUARTOS',
      status: 'FINALIZADO',
      homeGoals: 1,
      awayGoals: 0
    },
    {
      fecha: new Date('2022-12-10T19:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Inglaterra')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Francia')!.id,
      fase: 'CUARTOS',
      status: 'FINALIZADO',
      homeGoals: 1,
      awayGoals: 2
    },
    // Semifinales
    {
      fecha: new Date('2022-12-13T19:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Argentina')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Croacia')!.id,
      fase: 'SEMIFINAL',
      status: 'FINALIZADO',
      homeGoals: 3,
      awayGoals: 0
    },
    {
      fecha: new Date('2022-12-14T19:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Francia')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Marruecos')!.id,
      fase: 'SEMIFINAL',
      status: 'FINALIZADO',
      homeGoals: 2,
      awayGoals: 0
    },
    // Tercer Puesto
    {
      fecha: new Date('2022-12-17T15:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Croacia')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Marruecos')!.id,
      fase: 'TERCER_PUESTO',
      status: 'FINALIZADO',
      homeGoals: 2,
      awayGoals: 1
    },
    // Final
    {
      fecha: new Date('2022-12-18T15:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Argentina')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Francia')!.id,
      fase: 'FINAL',
      status: 'FINALIZADO',
      homeGoals: 3,
      awayGoals: 3
    },

    // ========= MUNDIAL 2026 - PARTIDOS FUTUROS PARA PRONOSTICAR =========
    
    // Fase de Grupos - Jornada 1
    {
      fecha: new Date('2026-06-11T15:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Estados Unidos')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'México')!.id,
      fase: 'GRUPOS',
      status: 'PENDIENTE'
    },
    {
      fecha: new Date('2026-06-11T18:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Canadá')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Costa Rica')!.id,
      fase: 'GRUPOS',
      status: 'PENDIENTE'
    },
    {
      fecha: new Date('2026-06-12T12:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Inglaterra')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Gales')!.id,
      fase: 'GRUPOS',
      status: 'PENDIENTE'
    },
    {
      fecha: new Date('2026-06-12T15:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Argentina')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Chile')!.id,
      fase: 'GRUPOS',
      status: 'PENDIENTE'
    },
    {
      fecha: new Date('2026-06-12T18:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Brasil')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Colombia')!.id,
      fase: 'GRUPOS',
      status: 'PENDIENTE'
    },
    
    // Jornada 2
    {
      fecha: new Date('2026-06-13T12:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'España')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Italia')!.id,
      fase: 'GRUPOS',
      status: 'PENDIENTE'
    },
    {
      fecha: new Date('2026-06-13T15:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Francia')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Alemania')!.id,
      fase: 'GRUPOS',
      status: 'FINALIZADO',
      homeGoals: 2,
      awayGoals: 1
    },
    {
      fecha: new Date('2026-06-13T18:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Portugal')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Países Bajos')!.id,
      fase: 'GRUPOS',
      status: 'PENDIENTE'
    },
    {
      fecha: new Date('2026-06-13T21:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Bélgica')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Suiza')!.id,
      fase: 'GRUPOS',
      status: 'PENDIENTE'
    },
    
    // Jornada 3
    {
      fecha: new Date('2026-06-14T15:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Croacia')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Dinamarca')!.id,
      fase: 'GRUPOS',
      status: 'PENDIENTE'
    },
    {
      fecha: new Date('2026-06-14T18:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Uruguay')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Ecuador')!.id,
      fase: 'GRUPOS',
      status: 'PENDIENTE'
    },
    {
      fecha: new Date('2026-06-15T12:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Japón')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Australia')!.id,
      fase: 'GRUPOS',
      status: 'PENDIENTE'
    },
    {
      fecha: new Date('2026-06-15T15:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Corea del Sur')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Arabia Saudí')!.id,
      fase: 'GRUPOS',
      status: 'PENDIENTE'
    },
    {
      fecha: new Date('2026-06-15T18:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Marruecos')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Túnez')!.id,
      fase: 'GRUPOS',
      status: 'PENDIENTE'
    },
    {
      fecha: new Date('2026-06-15T21:00:00Z'),
      homeTeamId: createdTeams.find(t => t.name === 'Senegal')!.id,
      awayTeamId: createdTeams.find(t => t.name === 'Ghana')!.id,
      fase: 'GRUPOS',
      status: 'PENDIENTE'
    }
  ]

  const createdMatches = await Promise.all(
    matches.map(match => 
      prisma.match.create({
        data: match as any
      })
    )
  )

  console.log(`Created ${createdMatches.length} matches`)

  // Crear algunas predicciones de ejemplo para partidos finalizados
  console.log('Creating predictions...')
  const predictions = [
    {
      userId: createdUsers[0].id, // Juan
      matchId: createdMatches.find(m => 
        m.homeTeamId === createdTeams.find(t => t.name === 'Argentina')!.id &&
        m.awayTeamId === createdTeams.find(t => t.name === 'Arabia Saudí')!.id
      )!.id,
      homeGoalsPredicted: 2,
      awayGoalsPredicted: 0,
      points: 0, // Pronosticó victoria de Argentina pero perdió
      comentario: 'Argentina favorita clara'
    },
    {
      userId: createdUsers[0].id, // Juan
      matchId: createdMatches.find(m => 
        m.homeTeamId === createdTeams.find(t => t.name === 'Francia')!.id &&
        m.awayTeamId === createdTeams.find(t => t.name === 'Australia')!.id
      )!.id,
      homeGoalsPredicted: 3,
      awayGoalsPredicted: 1,
      points: 1, // Acertó el ganador pero no el resultado exacto
      comentario: 'Francia tiene mucha calidad'
    },
    {
      userId: createdUsers[0].id, // Juan
      matchId: createdMatches.find(m => 
        m.homeTeamId === createdTeams.find(t => t.name === 'Argentina')!.id &&
        m.awayTeamId === createdTeams.find(t => t.name === 'Francia')!.id &&
        m.fase === 'FINAL'
      )!.id,
      homeGoalsPredicted: 2,
      awayGoalsPredicted: 1,
      points: 1, // Acertó el ganador en la final (en penales)
      comentario: 'La final más esperada'
    },
    {
      userId: createdUsers[1].id, // María
      matchId: createdMatches.find(m => 
        m.homeTeamId === createdTeams.find(t => t.name === 'España')!.id &&
        m.awayTeamId === createdTeams.find(t => t.name === 'Costa Rica')!.id
      )!.id,
      homeGoalsPredicted: 4,
      awayGoalsPredicted: 0,
      points: 1, // Acertó el ganador
      comentario: 'España va a goleada'
    },
    {
      userId: createdUsers[1].id, // María
      matchId: createdMatches.find(m => 
        m.homeTeamId === createdTeams.find(t => t.name === 'Alemania')!.id &&
        m.awayTeamId === createdTeams.find(t => t.name === 'Japón')!.id
      )!.id,
      homeGoalsPredicted: 2,
      awayGoalsPredicted: 0,
      points: 0, // No acertó
      comentario: 'Alemania siempre es candidato'
    },
    {
      userId: createdUsers[2].id, // Carlos
      matchId: createdMatches.find(m => 
        m.homeTeamId === createdTeams.find(t => t.name === 'Marruecos')!.id &&
        m.awayTeamId === createdTeams.find(t => t.name === 'Portugal')!.id &&
        m.fase === 'CUARTOS'
      )!.id,
      homeGoalsPredicted: 1,
      awayGoalsPredicted: 0,
      points: 3, // Resultado exacto!
      comentario: 'Marruecos es la sorpresa del mundial'
    }
  ]

  const createdPredictions = await Promise.all(
    predictions.map(prediction => 
      prisma.prediction.create({
        data: prediction
      })
    )
  )

  console.log(`Created ${createdPredictions.length} predictions`)

  // Crear logros
  console.log('Creating achievements...')
  const achievements = [
    {
      name: 'Adivino',
      description: '5 resultados exactos consecutivos',
      icon: 'trophy'
    },
    {
      name: 'Especialista en Grupos',
      description: '80% de aciertos en fase de grupos',
      icon: 'star'
    },
    {
      name: 'Participante Activo',
      description: 'Pronosticó todos los partidos de la primera fecha',
      icon: 'target'
    }
  ]

  const createdAchievements = await Promise.all(
    achievements.map(achievement => 
      prisma.achievement.upsert({
        where: { name: achievement.name },
        update: {},
        create: achievement
      })
    )
  )

  console.log(`Created ${createdAchievements.length} achievements`)

  console.log('✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
