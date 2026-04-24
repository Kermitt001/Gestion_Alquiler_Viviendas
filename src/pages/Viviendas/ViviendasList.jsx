// Módulo de Viviendas — Listado con filtros y cards
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Users, Home, ChevronRight } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { Badge } from '../../components/ui/Badge';
import Breadcrumb from '../../components/shared/Breadcrumb';

const ESTADO_OPTIONS = ['', 'lista', 'pendiente-preparacion', 'limpieza-asignada', 'en-preparacion', 'con-incidencia'];
const CIUDAD_OPTIONS = ['', 'Madrid', 'Barcelona', 'Valencia', 'Sevilla'];

const ESTADO_LABELS = {
  'lista': 'Lista',
  'pendiente-preparacion': 'Pendiente preparación',
  'limpieza-asignada': 'Limpieza asignada',
  'en-preparacion': 'En preparación',
  'con-incidencia': 'Con incidencia',
};

export default function ViviendasList() {
  const navigate = useNavigate();
  const { viviendas, incidencias, tareas } = useAppStore();

  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroCiudad, setFiltroCiudad] = useState('');
  const [vista, setVista] = useState('cards'); // 'cards' | 'tabla'

  const viviendasFiltradas = viviendas.filter(v => {
    const matchBusq = !busqueda || v.nombre.toLowerCase().includes(busqueda.toLowerCase()) || v.direccion.toLowerCase().includes(busqueda.toLowerCase());
    const matchEstado = !filtroEstado || v.estado === filtroEstado;
    const matchCiudad = !filtroCiudad || v.ciudad === filtroCiudad;
    return matchBusq && matchEstado && matchCiudad;
  });

  const getIncidenciasAbiertas = (id) => incidencias.filter(i => i.viviendaId === id && i.estado !== 'resuelta').length;
  const getTareasPendientes = (id) => tareas.filter(t => t.viviendaId === id && t.estado !== 'completada').length;

  // Colores de estado para borde izquierdo de cards
  const borderColorMap = {
    'lista': '#22c55e',
    'pendiente-preparacion': '#a78bfa',
    'limpieza-asignada': '#fb923c',
    'en-preparacion': '#60a5fa',
    'con-incidencia': '#ef4444',
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/' }, { label: 'Viviendas' }]} />

      <div className="page-header">
        <div>
          <h1 className="page-title">Viviendas</h1>
          <p className="page-subtitle">{viviendas.length} propiedades gestionadas · {viviendasFiltradas.length} mostradas</p>
        </div>
      </div>

      {/* KPIs rápidos */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        {Object.entries(ESTADO_LABELS).map(([key, label]) => {
          const count = viviendas.filter(v => v.estado === key).length;
          return (
            <div key={key} className="stat-pill" style={{ cursor: 'pointer' }} onClick={() => setFiltroEstado(filtroEstado === key ? '' : key)}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: borderColorMap[key], flexShrink: 0 }} />
              <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{count}</span>
              <span>{label}</span>
            </div>
          );
        })}
      </div>

      {/* Filtros */}
      <div className="filters-row">
        <div style={{ position: 'relative', flex: 1, maxWidth: 280 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input
            className="erp-input"
            style={{ paddingLeft: 30, width: '100%' }}
            placeholder="Buscar por nombre o dirección..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
        <select className="erp-select" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          {ESTADO_OPTIONS.slice(1).map(e => (
            <option key={e} value={e}>{ESTADO_LABELS[e]}</option>
          ))}
        </select>
        <select className="erp-select" value={filtroCiudad} onChange={e => setFiltroCiudad(e.target.value)}>
          <option value="">Todas las ciudades</option>
          {CIUDAD_OPTIONS.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div style={{ display: 'flex', background: '#1e293b', border: '1px solid #334155', borderRadius: 6, overflow: 'hidden' }}>
          {['cards', 'tabla'].map(v => (
            <button key={v} className="btn btn-secondary btn-sm" onClick={() => setVista(v)}
              style={{ borderRadius: 0, background: vista === v ? '#334155' : 'transparent', border: 'none', padding: '6px 12px' }}>
              {v === 'cards' ? '⊞' : '☰'}
            </button>
          ))}
        </div>
      </div>

      {/* Vista cards */}
      {vista === 'cards' && (
        <div className="grid-cards">
          {viviendasFiltradas.map(v => {
            const incidenciasAbiertas = getIncidenciasAbiertas(v.id);
            const tareasPendientes = getTareasPendientes(v.id);
            return (
              <div
                key={v.id}
                className="card"
                onClick={() => navigate(`/viviendas/${v.id}`)}
                style={{
                  cursor: 'pointer',
                  borderLeft: `3px solid ${borderColorMap[v.estado] || '#334155'}`,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = borderColorMap[v.estado]; e.currentTarget.style.background = '#253347'; }}
                onMouseLeave={e => { e.currentTarget.style.background = ''; }}
              >
                <div className="flex-between" style={{ marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>{v.nombre}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#64748b', marginTop: 2 }}>
                      <MapPin size={10} />
                      {v.ciudad} · {v.barrio}
                    </div>
                  </div>
                  <Badge value={v.estado} />
                </div>

                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 12 }}>
                  {v.direccion}
                </div>

                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  <div className="stat-pill">
                    <Users size={10} />
                    {v.capacidad} pers.
                  </div>
                  <div className="stat-pill">
                    <Home size={10} />
                    {v.habitaciones} hab.
                  </div>
                </div>

                {/* Alertas de la vivienda */}
                {(incidenciasAbiertas > 0 || tareasPendientes > 0) && (
                  <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                    {incidenciasAbiertas > 0 && (
                      <span className="badge badge-incidencia">{incidenciasAbiertas} incidencia{incidenciasAbiertas > 1 ? 's' : ''}</span>
                    )}
                    {tareasPendientes > 0 && (
                      <span className="badge badge-tarea-pendiente">{tareasPendientes} tarea{tareasPendientes > 1 ? 's' : ''}</span>
                    )}
                  </div>
                )}

                {v.proximaEntrada && (
                  <div style={{ fontSize: 11, color: '#475569', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Próx. entrada: <span style={{ color: '#94a3b8' }}>{v.proximaEntrada}</span></span>
                    <ChevronRight size={13} color="#475569" />
                  </div>
                )}
              </div>
            );
          })}
          {viviendasFiltradas.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#64748b', padding: 40 }}>
              No se encontraron viviendas con los filtros aplicados
            </div>
          )}
        </div>
      )}

      {/* Vista tabla */}
      {vista === 'tabla' && (
        <div className="table-wrapper">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Vivienda</th>
                <th>Ciudad</th>
                <th>Capacidad</th>
                <th>Estado</th>
                <th>Próx. Entrada</th>
                <th>Incidencias</th>
                <th>Tareas pend.</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {viviendasFiltradas.map(v => (
                <tr key={v.id} onClick={() => navigate(`/viviendas/${v.id}`)}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{v.nombre}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{v.barrio}</div>
                  </td>
                  <td>{v.ciudad}</td>
                  <td>{v.capacidad} pers.</td>
                  <td><Badge value={v.estado} /></td>
                  <td style={{ fontSize: 12 }}>{v.proximaEntrada || '—'}</td>
                  <td>
                    {getIncidenciasAbiertas(v.id) > 0 ? (
                      <span className="badge badge-incidencia">{getIncidenciasAbiertas(v.id)}</span>
                    ) : <span style={{ color: '#475569' }}>—</span>}
                  </td>
                  <td>
                    {getTareasPendientes(v.id) > 0 ? (
                      <span className="badge badge-tarea-pendiente">{getTareasPendientes(v.id)}</span>
                    ) : <span style={{ color: '#475569' }}>—</span>}
                  </td>
                  <td><ChevronRight size={14} color="#475569" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
