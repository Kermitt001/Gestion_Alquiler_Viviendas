// ============================================================
// DATOS MOCK — ERP Gestión de Viviendas Turísticas
// Empresa: ApartGroup Operaciones S.L.
// ============================================================

import { addDays, subDays, format } from 'date-fns';

const today = new Date(2026, 3, 20); // 20 Abril 2026

export const fmtDate = (d) => format(d, 'yyyy-MM-dd');

// ─────────────────────────────────────────────
// USUARIOS
// ─────────────────────────────────────────────
export const usuarios = [
  { id: 'u1', nombre: 'Laura Montoya', rol: 'operaciones', email: 'laura.m@apartgroup.es', telefono: '+34 612 345 678', estado: 'activo', avatar: 'LM' },
  { id: 'u2', nombre: 'Carlos Ruiz',   rol: 'operaciones', email: 'carlos.r@apartgroup.es', telefono: '+34 623 456 789', estado: 'activo', avatar: 'CR' },
  { id: 'u3', nombre: 'Marta Sánchez', rol: 'limpieza',    email: 'marta.s@apartgroup.es', telefono: '+34 634 567 890', estado: 'activo', avatar: 'MS' },
  { id: 'u4', nombre: 'Juan García',   rol: 'limpieza',    email: 'juan.g@apartgroup.es',  telefono: '+34 645 678 901', estado: 'activo', avatar: 'JG' },
  { id: 'u5', nombre: 'Rosa Fernández',rol: 'limpieza',    email: 'rosa.f@apartgroup.es',  telefono: '+34 656 789 012', estado: 'inactivo', avatar: 'RF' },
  { id: 'u6', nombre: 'Pedro Mora',    rol: 'mantenimiento',email:'pedro.m@apartgroup.es', telefono: '+34 667 890 123', estado: 'activo', avatar: 'PM' },
  { id: 'u7', nombre: 'Ana Vidal',     rol: 'mantenimiento',email:'ana.v@apartgroup.es',   telefono: '+34 678 901 234', estado: 'activo', avatar: 'AV' },
  { id: 'u8', nombre: 'Tomás Leal',    rol: 'admin',       email: 'tomas.l@apartgroup.es', telefono: '+34 689 012 345', estado: 'activo', avatar: 'TL' },
];

// ─────────────────────────────────────────────
// PROVEEDORES
// ─────────────────────────────────────────────
export const proveedores = [
  { id: 'prov1', nombre: 'CleanPro Suministros', servicio: 'Productos de limpieza', contacto: 'info@cleanpro.es', telefono: '+34 91 234 5678', tiempoRespuesta: '24h', ciudad: 'Madrid' },
  { id: 'prov2', nombre: 'TextilHome', servicio: 'Ropa de cama y toallas', contacto: 'pedidos@textilhome.es', telefono: '+34 93 345 6789', tiempoRespuesta: '48h', ciudad: 'Barcelona' },
  { id: 'prov3', nombre: 'AmenityBox', servicio: 'Amenities y consumibles', contacto: 'ventas@amenitybox.es', telefono: '+34 96 456 7890', tiempoRespuesta: '24h', ciudad: 'Valencia' },
  { id: 'prov4', nombre: 'TechFix Servicios', servicio: 'Reparaciones técnicas', contacto: 'servicio@techfix.es', telefono: '+34 95 567 8901', tiempoRespuesta: '4h urgente', ciudad: 'Sevilla' },
  { id: 'prov5', nombre: 'Fontaneros Rápidos', servicio: 'Fontanería', contacto: 'urgencias@fontrac.es', telefono: '+34 91 678 9012', tiempoRespuesta: '2h urgente', ciudad: 'Madrid' },
  { id: 'prov6', nombre: 'EcoKitchen', servicio: 'Productos cocina y menaje', contacto: 'pedidos@ecokitchen.es', telefono: '+34 94 789 0123', tiempoRespuesta: '48h', ciudad: 'Bilbao' },
];

