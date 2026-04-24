// Módulo de Tareas Operativas — Con cambio de estado inline
import { useState } from 'react';
import { Search, CheckCircle, Filter, Clock } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { Badge } from '../../components/ui/Badge';
import Breadcrumb from '../../components/shared/Breadcrumb';
import { fmtDate, today } from '../../data/mockData';

const TIPO_ICONS = {
  limpieza: '🧹', revision: '🔍', reposicion: '📦', preparacion: '🛏', mantenimiento: '🔧',
};

const NEXT_ESTADO = {
  'pendiente': 'en-curso',
  'en-curso': 'completada',
  'retrasada': 'en-curso',
};

export default function TareasList() {
  const { tareas, viviendas, usuarios, updateTareaEstado, currentRole } = useAppStore();

  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroPrioridad, setFiltroPrioridad] = useState('');
  const [filtroResponsable, setFiltroResponsable] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const todayStr = fmtDate(today);

  const getVivienda = (id) => viviendas.find(v => v.id === id);
  const getResponsable = (id) => usuarios.find(u => u.id === id)?.nombre || '—';

  // Si el rol es limpieza, filtrar solo sus tareas
  const currentUser = usuarios.find(u => u.rol === currentRole && u.estado === 'activo') || usuarios[0];

  const tareasFiltradas = tareas.filter(t => {
    // Filtro por rol
    if (currentRole === 'limpieza' && t.responsableId !== currentUser?.id) {
      const limpiezaUsers = usuarios.filter(u => u.rol === 'limpieza').map(u => u.id);
      if (!limpiezaUsers.includes(t.responsableId)) return false;
      if (t.tipo === 'mantenimiento') return false;
    }
    if (currentRole === 'mantenimiento' && t.tipo !== 'mantenimiento' && t.tipo !== 'revision') return false;

    const matchBusq = !busqueda || getVivienda(t.viviendaId)?.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchEstado = !filtroEstado || t.estado === filtroEstado;
    const matchTipo = !filtroTipo || t.tipo === filtroTipo;
    const matchPrioridad = !filtroPrioridad || t.prioridad === filtroPrioridad;
    const matchResp = !filtroResponsable || t.responsableId === filtroResponsable;
    const matchFecha = !filtroFecha ||
      (filtroFecha === 'hoy' && t.fecha === todayStr) ||
      (filtroFecha === 'manana' && t.fecha === fmtDate(new Date(today.getTime() + 86400000)));
    return matchBusq && matchEstado && matchTipo && matchPrioridad && matchResp && matchFecha;
  }).sort((a, b) => {
    // Ordenar: urgente > alta > media > baja, luego por fecha
    const prio = { urgente: 0, alta: 1, media: 2, baja: 3 };
    if (prio[a.prioridad] !== prio[b.prioridad]) return prio[a.prioridad] - prio[b.prioridad];
    return a.fecha.localeCompare(b.fecha);
  });

  // KPIs
  const kpis = {
    pendientesHoy: tareas.filter(t => t.fecha === todayStr && t.estado === 'pendiente').length,
    enCurso: tareas.filter(t => t.estado === 'en-curso').length,
    retrasadas: tareas.filter(t => t.estado === 'retrasada').length,
    completadasHoy: tareas.filter(t => t.fecha === todayStr && t.estado === 'completada').length,
  };

  const canChangeEstado = (tarea) => {
    if (currentRole === 'admin' || currentRole === 'operaciones') return true;
    if (currentRole === 'limpieza' && ['limpieza', 'reposicion', 'preparacion'].includes(tarea.tipo)) return true;
    if (currentRole === 'mantenimiento' && ['mantenimiento', 'revision'].includes(tarea.tipo)) return true;
    return false;
  };

  const prioridadColor = { urgente: '#ef4444', alta: '#f97316', media: '#f59e0b', baja: '#22c55e' };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/' }, { label: 'Tareas Operativas' }]} />

      <div className="page-header">
        <div>
          <h1 className="page-title">Tareas Operativas</h1>
          <p className="page-subtitle">Gestión y seguimiento de tareas · {tareasFiltradas.length} mostradas</p>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { key: 'hoy', label: 'Hoy pendientes', count: kpis.pendientesHoy, color: '#f59e0b' },
          { key: '', label: 'En curso ahora', count: kpis.enCurso, color: '#60a5fa' },
          { key: '', label: 'Retrasadas', count: kpis.retrasadas, color: '#ef4444' },
          { key: 'hoy', label: 'Completadas hoy', count: kpis.completadasHoy, color: '#22c55e' },
        ].map((k, i) => (
          <div key={i} className="stat-pill">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: k.color }} />
            <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{k.count}</span>
            <span>{k.label}</span>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="filters-row">
        <div style={{ position: 'relative', flex: 1, maxWidth: 240 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input className="erp-input" style={{ paddingLeft: 30, width: '100%' }} placeholder="Buscar por vivienda..."
            value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>
        <select className="erp-select" value={filtroFecha} onChange={e => setFiltroFecha(e.target.value)}>
          <option value="">Todas las fechas</option>
          <option value="hoy">Hoy</option>
          <option value="manana">Mañana</option>
        </select>
        <select className="erp-select" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="en-curso">En curso</option>
          <option value="completada">Completada</option>
          <option value="retrasada">Retrasada</option>
        </select>
        <select className="erp-select" value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
          <option value="">Todos los tipos</option>
          <option value="limpieza">Limpieza</option>
          <option value="revision">Revisión</option>
          <option value="reposicion">Reposición</option>
          <option value="preparacion">Preparación</option>
          <option value="mantenimiento">Mantenimiento</option>
        </select>
        <select className="erp-select" value={filtroPrioridad} onChange={e => setFiltroPrioridad(e.target.value)}>
          <option value="">Todas las prioridades</option>
          <option value="urgente">Urgente</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
        <select className="erp-select" value={filtroResponsable} onChange={e => setFiltroResponsable(e.target.value)}>
          <option value="">Todos los responsables</option>
          {usuarios.filter(u => ['limpieza', 'mantenimiento'].includes(u.rol)).map(u => (
            <option key={u.id} value={u.id}>{u.nombre}</option>
          ))}
        </select>
      </div>

      {/* Tabla de tareas */}
      <div className="table-wrapper">
        <table className="erp-table">
          <thead>
            <tr>
              <th>Prior.</th>
              <th>Tipo</th>
              <th>Vivienda</th>
              <th>Fecha</th>
              <th>Hora lím.</th>
              <th>Responsable</th>
              <th>Estado</th>
              <th>Notas</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {tareasFiltradas.map(t => {
              const v = getVivienda(t.viviendaId);
              const nextEstado = NEXT_ESTADO[t.estado];
              const puedeCambiar = canChangeEstado(t) && nextEstado;
              return (
                <tr key={t.id} style={t.estado === 'retrasada' ? { background: '#2d1515' } : {}}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: prioridadColor[t.prioridad] || '#334155', flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: prioridadColor[t.prioridad], fontWeight: 600, textTransform: 'capitalize' }}>
                        {t.prioridad}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: 14 }}>{TIPO_ICONS[t.tipo]}</span>{' '}
                    <span style={{ fontSize: 12 }}>{t.tipo.charAt(0).toUpperCase() + t.tipo.slice(1)}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#e2e8f0' }}>{v?.nombre}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{v?.ciudad}</div>
                  </td>
                  <td style={{ fontSize: 12, color: t.fecha === todayStr ? '#60a5fa' : '#94a3b8', fontWeight: t.fecha === todayStr ? 700 : 400 }}>
                    {t.fecha === todayStr ? 'HOY' : t.fecha}
                  </td>
                  <td style={{ fontSize: 12, color: t.estado === 'retrasada' ? '#f87171' : '#94a3b8', fontWeight: t.estado === 'retrasada' ? 700 : 400 }}>
                    <Clock size={11} style={{ marginRight: 3 }} />{t.horaLimite}
                  </td>
                  <td style={{ fontSize: 12 }}>{getResponsable(t.responsableId)}</td>
                  <td><Badge value={t.estado} /></td>
                  <td style={{ fontSize: 11, color: '#64748b', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.notas || '—'}
                  </td>
                  <td>
                    {puedeCambiar ? (
                      <button
                        className={`btn btn-sm ${nextEstado === 'completada' ? 'btn-success' : 'btn-secondary'}`}
                        onClick={() => updateTareaEstado(t.id, nextEstado)}
                        title={`Cambiar a: ${nextEstado}`}
                      >
                        {nextEstado === 'en-curso' ? '▶ Iniciar' : '✓ Completar'}
                      </button>
                    ) : (
                      t.estado === 'completada' ? (
                        <span style={{ fontSize: 11, color: '#4ade80' }}>✓ Completada</span>
                      ) : (
                        <span style={{ fontSize: 11, color: '#475569' }}>—</span>
                      )
                    )}
                  </td>
                </tr>
              );
            })}
            {tareasFiltradas.length === 0 && (
              <tr><td colSpan={9} style={{ textAlign: 'center', color: '#64748b', padding: 32 }}>
                No hay tareas con los filtros aplicados
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Nota sobre rol */}
      {currentRole !== 'admin' && currentRole !== 'operaciones' && (
        <div style={{ marginTop: 12, padding: 10, background: '#162032', border: '1px solid #1e3a5f', borderRadius: 6, fontSize: 12, color: '#64748b' }}>
          ℹ Vista filtrada por rol: <strong style={{ color: '#60a5fa' }}>{currentRole}</strong>. Cambia el rol en la topbar para ver todas las tareas.
        </div>
      )}
    </div>
  );
}
