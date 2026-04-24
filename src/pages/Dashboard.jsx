// Dashboard principal — Vista central del ERP
import { useNavigate } from 'react-router-dom';
import {
  Home, AlertTriangle, CheckCircle, Clock, Package,
  TrendingUp, Users, Calendar, ArrowRight, Zap
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import KPICard from '../components/ui/KPICard';
import { Badge, Semaforo } from '../components/ui/Badge';
import RoleSelector from '../components/shared/RoleSelector';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { today, fmtDate } from '../data/mockData';
import { addDays } from 'date-fns';

export default function Dashboard() {
  const navigate = useNavigate();
  const { viviendas, tareas, incidencias, alertas, suministros, reservas, currentRole } = useAppStore();

  const todayStr = fmtDate(today);
  const mananaStr = fmtDate(addDays(today, 1));

  // ── KPIs calculados ──────────────────────────────────────
  const kpis = {
    vivendasListas: viviendas.filter(v => v.estado === 'lista').length,
    viviendasTotal: viviendas.length,
    viviendasConIncidencia: viviendas.filter(v => v.estado === 'con-incidencia').length,
    viviendasPendientes: viviendas.filter(v => ['pendiente-preparacion', 'limpieza-asignada', 'en-preparacion'].includes(v.estado)).length,
    tareasHoy: tareas.filter(t => t.fecha === todayStr),
    tareasCompletadas: tareas.filter(t => t.estado === 'completada' && t.fecha === todayStr).length,
    tareasRetrasadas: tareas.filter(t => t.estado === 'retrasada').length,
    incidenciasCriticas: incidencias.filter(i => i.criticidad === 'critica' && i.estado !== 'resuelta').length,
    alertasActivas: alertas.filter(a => !a.atendida).length,
    stockBajo: suministros.filter(s => s.stockActual < s.stockMinimo).length,
    proximasEntradas: reservas.filter(r => (r.checkIn === todayStr || r.checkIn === mananaStr) && r.estado !== 'cancelada'),
    proximasSalidas: reservas.filter(r => r.checkOut === todayStr && r.estado !== 'cancelada'),
  };

  const alertasActivas = alertas.filter(a => !a.atendida).slice(0, 5);
  const tareasHoy = tareas.filter(t => t.fecha === todayStr).slice(0, 6);

  const getViviendaNombre = (id) => viviendas.find(v => v.id === id)?.nombre || id;
  const getResponsable = (id) => useAppStore.getState().usuarios.find(u => u.id === id)?.nombre || '—';

  return (
    <div>
      {/* Cabecera con fecha y selector de rol */}
      <div className="flex-between" style={{ marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">Panel de Operaciones</h1>
          <p className="page-subtitle">
            {format(today, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })} · ApartGroup Operaciones S.L.
          </p>
        </div>
        <div className="card-sm" style={{ minWidth: 400 }}>
          <div style={{ fontSize: 11, color: '#475569', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Vista de rol activo
          </div>
          <RoleSelector compact />
        </div>
      </div>

      {/* ── KPIs principales ── */}
      <div className="grid-kpi" style={{ marginBottom: 20 }}>
        <KPICard
          title="Viviendas listas"
          value={`${kpis.vivendasListas}/${kpis.viviendasTotal}`}
          subtitle="Para check-in"
          icon={Home}
          color="#22c55e"
          onClick={() => navigate('/viviendas')}
        />
        <KPICard
          title="En preparación"
          value={kpis.viviendasPendientes}
          subtitle="Pendientes o en proceso"
          icon={Clock}
          color="#f59e0b"
          onClick={() => navigate('/viviendas')}
        />
        <KPICard
          title="Con incidencia"
          value={kpis.viviendasConIncidencia}
          subtitle="Requieren atención"
          icon={AlertTriangle}
          color="#ef4444"
          onClick={() => navigate('/incidencias')}
        />
        <KPICard
          title="Tareas hoy"
          value={kpis.tareasHoy.length}
          subtitle={`${kpis.tareasCompletadas} completadas · ${kpis.tareasRetrasadas} retrasadas`}
          icon={CheckCircle}
          color="#3b82f6"
          onClick={() => navigate('/tareas')}
        />
        <KPICard
          title="Alertas activas"
          value={kpis.alertasActivas}
          subtitle="Requieren acción"
          icon={Zap}
          color="#f97316"
          onClick={() => navigate('/alertas')}
        />
        <KPICard
          title="Stock bajo"
          value={kpis.stockBajo}
          subtitle="Productos por reponer"
          icon={Package}
          color="#8b5cf6"
          onClick={() => navigate('/suministros')}
        />
      </div>

      {/* ── Fila principal: Alertas + Próximas entradas ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Alertas activas */}
        <div>
          <div className="flex-between" style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={15} color="#f97316" />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc' }}>Alertas activas</span>
              {kpis.alertasActivas > 0 && (
                <span className="badge badge-critica">{kpis.alertasActivas}</span>
              )}
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/alertas')}>
              Ver todas <ArrowRight size={12} />
            </button>
          </div>

          <div>
            {alertasActivas.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', color: '#64748b', padding: 24 }}>
                ✓ Sin alertas activas
              </div>
            ) : alertasActivas.map(a => (
              <div
                key={a.id}
                className={`alert-item alert-${a.criticidad}`}
                onClick={() => navigate('/alertas')}
              >
                <Semaforo criticidad={a.criticidad} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', marginBottom: 2 }}>{a.titulo}</div>
                  <div style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.descripcion}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Próximas entradas */}
        <div>
          <div className="flex-between" style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={15} color="#60a5fa" />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc' }}>Entradas próximas</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/reservas')}>
              Ver reservas <ArrowRight size={12} />
            </button>
          </div>

          <div className="table-wrapper">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Vivienda</th>
                  <th>Huésped</th>
                  <th>Check-in</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {kpis.proximasEntradas.map(r => {
                  const v = viviendas.find(vv => vv.id === r.viviendaId);
                  return (
                    <tr key={r.id} onClick={() => navigate('/reservas')}>
                      <td>
                        <div style={{ fontSize: 12, fontWeight: 500, color: '#e2e8f0' }}>{v?.nombre}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{v?.ciudad}</div>
                      </td>
                      <td style={{ fontSize: 12 }}>{r.huesped}</td>
                      <td>
                        <span style={{ fontSize: 11, color: r.checkIn === todayStr ? '#f87171' : '#60a5fa', fontWeight: 600 }}>
                          {r.checkIn === todayStr ? 'HOY' : 'MAÑANA'}
                        </span>
                      </td>
                      <td><Badge value={v?.estado} /></td>
                    </tr>
                  );
                })}
                {kpis.proximasEntradas.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: '#64748b' }}>Sin entradas próximas</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Fila: Tareas de hoy + Estado viviendas ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Tareas de hoy */}
        <div>
          <div className="flex-between" style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle size={15} color="#3b82f6" />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc' }}>Tareas de hoy</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/tareas')}>
              Ver todas <ArrowRight size={12} />
            </button>
          </div>

          <div className="table-wrapper">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Vivienda</th>
                  <th>Tipo</th>
                  <th>Hora lím.</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {tareasHoy.map(t => (
                  <tr key={t.id} onClick={() => navigate('/tareas')}>
                    <td style={{ fontSize: 12 }}>{getViviendaNombre(t.viviendaId)}</td>
                    <td>
                      <Badge value={t.tipo === 'limpieza' ? 'limpieza' : t.tipo} customLabel={t.tipo.charAt(0).toUpperCase() + t.tipo.slice(1)} />
                    </td>
                    <td style={{ fontSize: 12, color: t.estado === 'retrasada' ? '#f87171' : '#94a3b8', fontWeight: t.estado === 'retrasada' ? 700 : 400 }}>
                      {t.horaLimite}
                    </td>
                    <td><Badge value={t.estado} /></td>
                  </tr>
                ))}
                {tareasHoy.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: '#64748b' }}>Sin tareas para hoy</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Estado viviendas */}
        <div>
          <div className="flex-between" style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Home size={15} color="#8b5cf6" />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc' }}>Estado viviendas</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/viviendas')}>
              Ver todas <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {viviendas.map(v => (
              <div
                key={v.id}
                className="card-sm flex-between"
                onClick={() => navigate(`/viviendas/${v.id}`)}
                style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#253347'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{v.nombre}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{v.ciudad} · Cap: {v.capacidad} pers.</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {v.proximaEntrada && (
                    <span style={{ fontSize: 10, color: '#475569' }}>
                      Entrada: {v.proximaEntrada}
                    </span>
                  )}
                  <Badge value={v.estado} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Incidencias críticas activas ── */}
      {kpis.incidenciasCriticas > 0 && (
        <div style={{ marginTop: 16 }}>
          <div className="flex-between" style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={15} color="#ef4444" />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc' }}>Incidencias críticas activas</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/incidencias')}>
              Gestionar <ArrowRight size={12} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {incidencias.filter(i => i.criticidad === 'critica' && i.estado !== 'resuelta').map(i => (
              <div key={i.id} className="alert-item alert-critica" onClick={() => navigate('/incidencias')}>
                <Semaforo criticidad="critica" />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#fecaca' }}>
                    {getViviendaNombre(i.viviendaId)} — {i.tipo}
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{i.descripcion.substring(0, 120)}...</div>
                </div>
                <Badge value={i.estado} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