// ─────────────────────────────────────────────
// SUMINISTROS
// ─────────────────────────────────────────────
export const suministros = [
  { id: 's1', nombre: 'Gel de ducha (250ml)', categoria: 'Amenities', stockActual: 12, stockMinimo: 30, unidad: 'unidades', proveedorId: 'prov3', estadoReposicion: 'stock-bajo', ultimoPedido: fmtDate(subDays(today, 5)) },
  { id: 's2', nombre: 'Champú (250ml)', categoria: 'Amenities', stockActual: 8, stockMinimo: 30, unidad: 'unidades', proveedorId: 'prov3', estadoReposicion: 'stock-bajo', ultimoPedido: fmtDate(subDays(today, 5)) },
  { id: 's3', nombre: 'Papel higiénico (6-pack)', categoria: 'Consumibles', stockActual: 45, stockMinimo: 20, unidad: 'packs', proveedorId: 'prov1', estadoReposicion: 'ok', ultimoPedido: fmtDate(subDays(today, 10)) },
  { id: 's4', nombre: 'Sábanas 2 plazas', categoria: 'Textil', stockActual: 18, stockMinimo: 30, unidad: 'juegos', proveedorId: 'prov2', estadoReposicion: 'pedido-solicitado', ultimoPedido: fmtDate(subDays(today, 2)) },
  { id: 's5', nombre: 'Sábanas 1 plaza', categoria: 'Textil', stockActual: 24, stockMinimo: 20, unidad: 'juegos', proveedorId: 'prov2', estadoReposicion: 'ok', ultimoPedido: fmtDate(subDays(today, 15)) },
  { id: 's6', nombre: 'Toallas baño', categoria: 'Textil', stockActual: 22, stockMinimo: 40, unidad: 'unidades', proveedorId: 'prov2', estadoReposicion: 'pendiente-recibir', ultimoPedido: fmtDate(subDays(today, 1)) },
  { id: 's7', nombre: 'Toallas mano', categoria: 'Textil', stockActual: 30, stockMinimo: 40, unidad: 'unidades', proveedorId: 'prov2', estadoReposicion: 'stock-bajo', ultimoPedido: null },
  { id: 's8', nombre: 'Detergente lavavajillas', categoria: 'Limpieza', stockActual: 6, stockMinimo: 15, unidad: 'litros', proveedorId: 'prov1', estadoReposicion: 'stock-bajo', ultimoPedido: null },
  { id: 's9', nombre: 'Multiusos limpiador spray', categoria: 'Limpieza', stockActual: 25, stockMinimo: 20, unidad: 'unidades', proveedorId: 'prov1', estadoReposicion: 'ok', ultimoPedido: fmtDate(subDays(today, 8)) },
  { id: 's10', nombre: 'Café monodosis', categoria: 'Cocina', stockActual: 80, stockMinimo: 60, unidad: 'unidades', proveedorId: 'prov6', estadoReposicion: 'ok', ultimoPedido: fmtDate(subDays(today, 3)) },
  { id: 's11', nombre: 'Aceite de oliva (250ml)', categoria: 'Cocina', stockActual: 4, stockMinimo: 10, unidad: 'botellas', proveedorId: 'prov6', estadoReposicion: 'stock-bajo', ultimoPedido: null },
  { id: 's12', nombre: 'Bombillas LED E27', categoria: 'Mantenimiento', stockActual: 12, stockMinimo: 8, unidad: 'unidades', proveedorId: 'prov4', estadoReposicion: 'ok', ultimoPedido: fmtDate(subDays(today, 20)) },
];

