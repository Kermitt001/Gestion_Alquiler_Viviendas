// Módulo de Incidencias — CRUD simulado + asignación + resolución
import { useState } from 'react';
import { Search, Plus, X, ChevronRight } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { Badge, Semaforo } from '../../components/ui/Badge';
import Breadcrumb from '../../components/shared/Breadcrumb';
import { fmtDate, today } from '../../data/mockData';

const TIPOS = ['avería', 'fontanería', 'limpieza', 'electrodoméstico', 'desperfecto', 'instalación', 'seguridad', 'otro'];
const CRITICIDADES = ['critica', 'alta', 'media', 'baja'];
const ESTADOS_INC = ['abierta', 'en-revision', 'en-proceso', 'resuelta'];

const NEXT_ESTADO_INC = {
  'abierta': 'en-revision',
  'en-revision': 'en-proceso',
  'en-proceso': 'resuelta',
};

export default function IncidenciasList() {
  const { incidencias, viviendas, usuarios, createIncidencia, updateIncidencia, currentRole } = useAppStore();

  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroCriticidad, setFiltroCriticidad] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [asignandoId, setAsignandoId] = useState(null);

  // Formulario nueva incidencia
  const [form, setForm] = useState({
    viviendaId: '', tipo: 'avería', descripcion: '', criticidad: 'media', responsableId: '', notas: ''
  });

  const getVivienda = (id) => viviendas.find(v => v.id === id);
  const getResponsable = (id) => usuarios.find(u => u.id === id);

  const incidenciasFiltradas = incidencias.filter(i => {
    const matchBusq = !busqueda ||
      i.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      getVivienda(i.viviendaId)?.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      i.tipo.toLowerCase().includes(busqueda.toLowerCase());
    const matchEstado = !filtroEstado || i.estado === filtroEstado;
    const matchCrit = !filtroCriticidad || i.criticidad === filtroCriticidad;
    // Rol mantenimiento: ve las incidencias técnicas
    if (currentRole === 'mantenimiento') {
      return matchBusq && matchEstado && matchCrit &&
        ['avería', 'fontanería', 'electrodoméstico', 'instalación', 'seguridad'].includes(i.tipo);
    }
    return matchBusq && matchEstado && matchCrit;
  }).sort((a, b) => {
    const crit = { critica: 0, alta: 1, media: 2, baja: 3 };
    if (crit[a.criticidad] !== crit[b.criticidad]) return crit[a.criticidad] - crit[b.criticidad];
    return b.fecha.localeCompare(a.fecha);
  });

  const kpis = {
    criticas: incidencias.filter(i => i.criticidad === 'critica' && i.estado !== 'resuelta').length,
    abiertas: incidencias.filter(i => i.estado === 'abierta').length,
    enProceso: incidencias.filter(i => ['en-revision', 'en-proceso'].includes(i.estado)).length,
    resueltas: incidencias.filter(i => i.estado === 'resuelta').length,
  };

  const handleCrear = () => {
    if (!form.viviendaId || !form.descripcion) return;
    createIncidencia({
      ...form,
      estado: 'abierta',
      fecha: fmtDate(today),
      reportadoPor: 'u3',
      resolucion: null,
      evidencia: null,
    });
    setShowModal(false);
    setForm({ viviendaId: '', tipo: 'avería', descripcion: '', criticidad: 'media', responsableId: '', notas: '' });
  };

  const handleAvanzarEstado = (inc) => {
    const nextEstado = NEXT_ESTADO_INC[inc.estado];
    if (!nextEstado) return;
    const updates = { estado: nextEstado };
    if (nextEstado === 'resuelta') {
      updates.resolucion = `Resuelta el ${fmtDate(today)} por ${getResponsable(inc.responsableId)?.nombre || 'el equipo'}`;
    }
    updateIncidencia(inc.id, updates);
    if (selected?.id === inc.id) setSelected({ ...selected, ...updates });
  };

  const handleAsignar = (incId, responsableId) => {
    updateIncidencia(incId, { responsableId, estado: 'en-revision' });
    if (selected?.id === incId) setSelected({ ...selected, responsableId, estado: 'en-revision' });
    setAsignandoId(null);
  };

  const critColor = { critica: '#ef4444', alta: '#f97316', media: '#f59e0b', baja: '#22c55e' };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/' }, { label: 'Incidencias' }]} />

      <div className="page-header">
        <div>
          <h1 className="page-title">Incidencias</h1>
          <p className="page-subtitle">Seguimiento y resolución de incidencias · {incidenciasFiltradas.length} mostradas</p>
        </div>
        {(currentRole === 'operaciones' || currentRole === 'limpieza' || currentRole === 'admin') && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={14} /> Reportar incidencia
          </button>
        )}
      </div>

      {/* KPIs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'Críticas activas', count: kpis.criticas, color: '#ef4444' },
          { label: 'Abiertas', count: kpis.abiertas, color: '#f87171' },
          { label: 'En proceso', count: kpis.enProceso, color: '#60a5fa' },
          { label: 'Resueltas', count: kpis.resueltas, color: '#4ade80' },
        ].map(k => (
          <div key={k.label} className="stat-pill">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: k.color }} />
            <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{k.count}</span>
            <span>{k.label}</span>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="filters-row">
        <div style={{ position: 'relative', flex: 1, maxWidth: 280 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input className="erp-input" style={{ paddingLeft: 30, width: '100%' }} placeholder="Buscar por vivienda, tipo o descripción..."
            value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>
        <select className="erp-select" value={filtroCriticidad} onChange={e => setFiltroCriticidad(e.target.value)}>
          <option value="">Todas las criticidades</option>
          {CRITICIDADES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
        <select className="erp-select" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          {ESTADOS_INC.map(e => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1).replace('-', ' ')}</option>)}
        </select>
      </div>

      {/* Lista de incidencias */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {incidenciasFiltradas.map(i => {
          const v = getVivienda(i.viviendaId);
          const resp = getResponsable(i.responsableId);
          const reportado = getResponsable(i.reportadoPor);
          const nextEstado = NEXT_ESTADO_INC[i.estado];
          const puedeAvanzar = (currentRole === 'operaciones' || currentRole === 'admin' ||
            (currentRole === 'mantenimiento' && ['avería', 'fontanería', 'electrodoméstico', 'instalación', 'seguridad'].includes(i.tipo)));

          return (
            <div key={i.id} className="card" style={{
              borderLeft: `4px solid ${critColor[i.criticidad] || '#334155'}`,
              opacity: i.estado === 'resuelta' ? 0.7 : 1,
            }}>
              <div className="flex-between" style={{ marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Semaforo criticidad={i.criticidad} />
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#f8fafc' }}>
                    {v?.nombre} — {i.tipo.charAt(0).toUpperCase() + i.tipo.slice(1)}
                  </span>
                  <Badge value={i.criticidad} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Badge value={i.estado} />
                  <span style={{ fontSize: 11, color: '#475569' }}>{i.fecha}</span>
                </div>
              </div>

              <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 10, lineHeight: 1.5 }}>{i.descripcion}</p>

              <div className="flex-between" style={{ flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#64748b', flexWrap: 'wrap' }}>
                  <span>Responsable: <strong style={{ color: '#94a3b8' }}>{resp?.nombre || 'Sin asignar'}</strong></span>
                  <span>Reportado por: <strong style={{ color: '#94a3b8' }}>{reportado?.nombre || '—'}</strong></span>
                  {i.evidencia && <span style={{ color: '#3b82f6' }}>📎 {i.evidencia}</span>}
                </div>

                <div style={{ display: 'flex', gap: 6 }}>
                  {/* Asignar responsable */}
                  {!resp && puedeAvanzar && (
                    asignandoId === i.id ? (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <select className="erp-select" onChange={e => e.target.value && handleAsignar(i.id, e.target.value)} defaultValue="">
                          <option value="">Asignar a...</option>
                          {usuarios.filter(u => ['mantenimiento', 'limpieza'].includes(u.rol) && u.estado === 'activo').map(u => (
                            <option key={u.id} value={u.id}>{u.nombre} ({u.rol})</option>
                          ))}
                        </select>
                        <button className="btn btn-secondary btn-sm" onClick={() => setAsignandoId(null)}>✕</button>
                      </div>
                    ) : (
                      <button className="btn btn-secondary btn-sm" onClick={() => setAsignandoId(i.id)}>
                        👤 Asignar
                      </button>
                    )
                  )}
                  {/* Avanzar estado */}
                  {puedeAvanzar && nextEstado && i.estado !== 'resuelta' && (
                    <button className={`btn btn-sm ${nextEstado === 'resuelta' ? 'btn-success' : 'btn-secondary'}`}
                      onClick={() => handleAvanzarEstado(i)}>
                      {nextEstado === 'resuelta' ? '✓ Marcar resuelta' :
                        nextEstado === 'en-proceso' ? '▶ Poner en proceso' : '🔍 Revisar'}
                    </button>
                  )}
                </div>
              </div>

              {i.resolucion && (
                <div style={{ marginTop: 10, padding: '6px 10px', background: '#0d2219', border: '1px solid #166534', borderRadius: 6, fontSize: 12, color: '#4ade80' }}>
                  ✓ {i.resolucion}
                </div>
              )}
            </div>
          );
        })}
        {incidenciasFiltradas.length === 0 && (
          <div className="card" style={{ textAlign: 'center', color: '#64748b', padding: 40 }}>
            No hay incidencias con los filtros aplicados
          </div>
        )}
      </div>

      {/* ── Modal Nueva Incidencia ── */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span style={{ fontWeight: 700, color: '#f8fafc' }}>Reportar nueva incidencia</span>
              <button className="icon-btn" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 4 }}>Vivienda *</label>
                  <select className="erp-select" style={{ width: '100%' }} value={form.viviendaId}
                    onChange={e => setForm({ ...form, viviendaId: e.target.value })}>
                    <option value="">Seleccionar vivienda...</option>
                    {viviendas.map(v => <option key={v.id} value={v.id}>{v.nombre}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 4 }}>Tipo de incidencia *</label>
                    <select className="erp-select" style={{ width: '100%' }} value={form.tipo}
                      onChange={e => setForm({ ...form, tipo: e.target.value })}>
                      {TIPOS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 4 }}>Criticidad *</label>
                    <select className="erp-select" style={{ width: '100%' }} value={form.criticidad}
                      onChange={e => setForm({ ...form, criticidad: e.target.value })}>
                      {CRITICIDADES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 4 }}>Descripción *</label>
                  <textarea className="erp-input" style={{ width: '100%', minHeight: 80, resize: 'vertical' }}
                    placeholder="Describe la incidencia con detalle..."
                    value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 4 }}>Asignar responsable</label>
                  <select className="erp-select" style={{ width: '100%' }} value={form.responsableId}
                    onChange={e => setForm({ ...form, responsableId: e.target.value })}>
                    <option value="">Sin asignar</option>
                    {usuarios.filter(u => ['mantenimiento', 'limpieza'].includes(u.rol) && u.estado === 'activo').map(u => (
                      <option key={u.id} value={u.id}>{u.nombre} ({u.rol})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleCrear}
                disabled={!form.viviendaId || !form.descripcion}>
                Crear incidencia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
