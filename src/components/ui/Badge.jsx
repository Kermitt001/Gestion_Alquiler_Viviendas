// ── Badge de estado — mapea valores a clases CSS del sistema ──
export const BADGE_MAP = {
  // Estado vivienda
  'lista': { clase: 'badge-lista', label: 'Lista' },
  'pendiente-preparacion': { clase: 'badge-pendiente-prep', label: 'Pendiente preparación' },
  'limpieza-asignada': { clase: 'badge-limpieza', label: 'Limpieza asignada' },
  'en-preparacion': { clase: 'badge-preparacion', label: 'En preparación' },
  'con-incidencia': { clase: 'badge-incidencia', label: 'Con incidencia' },
  // Estado tarea
  'pendiente': { clase: 'badge-tarea-pendiente', label: 'Pendiente' },
  'en-curso': { clase: 'badge-tarea-en-curso', label: 'En curso' },
  'completada': { clase: 'badge-tarea-completada', label: 'Completada' },
  'retrasada': { clase: 'badge-tarea-retrasada', label: 'Retrasada' },
  // Criticidad
  'critica': { clase: 'badge-critica', label: 'Crítica' },
  'alta': { clase: 'badge-alta', label: 'Alta' },
  'media': { clase: 'badge-media', label: 'Media' },
  'baja': { clase: 'badge-baja', label: 'Baja' },
  // Estado incidencia
  'abierta': { clase: 'badge-abierta', label: 'Abierta' },
  'en-revision': { clase: 'badge-en-revision', label: 'En revisión' },
  'en-proceso': { clase: 'badge-en-proceso', label: 'En proceso' },
  'resuelta': { clase: 'badge-resuelta', label: 'Resuelta' },
  // Stock
  'ok': { clase: 'badge-stock-ok', label: 'OK' },
  'stock-bajo': { clase: 'badge-stock-bajo', label: 'Stock bajo' },
  'pedido-solicitado': { clase: 'badge-pedido', label: 'Pedido solicitado' },
  'pendiente-recibir': { clase: 'badge-pendiente-recibir', label: 'Pendiente recibir' },
  // Plataforma
  'airbnb': { clase: 'badge-airbnb', label: 'Airbnb' },
  'booking': { clase: 'badge-booking', label: 'Booking' },
  'directo': { clase: 'badge-directo', label: 'Directo' },
  'vrbo': { clase: 'badge-vrbo', label: 'VRBO' },
  // Reserva
  'activa': { clase: 'badge-tarea-en-curso', label: 'Activa' },
  'confirmada': { clase: 'badge-preparacion', label: 'Confirmada' },
  'cancelada': { clase: 'badge-incidencia', label: 'Cancelada' },
  // Rol
  'operaciones': { clase: 'badge-rol-operaciones', label: 'Operaciones' },
  'limpieza': { clase: 'badge-rol-limpieza', label: 'Limpieza' },
  'mantenimiento': { clase: 'badge-rol-mantenimiento', label: 'Mantenimiento' },
  'admin': { clase: 'badge-rol-admin', label: 'Admin' },
  // Usuario estado
  'activo': { clase: 'badge-stock-ok', label: 'Activo' },
  'inactivo': { clase: 'badge-tarea-pendiente', label: 'Inactivo' },
  // Prioridad tarea
  'urgente': { clase: 'badge-critica', label: 'Urgente' },
  // Tipo tarea
  'limpieza_t': { clase: 'badge-rol-limpieza', label: 'Limpieza' },
  'revision': { clase: 'badge-preparacion', label: 'Revisión' },
  'reposicion': { clase: 'badge-tarea-pendiente', label: 'Reposición' },
  'preparacion': { clase: 'badge-rol-operaciones', label: 'Preparación' },
  'mantenimiento_t': { clase: 'badge-rol-mantenimiento', label: 'Mantenimiento' },
};

export function Badge({ value, customLabel }) {
  const map = BADGE_MAP[value] || { clase: 'badge-tarea-pendiente', label: value };
  return (
    <span className={`badge ${map.clase}`}>
      {customLabel || map.label}
    </span>
  );
}

// Semáforo de criticidad
export function Semaforo({ criticidad }) {
  const colorMap = {
    critica: 'semaforo-rojo',
    alta: 'semaforo-naranja',
    media: 'semaforo-amarillo',
    baja: 'semaforo-verde',
  };
  return <span className={`semaforo ${colorMap[criticidad] || 'semaforo-verde'}`} />;
}

export default Badge;