// ─────────────────────────────────────────────
// VIVIENDAS
// ─────────────────────────────────────────────
export const viviendas = [
  {
    id: 'v1',
    nombre: 'Ático Sol Mayor',
    direccion: 'C/ Sol, 14, 3ºA',
    ciudad: 'Madrid',
    barrio: 'La Latina',
    capacidad: 4,
    habitaciones: 2,
    banos: 1,
    estado: 'con-incidencia',
    observaciones: 'Caldera con problemas de presión. Técnico pendiente.',
    proximaEntrada: fmtDate(addDays(today, 1)),
    proximaSalida: null,
    propietario: 'Inmobiliaria Solares S.L.',
    imagen: null,
  },
  {
    id: 'v2',
    nombre: 'Loft Gran Vía',
    direccion: 'Gran Vía, 55, 2ºD',
    ciudad: 'Madrid',
    barrio: 'Centro',
    capacidad: 2,
    habitaciones: 1,
    banos: 1,
    estado: 'lista',
    observaciones: 'Recién reformada. Todo en perfecto estado.',
    proximaEntrada: fmtDate(addDays(today, 3)),
    proximaSalida: fmtDate(today),
    propietario: 'Particular R. Blanco',
    imagen: null,
  },
  {
    id: 'v3',
    nombre: 'Villa Mediterránea',
    direccion: 'Urb. Los Pinos, 8',
    ciudad: 'Valencia',
    barrio: 'Playa Patacona',
    capacidad: 8,
    habitaciones: 4,
    banos: 3,
    estado: 'pendiente-preparacion',
    observaciones: 'Piscina requiere tratamiento antes del check-in.',
    proximaEntrada: fmtDate(addDays(today, 2)),
    proximaSalida: fmtDate(subDays(today, 1)),
    propietario: 'Finca Mar S.A.',
    imagen: null,
  },
  {
    id: 'v4',
    nombre: 'Estudio Gótico',
    direccion: 'C/ Ferran, 23, 1ºB',
    ciudad: 'Barcelona',
    barrio: 'Barrio Gótico',
    capacidad: 2,
    habitaciones: 1,
    banos: 1,
    estado: 'en-preparacion',
    observaciones: 'Llaves en conserjería del edificio.',
    proximaEntrada: fmtDate(today),
    proximaSalida: fmtDate(subDays(today, 0)),
    propietario: 'T. Aranda Inversiones',
    imagen: null,
  },
  {
    id: 'v5',
    nombre: 'Apartamento Ramblas Sur',
    direccion: 'Las Ramblas, 102, 4ºC',
    ciudad: 'Barcelona',
    barrio: 'El Raval',
    capacidad: 4,
    habitaciones: 2,
    banos: 1,
    estado: 'limpieza-asignada',
    observaciones: 'Acceso por portero automático. Código: 1247#',
    proximaEntrada: fmtDate(addDays(today, 1)),
    proximaSalida: fmtDate(today),
    propietario: 'Pisos Barcelona S.L.',
    imagen: null,
  },
  {
    id: 'v6',
    nombre: 'Casa Triana',
    direccion: 'C/ Betis, 45',
    ciudad: 'Sevilla',
    barrio: 'Triana',
    capacidad: 6,
    habitaciones: 3,
    banos: 2,
    estado: 'lista',
    observaciones: 'Terraza con vistas al río. Sin incidencias.',
    proximaEntrada: fmtDate(addDays(today, 5)),
    proximaSalida: null,
    propietario: 'Sur Homes S.L.',
    imagen: null,
  },
  {
    id: 'v7',
    nombre: 'Suite Playa Norte',
    direccion: 'Av. Mediterráneo, 7, B3',
    ciudad: 'Valencia',
    barrio: 'Malvarrosa',
    capacidad: 2,
    habitaciones: 1,
    banos: 1,
    estado: 'lista',
    observaciones: 'Primera línea de playa.',
    proximaEntrada: fmtDate(addDays(today, 7)),
    proximaSalida: null,
    propietario: 'Marina Invest S.L.',
    imagen: null,
  },
  {
    id: 'v8',
    nombre: 'Chalet Retiro',
    direccion: 'C/ O\'Donnell, 3',
    ciudad: 'Madrid',
    barrio: 'Retiro',
    capacidad: 6,
    habitaciones: 3,
    banos: 2,
    estado: 'pendiente-preparacion',
    observaciones: 'Jardín privado. Requiere revisión mobiliario exterior.',
    proximaEntrada: fmtDate(addDays(today, 1)),
    proximaSalida: fmtDate(subDays(today, 1)),
    propietario: 'Grupo Parque S.A.',
    imagen: null,
  },
];

