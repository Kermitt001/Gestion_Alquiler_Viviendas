// Detalle de Vivienda — Vista completa con tabs: Reservas, Tareas, Incidencias, Timeline
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Users, Home, Calendar, ClipboardList,
  AlertTriangle, ArrowLeft, Edit, ChevronRight
} from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { Badge, Semaforo } from '../../components/ui/Badge';
import Breadcrumb from '../../components/shared/Breadcrumb';

const TIMELINE_ESTADOS = [
  { estado: 'pendiente-preparacion', label: 'Check-out registrado', dotClass: 'timeline-dot-gray' },
  { estado: 'limpieza-asignada', label: 'Limpieza asignada', dotClass: 'timeline-dot-blue' },
  { estado: 'en-preparacion', label: 'Preparación en curso', dotClass: 'timeline-dot-blue' },
  { estado: 'con-incidencia', label: 'Incidencia detectada', dotClass: 'timeline-dot-red' },
  { estado: 'lista', label: 'Vivienda lista', dotClass: 'timeline-dot-green' },
];

export default function ViviendaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { viviendas, reservas, tareas, incidencias, usuarios, updateViviendaEstado } = useAppStore();

  const [tab, setTab] = useState('reservas');

  const vivienda = viviendas.find(v => v.id === id);
  if (!vivienda) return (
    <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>
      Vivienda no encontrada. <button className="btn btn-secondary" onClick={() => navigate('/viviendas')}>Volver</button>
    </div>
  );

  const reservasVivienda = reservas.filter(r => r.viviendaId === id).sort((a, b) => b.checkIn.localeCompare(a.checkIn));
  const tareasVivienda = tareas.filter(t => t.viviendaId === id).sort((a, b) => b.fecha.localeCompare(a.fecha));
  const incidenciasVivienda = incidencias.filter(i => i.viviendaId === id).sort((a, b) => b.fecha.localeCompare(a.fecha));

  const getResponsable = (uid) => usuarios.find(u => u.id === uid)?.nombre || '—';

  // Timeline: posición actual del estado
  const estadoIndex = TIMELINE_ESTADOS.findIndex(t => t.estado === vivienda.estado);

  const borderColor = {
    'lista': '#22c55e', 'con-incidencia': '#ef4444',
    'en-preparacion': '#60a5fa', 'limpieza-asignada': '#fb923c',
    'pendiente-preparacion': '#a78bfa',
  };

  return (
    <div>
      <Breadcrumb items={[
        { label: 'Dashboard', to: '/' },
        { label: 'Viviendas', to: '/viviendas' },
        { label: vivienda.nombre }
      ]} />

      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div
            style={{
              width: 48, height: 48, borderRadius: 12, background: `${borderColor[vivienda.estado] || '#334155'}22`,
              border: `2px solid ${borderColor[vivienda.estado] || '#334155'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}
          >
            <Home size={22} color={borderColor[vivienda.estado] || '#94a3b8'} />
          </div>
          <div>
            <h1 className="page-title">{vivienda.nombre}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#64748b' }}>
                <MapPin size={12} /> {vivienda.direccion} · {vivienda.ciudad}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#64748b' }}>
                <Users size={12} /> {vivienda.capacidad} personas
              </span>
              <Badge value={vivienda.estado} />
            </div>
            {vivienda.observaciones && (
              <div style={{ marginTop: 8, fontSize: 12, color: '#94a3b8', background: '#0f172a', padding: '6px 10px', borderRadius: 6, border: '1px solid #334155' }}>
                ⚠ {vivienda.observaciones}
              </div>
            )}
          </div>
        </div>

        {/* Panel lateral de estado rápido */}
        <div className="card" style={{ minWidth: 200 }}>
          <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
            Info rápida
          </div>
          <div style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="flex-between">
              <span style={{ color: '#64748b' }}>Habitaciones</span>
              <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{vivienda.habitaciones}</span>
            </div>
            <div className="flex-between">
              <span style={{ color: '#64748b' }}>Baños</span>
              <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{vivienda.banos}</span>
            </div>
            <div className="flex-between">
              <span style={{ color: '#64748b' }}>Próx. entrada</span>
              <span style={{ color: '#60a5fa', fontWeight: 600 }}>{vivienda.proximaEntrada || '—'}</span>
            </div>
            <div className="flex-between">
              <span style={{ color: '#64748b' }}>Propietario</span>
              <span style={{ color: '#94a3b8', fontSize: 11 }}>{vivienda.propietario}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mini Timeline de estado ── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
          Flujo de preparación
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto' }}>
          {TIMELINE_ESTADOS.map((step, idx) => {
            const isActive = step.estado === vivienda.estado;
            const isPast = idx < estadoIndex;
            const color = isActive ? '#3b82f6' : isPast ? '#22c55e' : '#334155';
            const textColor = isActive ? '#60a5fa' : isPast ? '#4ade80' : '#475569';
            return (
              <div key={step.estado} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  padding: '6px 8px', borderRadius: 6,
                  background: isActive ? '#1e3a5f' : 'transparent',
                  border: isActive ? '1px solid #2563eb' : '1px solid transparent',
                  flex: 1, minWidth: 80
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: isActive ? '#2563eb' : isPast ? '#166534' : '#1e293b',
                    border: `2px solid ${color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: 'white', fontWeight: 700
                  }}>
                    {isPast ? '✓' : isActive ? '●' : idx + 1}
                  </div>
                  <span style={{ fontSize: 10, color: textColor, textAlign: 'center', lineHeight: 1.3 }}>
                    {step.label}
                  </span>
                </div>
                {idx < TIMELINE_ESTADOS.length - 1 && (
                  <div style={{ width: 24, height: 1, background: isPast ? '#166534' : '#334155', flexShrink: 0 }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Tabs de contenido ── */}
      <div className="tabs">
        {[
          { key: 'reservas', label: `Reservas (${reservasVivienda.length})` },
          { key: 'tareas', label: `Tareas (${tareasVivienda.length})` },
          { key: 'incidencias', label: `Incidencias (${incidenciasVivienda.length})` },
        ].map(t => (
          <button key={t.key} className={`tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Reservas ── */}
      {tab === 'reservas' && (
        <div className="table-wrapper">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Huésped</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Personas</th>
                <th>Plataforma</th>
                <th>Estado</th>
                <th>Precio</th>
                <th>Notas</th>
              </tr>
            </thead>
            <tbody>
              {reservasVivienda.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 500, color: '#e2e8f0' }}>{r.huesped}</td>
                  <td style={{ fontSize: 12 }}>{r.checkIn}</td>
                  <td style={{ fontSize: 12 }}>{r.checkOut}</td>
                  <td>{r.numPersonas}</td>
                  <td><Badge value={r.plataforma} /></td>
                  <td><Badge value={r.estado} /></td>
                  <td style={{ color: '#4ade80', fontWeight: 600 }}>{r.precio}€</td>
                  <td style={{ fontSize: 11, color: '#64748b', maxWidth: 200 }}>
                    {r.notas || '—'}
                  </td>
                </tr>
              ))}
              {reservasVivienda.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: '#475569' }}>Sin reservas registradas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Tab: Tareas ── */}
      {tab === 'tareas' && (
        <div className="table-wrapper">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Hora lím.</th>
                <th>Prioridad</th>
                <th>Responsable</th>
                <th>Estado</th>
                <th>Notas</th>
              </tr>
            </thead>
            <tbody>
              {tareasVivienda.map(t => (
                <tr key={t.id}>
                  <td>
                    <Badge value={t.tipo} customLabel={t.tipo.charAt(0).toUpperCase() + t.tipo.slice(1)} />
                  </td>
                  <td style={{ fontSize: 12 }}>{t.fecha}</td>
                  <td style={{ fontSize: 12, color: t.estado === 'retrasada' ? '#f87171' : '#94a3b8', fontWeight: t.estado === 'retrasada' ? 700 : 400 }}>
                    {t.horaLimite}
                  </td>
                  <td><Badge value={t.prioridad} /></td>
                  <td style={{ fontSize: 12 }}>{getResponsable(t.responsableId)}</td>
                  <td><Badge value={t.estado} /></td>
                  <td style={{ fontSize: 11, color: '#64748b', maxWidth: 200 }}>{t.notas || '—'}</td>
                </tr>
              ))}
              {tareasVivienda.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: '#475569' }}>Sin tareas registradas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Tab: Incidencias ── */}
      {tab === 'incidencias' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {incidenciasVivienda.map(i => (
            <div key={i.id} className="card" style={{ borderLeft: `3px solid ${i.criticidad === 'critica' ? '#ef4444' : i.criticidad === 'alta' ? '#f97316' : '#f59e0b'}` }}>
              <div className="flex-between" style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Semaforo criticidad={i.criticidad} />
                  <span style={{ fontWeight: 600, color: '#e2e8f0', fontSize: 13 }}>
                    {i.tipo.charAt(0).toUpperCase() + i.tipo.slice(1)}
                  </span>
                  <Badge value={i.criticidad} />
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Badge value={i.estado} />
                  <span style={{ fontSize: 11, color: '#475569' }}>{i.fecha}</span>
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8 }}>{i.descripcion}</p>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#64748b' }}>
                <span>Responsable: <span style={{ color: '#94a3b8' }}>{getResponsable(i.responsableId)}</span></span>
                <span>Reportado por: <span style={{ color: '#94a3b8' }}>{getResponsable(i.reportadoPor)}</span></span>
                {i.resolucion && <span>Resolución: <span style={{ color: '#4ade80' }}>{i.resolucion}</span></span>}
              </div>
            </div>
          ))}
          {incidenciasVivienda.length === 0 && (
            <div className="card" style={{ textAlign: 'center', color: '#64748b', padding: 32 }}>
              ✓ Sin incidencias registradas
            </div>
          )}
        </div>
      )}
    </div>
  );
}
