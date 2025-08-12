// Datos mock para la aplicación del prode

export const mockUser = {
  id: 'current-user',
  nombre: 'Juan',
  apellido: 'Pérez',
  email: 'juan.perez@empresa.com',
  area: 'Tecnología',
  puntosTotal: 1247,
  posicionRanking: 23
}

export const mockStats = {
  totalPredictions: 32,
  totalMatches: 104,
  accuracy: 67,
  exactMatches: 8,
  partialMatches: 13,
  currentStreak: 5
}

export const mockMatches = [
  {
    id: '1',
    fecha: '2026-06-12T15:00:00Z',
    equipoLocal: 'Argentina',
    equipoVisitante: 'Chile',
    golesLocal: null,
    golesVisitante: null,
    fase: 'grupos',
    estado: 'pendiente'
  },
  {
    id: '2',
    fecha: '2026-06-12T18:00:00Z',
    equipoLocal: 'Brasil',
    equipoVisitante: 'Colombia',
    golesLocal: null,
    golesVisitante: null,
    fase: 'grupos',
    estado: 'pendiente'
  },
  {
    id: '3',
    fecha: '2026-06-13T15:00:00Z',
    equipoLocal: 'España',
    equipoVisitante: 'Italia',
    golesLocal: null,
    golesVisitante: null,
    fase: 'grupos',
    estado: 'pendiente'
  },
  {
    id: '4',
    fecha: '2026-06-10T15:00:00Z',
    equipoLocal: 'Francia',
    equipoVisitante: 'Alemania',
    golesLocal: 2,
    golesVisitante: 1,
    fase: 'grupos',
    estado: 'finalizado'
  },
  {
    id: '5',
    fecha: '2026-06-11T18:00:00Z',
    equipoLocal: 'Inglaterra',
    equipoVisitante: 'Portugal',
    golesLocal: 1,
    golesVisitante: 1,
    fase: 'grupos',
    estado: 'finalizado'
  }
]

export const mockUpcomingMatches = mockMatches.filter(m => m.estado === 'pendiente')

export const mockRecentResults = [
  {
    id: '4',
    equipoLocal: 'Francia',
    equipoVisitante: 'Alemania',
    golesLocal: 2,
    golesVisitante: 1,
    puntos: 3,
    pronosticoLocal: 2,
    pronosticoVisitante: 1
  },
  {
    id: '5',
    equipoLocal: 'Inglaterra',
    equipoVisitante: 'Portugal',
    golesLocal: 1,
    golesVisitante: 1,
    puntos: 1,
    pronosticoLocal: 2,
    pronosticoVisitante: 1
  },
  {
    id: '6',
    equipoLocal: 'Holanda',
    equipoVisitante: 'Bélgica',
    golesLocal: 0,
    golesVisitante: 2,
    puntos: 0,
    pronosticoLocal: 1,
    pronosticoVisitante: 0
  }
]

export const mockRanking = [
  {
    id: '1',
    nombre: 'María',
    apellido: 'González',
    area: 'Marketing',
    puntos: 1456,
    posicion: 1,
    tendencia: 'up',
    cambio: '+3'
  },
  {
    id: '2',
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    area: 'Ventas',
    puntos: 1398,
    posicion: 2,
    tendencia: 'down',
    cambio: '-1'
  },
  {
    id: '3',
    nombre: 'Ana',
    apellido: 'Martínez',
    area: 'Tecnología',
    puntos: 1345,
    posicion: 3,
    tendencia: 'up',
    cambio: '+2'
  },
  {
    id: 'current-user',
    nombre: 'Juan',
    apellido: 'Pérez',
    area: 'Tecnología',
    puntos: 1247,
    posicion: 23,
    tendencia: 'up',
    cambio: '+2'
  },
  {
    id: '4',
    nombre: 'Laura',
    apellido: 'Fernández',
    area: 'Recursos Humanos',
    puntos: 1189,
    posicion: 24,
    tendencia: 'down',
    cambio: '-3'
  },
  {
    id: '5',
    nombre: 'Diego',
    apellido: 'López',
    area: 'Marketing',
    puntos: 1156,
    posicion: 25,
    tendencia: 'up',
    cambio: '+1'
  }
]

export const mockAreaRanking = [
  {
    area: 'Tecnología',
    participantes: 234,
    topUsers: [
      { id: '1', nombre: 'Ana', apellido: 'Martínez', puntos: 1345 },
      { id: '2', nombre: 'Juan', apellido: 'Pérez', puntos: 1247 },
      { id: '3', nombre: 'Roberto', apellido: 'Silva', puntos: 1198 }
    ]
  },
  {
    area: 'Marketing',
    participantes: 189,
    topUsers: [
      { id: '1', nombre: 'María', apellido: 'González', puntos: 1456 },
      { id: '2', nombre: 'Diego', apellido: 'López', puntos: 1156 },
      { id: '3', nombre: 'Sofía', apellido: 'Ruiz', puntos: 1089 }
    ]
  },
  {
    area: 'Ventas',
    participantes: 156,
    topUsers: [
      { id: '1', nombre: 'Carlos', apellido: 'Rodríguez', puntos: 1398 },
      { id: '2', nombre: 'Patricia', apellido: 'Morales', puntos: 1234 },
      { id: '3', nombre: 'Fernando', apellido: 'Castro', puntos: 1167 }
    ]
  }
]

export const mockUserHistory = [
  {
    id: '1',
    fecha: '2026-06-10T15:00:00Z',
    equipoLocal: 'Francia',
    equipoVisitante: 'Alemania',
    golesLocal: 2,
    golesVisitante: 1,
    pronosticoLocal: 2,
    pronosticoVisitante: 1,
    puntos: 3,
    comentario: 'Francia tiene mejor ataque'
  },
  {
    id: '2',
    fecha: '2026-06-11T18:00:00Z',
    equipoLocal: 'Inglaterra',
    equipoVisitante: 'Portugal',
    golesLocal: 1,
    golesVisitante: 1,
    pronosticoLocal: 2,
    pronosticoVisitante: 1,
    puntos: 1,
    comentario: 'Partido muy parejo'
  },
  {
    id: '3',
    fecha: '2026-06-09T21:00:00Z',
    equipoLocal: 'Holanda',
    equipoVisitante: 'Bélgica',
    golesLocal: 0,
    golesVisitante: 2,
    pronosticoLocal: 1,
    pronosticoVisitante: 0,
    puntos: 0,
    comentario: 'Holanda juega en casa'
  },
  {
    id: '4',
    fecha: '2026-06-08T15:00:00Z',
    equipoLocal: 'España',
    equipoVisitante: 'Croacia',
    golesLocal: 3,
    golesVisitante: 1,
    pronosticoLocal: 2,
    pronosticoVisitante: 0,
    puntos: 1,
    comentario: 'España domina el mediocampo'
  }
]

export const mockUserAchievements = [
  {
    id: '1',
    nombre: 'Adivino',
    descripcion: '5 resultados exactos consecutivos',
    fechaObtenido: '2026-06-10',
    icono: 'trophy'
  },
  {
    id: '2',
    nombre: 'Especialista en Grupos',
    descripcion: '80% de aciertos en fase de grupos',
    fechaObtenido: '2026-06-08',
    icono: 'star'
  },
  {
    id: '3',
    nombre: 'Participante Activo',
    descripcion: 'Pronosticó todos los partidos de la primera fecha',
    fechaObtenido: '2026-06-05',
    icono: 'target'
  }
]