// ─────────────────────────────────────────────
// RESERVAS
// ─────────────────────────────────────────────
export const reservas = [
  // Salidas HOY / ayer
  { id: 'r01', viviendaId: 'v2', huesped: 'Michael Thompson', numPersonas: 2, checkIn: fmtDate(subDays(today, 5)), checkOut: fmtDate(today), plataforma: 'airbnb', estado: 'activa', notas: 'Late check-out solicitado hasta 12:00h', precio: 380 },
  { id: 'r02', viviendaId: 'v5', huesped: 'Ana Dupont', numPersonas: 3, checkIn: fmtDate(subDays(today, 3)), checkOut: fmtDate(today), plataforma: 'booking', estado: 'activa', notas: '', precio: 420 },
  { id: 'r03', viviendaId: 'v4', huesped: 'Roberto Ferrara', numPersonas: 2, checkIn: fmtDate(subDays(today, 2)), checkOut: fmtDate(today), plataforma: 'directo', estado: 'activa', notas: 'Llegada a las 15:00h', precio: 280 },
  // Entradas MUY PRÓXIMAS (hoy / mañana)
  { id: 'r04', viviendaId: 'v4', huesped: 'Sophie Lambert', numPersonas: 2, checkIn: fmtDate(today), checkOut: fmtDate(addDays(today, 4)), plataforma: 'booking', estado: 'confirmada', notas: 'Alergias: ninguna', precio: 520 },
  { id: 'r05', viviendaId: 'v1', huesped: 'James & Patricia Wilson', numPersonas: 4, checkIn: fmtDate(addDays(today, 1)), checkOut: fmtDate(addDays(today, 6)), plataforma: 'airbnb', estado: 'confirmada', notas: 'Traen mascota pequeña', precio: 750 },
  { id: 'r06', viviendaId: 'v5', huesped: 'Fatima El Masri', numPersonas: 2, checkIn: fmtDate(addDays(today, 1)), checkOut: fmtDate(addDays(today, 8)), plataforma: 'vrbo', estado: 'confirmada', notas: '', precio: 620 },
  { id: 'r07', viviendaId: 'v8', huesped: 'Alejandro Torres', numPersonas: 5, checkIn: fmtDate(addDays(today, 1)), checkOut: fmtDate(addDays(today, 3)), plataforma: 'directo', estado: 'confirmada', notas: 'Celebración aniversario', precio: 480 },
  { id: 'r08', viviendaId: 'v3', huesped: 'Gemma Richardson', numPersonas: 6, checkIn: fmtDate(addDays(today, 2)), checkOut: fmtDate(addDays(today, 9)), plataforma: 'airbnb', estado: 'confirmada', notas: 'Grupo familiar. Bebé de 1 año.', precio: 1250 },
  // Futuras
  { id: 'r09', viviendaId: 'v6', huesped: 'Carlos Mendez', numPersonas: 4, checkIn: fmtDate(addDays(today, 5)), checkOut: fmtDate(addDays(today, 12)), plataforma: 'booking', estado: 'confirmada', notas: '', precio: 890 },
  { id: 'r10', viviendaId: 'v2', huesped: 'Elena Roth', numPersonas: 1, checkIn: fmtDate(addDays(today, 3)), checkOut: fmtDate(addDays(today, 7)), plataforma: 'airbnb', estado: 'confirmada', notas: 'Check-in tardío ~22:00h', precio: 320 },
  { id: 'r11', viviendaId: 'v7', huesped: 'David & Nuria Kim', numPersonas: 2, checkIn: fmtDate(addDays(today, 7)), checkOut: fmtDate(addDays(today, 14)), plataforma: 'vrbo', estado: 'confirmada', notas: '', precio: 980 },
  // Pasadas / completadas
  { id: 'r12', viviendaId: 'v1', huesped: 'Luis Pérez', numPersonas: 2, checkIn: fmtDate(subDays(today, 14)), checkOut: fmtDate(subDays(today, 7)), plataforma: 'airbnb', estado: 'completada', notas: '', precio: 560 },
  { id: 'r13', viviendaId: 'v3', huesped: 'Marina Costa', numPersonas: 5, checkIn: fmtDate(subDays(today, 10)), checkOut: fmtDate(subDays(today, 1)), plataforma: 'booking', estado: 'completada', notas: '', precio: 1100 },
  { id: 'r14', viviendaId: 'v6', huesped: 'Ahmed Hassan', numPersonas: 3, checkIn: fmtDate(subDays(today, 8)), checkOut: fmtDate(subDays(today, 3)), plataforma: 'directo', estado: 'completada', notas: '', precio: 670 },
  // Cancelada
  { id: 'r15', viviendaId: 'v7', huesped: 'Patricia López', numPersonas: 2, checkIn: fmtDate(addDays(today, 10)), checkOut: fmtDate(addDays(today, 14)), plataforma: 'airbnb', estado: 'cancelada', notas: 'Cancelación por viajero', precio: 480 },
];

