// Panel central de Alertas — clasificadas, filtrables, con acceso al elemento
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle, Filter } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { Semaforo } from '../../components/ui/Badge';
import Breadcrumb from '../../components/shared/Breadcrumb';

const TIPO_LABELS = {
  'check-in-no-lista': '🏠 Check-in vivienda no lista',
  'incidencia-critica': '⚠️ Incidencia crítica activa',
  'tarea-retrasada': '⏱ Tarea retrasada',
  'stock-bajo': '📦 Stock bajo',
  'incidencia-seguridad': '🔒 Incidencia de seguridad',
};

const ENTIDAD_RUTAS = {
  vivienda: (id) => `/viviendas/${id}`,
  incidencia: () => `/incidencias`,
  tarea: () => `/tareas`,
  suministro: () => `/suministros`,
};

export default function AlertasPanel() {
  const navigate = useNavigate();
  const { alertas, atenderAlerta, viviendas } = useAppStore();

  const [filtroCriticidad, setFiltroCriticidad] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [mostrarAtendidas, setMostrarAtendidas] = useState(false);

  const alertasFiltradas = alertas.filter(a => {
    if (!mostrarAtendidas && a.atendida) return false;
    const matchCrit = !filtroCriticidad || a.criticidad === filtroCriticidad;
    const matchTipo = !filtroTipo || a.tipo === filtroTipo;
    return matchCrit && matchTipo;
  }).sort((a, b) => {
    if (a.atendida && !b.atendida) return 1;
    if (!a.atendida && b.atendida) return -1;
    const crit = { critica: 0, alta: 1, media: 2, baja: 3, info: 4 };
    return (crit[a.criticidad] || 4) - (crit[b.criticidad] || 4);
  });

  const alertasActivas = alertas.filter(a => !a.atendida);
  const criticas = alertasActivas.filter(a => a.criticidad === 'critica').length;
  const altas = alertasActivas.filter(a => a.criticidad === 'alta').length;
  const medias = alertasActivas.filter(a => a.criticidad === 'media').length;

  const getViviendaNombre = (id) => viviendas.find(v => v.id === id)?.nombre;

  const handleIrAlElemento = (alerta) => {
    const ruta = ENTIDAD_RUTAS[alerta.entidad]?.(alerta.entidadId);
    if (ruta) navigate(ruta);
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/' }, { label: 'Panel de Alertas' }]} />

      <div className="page-header">
        <div>
          <h1 className="page-title">Panel de Alertas</h1>
          <p className="page-subtitle">Centro de alertas operativas del sistema</p>
        </div>
        {alertasActivas.length > 0 && (
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="stat-pill" style={{ borderColor: '#ef4444' }}>
              <span className="semaforo semaforo-rojo" />
              <span style={{ color: '#ef4444', fontWeight: 700 }}>{criticas}</span> críticas
            </div>
            <div className="stat-pill" style={{ borderColor: '#f97316' }}>
              <span className="semaforo semaforo-naranja" />
              <span style={{ color: '#f97316', fontWeight: 700 }}>{altas}</span> altas
            </div>
            <div className="stat-pill">
              <span className="semaforo semaforo-amarillo" />
              <span style={{ color: '#f59e0b', fontWeight: 700 }}>{medias}</span> medias
            </div>
          </div>
        )}
      </div>

      {/* Sin alertas */}
      {alertasActivas.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 48, marginBottom: 16 }}>
          <CheckCircle size={40} color="#22c55e" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: 16, fontWeight: 600, color: '#4ade80', marginBottom: 6 }}>
            Sistema operativo sin alertas activas
          </div>
          <div style={{ fontSize: 13, color: '#64748b' }}>
            Todas las viviendas, tareas y suministros están bajo control
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="filters-row">
        <select className="erp-select" value={filtroCriticidad} onChange={e => setFiltroCriticidad(e.target.value)}>
          <option value="">Todas las criticidades</option>
          <option value="critica">Crítica</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="info">Informativa</option>
        </select>
        <select className="erp-select" value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
          <option value="">Todos los tipos</option>
          {Object.entries(TIPO_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b', cursor: 'pointer' }}>
          <input type="checkbox" checked={mostrarAtendidas} onChange={e => setMostrarAtendidas(e.target.checked)}
            style={{ accentColor: '#3b82f6' }} />
          Mostrar atendidas
        </label>
      </div>

      {/* Lista de alertas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {alertasFiltradas.map(a => (
          <div
            key={a.id}
            className={`card ${a.atendida ? '' : `alert-${a.criticidad}`}`}
            style={{
              borderLeft: `4px solid ${a.atendida ? '#334155' : a.criticidad === 'critica' ? '#ef4444' : a.criticidad === 'alta' ? '#f97316' : a.criticidad === 'media' ? '#f59e0b' : '#3b82f6'}`,
              opacity: a.atendida ? 0.5 : 1,
              padding: '14px 16px',
            }}
          >
            <div className="flex-between" style={{ gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1 }}>
                <Semaforo criticidad={a.atendida ? 'baja' : a.criticidad} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: a.atendida ? '#475569' : '#f8fafc', marginBottom: 4 }}>
                    {a.titulo}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                    {a.descripcion}
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#475569' }}>
                    <span>{TIPO_LABELS[a.tipo] || a.tipo}</span>
                    {a.viviendaId && <span>→ {getViviendaNombre(a.viviendaId)}</span>}
                    <span>{a.fecha}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {!a.atendida && (
                  <>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleIrAlElemento(a)}>
                      Ver elemento →
                    </button>
                    <button className="btn btn-success btn-sm" onClick={() => atenderAlerta(a.id)}>
                      ✓ Atendida
                    </button>
                  </>
                )}
                {a.atendida && (
                  <span style={{ fontSize: 12, color: '#4ade80' }}>✓ Atendida</span>
                )}
              </div>
            </div>
          </div>
        ))}
        {alertasFiltradas.length === 0 && !mostrarAtendidas && (
          <div className="card" style={{ textAlign: 'center', color: '#64748b', padding: 32 }}>
            No hay alertas con los filtros aplicados
          </div>
        )}
      </div>
    </div>
  );
}