// ─────────────────────────────────────────────
// TAREAS
// ─────────────────────────────────────────────
export const tareasIniciales = [
  // Hoy — URGENTES
  { id: 't1', tipo: 'limpieza', viviendaId: 'v4', responsableId: 'u3', fecha: fmtDate(today), horaLimite: '12:00', prioridad: 'urgente', estado: 'en-curso', notas: 'Salida a las 11h. Entrada nueva a las 15h. Tiempo ajustado.' },
  { id: 't2', tipo: 'limpieza', viviendaId: 'v5', responsableId: 'u4', fecha: fmtDate(today), horaLimite: '13:00', prioridad: 'urgente', estado: 'pendiente', notas: 'Check-out previsto 12h. Entrada mañana 10h.' },
  { id: 't3', tipo: 'revision', viviendaId: 'v2', responsableId: 'u3', fecha: fmtDate(today), horaLimite: '14:00', prioridad: 'alta', estado: 'completada', notas: 'Revisión post salida completada. Todo OK.' },
  { id: 't4', tipo: 'preparacion', viviendaId: 'v4', responsableId: 'u4', fecha: fmtDate(today), horaLimite: '14:30', prioridad: 'urgente', estado: 'pendiente', notas: 'Reponer amenities y comprobar electrodomésticos.' },
  // Mañana
  { id: 't5', tipo: 'limpieza', viviendaId: 'v1', responsableId: 'u3', fecha: fmtDate(addDays(today, 1)), horaLimite: '10:00', prioridad: 'urgente', estado: 'pendiente', notas: 'Incidencia caldera pendiente. Coordinar con mantenimiento.' },
  { id: 't6', tipo: 'reposicion', viviendaId: 'v1', responsableId: 'u4', fecha: fmtDate(addDays(today, 1)), horaLimite: '11:00', prioridad: 'alta', estado: 'pendiente', notas: 'Reponer stock amenities y textil.' },
  { id: 't7', tipo: 'limpieza', viviendaId: 'v8', responsableId: 'u4', fecha: fmtDate(addDays(today, 1)), horaLimite: '09:00', prioridad: 'urgente', estado: 'pendiente', notas: 'Entrada a las 14h.' },
  { id: 't8', tipo: 'preparacion', viviendaId: 'v8', responsableId: 'u3', fecha: fmtDate(addDays(today, 1)), horaLimite: '12:00', prioridad: 'alta', estado: 'pendiente', notas: 'Revisar jardín y mobiliario exterior.' },
  // Próximos días
  { id: 't9', tipo: 'limpieza', viviendaId: 'v3', responsableId: 'u3', fecha: fmtDate(addDays(today, 2)), horaLimite: '10:00', prioridad: 'alta', estado: 'pendiente', notas: 'Villa grande. Planificar 4 horas.' },
  { id: 't10', tipo: 'revision', viviendaId: 'v3', responsableId: 'u6', fecha: fmtDate(addDays(today, 2)), horaLimite: '12:00', prioridad: 'alta', estado: 'pendiente', notas: 'Revisión piscina y sistemas.' },
  { id: 't11', tipo: 'mantenimiento', viviendaId: 'v1', responsableId: 'u6', fecha: fmtDate(today), horaLimite: '15:00', prioridad: 'urgente', estado: 'en-curso', notas: 'Reparación caldera. Piezas en camino.' },
  { id: 't12', tipo: 'limpieza', viviendaId: 'v5', responsableId: 'u4', fecha: fmtDate(today), horaLimite: '16:00', prioridad: 'media', estado: 'retrasada', notas: 'Limpieza de zonas comunes. Se pasó la hora límite.' },
  // Completadas recientes
  { id: 't13', tipo: 'limpieza', viviendaId: 'v6', responsableId: 'u3', fecha: fmtDate(subDays(today, 2)), horaLimite: '12:00', prioridad: 'alta', estado: 'completada', notas: '' },
  { id: 't14', tipo: 'revision', viviendaId: 'v7', responsableId: 'u4', fecha: fmtDate(subDays(today, 1)), horaLimite: '11:00', prioridad: 'media', estado: 'completada', notas: 'Todo OK.' },
  { id: 't15', tipo: 'reposicion', viviendaId: 'v6', responsableId: 'u3', fecha: fmtDate(subDays(today, 2)), horaLimite: '14:00', prioridad: 'baja', estado: 'completada', notas: 'Reposición estándar.' },
];

// ─────────────────────────────────────────────
// INCIDENCIAS
// ─────────────────────────────────────────────
export const incidenciasIniciales = [
  {
    id: 'i1',
    viviendaId: 'v1',
    tipo: 'avería',
    descripcion: 'Caldera de gas con caída de presión. No calienta agua correctamente. Huéspedes se quejaron.',
    criticidad: 'critica',
    estado: 'en-proceso',
    fecha: fmtDate(subDays(today, 1)),
    responsableId: 'u6',
    reportadoPor: 'u3',
    resolucion: null,
    evidencia: 'Foto caldera subida al sistema',
  },
  {
    id: 'i2',
    viviendaId: 'v3',
    tipo: 'instalación',
    descripcion: 'Bomba de la piscina no arranca. Posible cortocircuito en el cuadro eléctrico.',
    criticidad: 'alta',
    estado: 'en-revision',
    fecha: fmtDate(subDays(today, 2)),
    responsableId: 'u6',
    reportadoPor: 'u4',
    resolucion: null,
    evidencia: null,
  },
  {
    id: 'i3',
    viviendaId: 'v5',
    tipo: 'limpieza',
    descripcion: 'Manchas difíciles en tapicería del sofá tras la última estancia. Requiere limpiador especializado.',
    criticidad: 'media',
    estado: 'abierta',
    fecha: fmtDate(today),
    responsableId: null,
    reportadoPor: 'u4',
    resolucion: null,
    evidencia: null,
  },
  {
    id: 'i4',
    viviendaId: 'v8',
    tipo: 'desperfecto',
    descripcion: 'Silla de jardín rota. Pata delantera derecha partida. Riesgo de caída.',
    criticidad: 'media',
    estado: 'abierta',
    fecha: fmtDate(today),
    responsableId: null,
    reportadoPor: 'u3',
    resolucion: null,
    evidencia: null,
  },
  {
    id: 'i5',
    viviendaId: 'v2',
    tipo: 'fontanería',
    descripcion: 'Grifo del baño con pequeña fuga. Se dejó paño absorbente. No afecta al uso.',
    criticidad: 'baja',
    estado: 'en-revision',
    fecha: fmtDate(subDays(today, 3)),
    responsableId: 'u7',
    reportadoPor: 'u3',
    resolucion: null,
    evidencia: null,
  },
  {
    id: 'i6',
    viviendaId: 'v4',
    tipo: 'electrodoméstico',
    descripcion: 'Microondas no enciende. Probado con otro enchufe. Parece defecto del aparato.',
    criticidad: 'media',
    estado: 'resuelta',
    fecha: fmtDate(subDays(today, 7)),
    responsableId: 'u7',
    reportadoPor: 'u4',
    resolucion: 'Sustituido por microondas nuevo de almacén.',
    evidencia: null,
  },
  {
    id: 'i7',
    viviendaId: 'v6',
    tipo: 'limpieza',
    descripcion: 'Horno con restos de grasa considerable. Requirió limpieza profunda extra.',
    criticidad: 'baja',
    estado: 'resuelta',
    fecha: fmtDate(subDays(today, 5)),
    responsableId: 'u3',
    reportadoPor: 'u3',
    resolucion: 'Limpiado con productos especializados. OK.',
    evidencia: null,
  },
  {
    id: 'i8',
    viviendaId: 'v1',
    tipo: 'seguridad',
    descripcion: 'Cerradura puerta principal con dificultad para abrir desde exterior. Se atasca con llave.',
    criticidad: 'alta',
    estado: 'abierta',
    fecha: fmtDate(subDays(today, 0)),
    responsableId: 'u6',
    reportadoPor: 'u3',
    resolucion: null,
    evidencia: null,
  },
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
export const getVivienda = (id) => viviendas.find(v => v.id === id);
export const getUsuario = (id) => usuarios.find(u => u.id === id);
export const getProveedor = (id) => proveedores.find(p => p.id === id);

export const PLATAFORMAS = ['airbnb', 'booking', 'vrbo', 'directo'];
export const ESTADOS_VIVIENDA = ['lista', 'pendiente-preparacion', 'limpieza-asignada', 'en-preparacion', 'con-incidencia'];
export const ESTADOS_TAREA = ['pendiente', 'en-curso', 'completada', 'retrasada'];
export const TIPOS_TAREA = ['limpieza', 'revision', 'reposicion', 'preparacion', 'mantenimiento'];
export const CRITICIDADES = ['critica', 'alta', 'media', 'baja'];
export const ESTADOS_INCIDENCIA = ['abierta', 'en-revision', 'en-proceso', 'resuelta', 'critica'];
export const CIUDADES = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla'];

export { today };
