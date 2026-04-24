// Módulo de Reservas — Listado con filtros y vista detalle
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, ChevronRight, X } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { Badge, Semaforo } from '../../components/ui/Badge';
import Breadcrumb from '../../components/shared/Breadcrumb';
import { fmtDate, today } from '../../data/mockData';

export default function ReservasList() {
  const navigate = useNavigate();
  const { reservas, viviendas } = useAppStore();

  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroPlataforma, setFiltroPlataforma] = useState('');
  const [filtroFecha, setFiltroFecha] = useState(''); // 'proximas', 'activas', 'pasadas'
  const [selectedReserva, setSelectedReserva] = useState(null);

  const todayStr = fmtDate(today);

  const reservasFiltradas = reservas.filter(r => {
    const matchBusq = !busqueda || r.huesped.toLowerCase().includes(busqueda.toLowerCase()) ||
      viviendas.find(v => v.id === r.viviendaId)?.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchEstado = !filtroEstado || r.estado === filtroEstado;
    const matchPlat = !filtroPlataforma || r.plataforma === filtroPlataforma;
    const matchFecha = !filtroFecha ||
      (filtroFecha === 'proximas' && r.checkIn >= todayStr && r.estado !== 'cancelada') ||
      (filtroFecha === 'activas' && r.checkIn <= todayStr && r.checkOut >= todayStr) ||
      (filtroFecha === 'pasadas' && r.checkOut < todayStr) ||
      (filtroFecha === 'hoy' && (r.checkIn === todayStr || r.checkOut === todayStr));
    return matchBusq && matchEstado && matchPlat && matchFecha;
  }).sort((a, b) => b.checkIn.localeCompare(a.checkIn));

  const getVivienda = (id) => viviendas.find(v => v.id === id);

  const getImpactoOperativo = (r) => {
    const v = getVivienda(r.viviendaId);
    if (!v) return null;
    const impactos = [];
    if (v.estado !== 'lista' && r.checkIn <= fmtDate(new Date(today.getTime() + 2 * 86400000))) {
      impactos.push({ tipo: 'alerta', texto: `Vivienda no lista: "${v.estado}"` });
    }
    if (r.notas?.includes('mascota')) impactos.push({ tipo: 'info', texto: 'Huésped con mascota — verificar política' });
    if (r.notas?.includes('tardío') || r.notas?.includes('tarde') || r.notas?.includes('22:00h')) {
      impactos.push({ tipo: 'info', texto: 'Check-in tardío — coordinar acceso' });
    }
    return impactos;
  };

  const totalIngresos = reservas.filter(r => r.estado === 'completada' || r.estado === 'activa' || r.estado === 'confirmada')
    .reduce((acc, r) => acc + (r.precio || 0), 0);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/' }, { label: 'Reservas' }]} />

      <div className="page-header">
        <div>
          <h1 className="page-title">Reservas</h1>
          <p className="page-subtitle">{reservas.length} reservas totales · {reservasFiltradas.length} mostradas</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="stat-pill">
            <span style={{ color: '#4ade80', fontWeight: 700 }}>{totalIngresos.toLocaleString()}€</span>
            ingresos acum. (activas+confirmadas+completadas)
          </div>
        </div>
      </div>

      {/* KPIs rápidos */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { key: 'proximas', label: 'Próximas', count: reservas.filter(r => r.checkIn >= todayStr && r.estado !== 'cancelada').length, color: '#60a5fa' },
          { key: 'activas', label: 'Activas hoy', count: reservas.filter(r => r.checkIn <= todayStr && r.checkOut >= todayStr).length, color: '#4ade80' },
          { key: 'hoy', label: 'Entradas/salidas hoy', count: reservas.filter(r => r.checkIn === todayStr || r.checkOut === todayStr).length, color: '#f97316' },
          { key: 'pasadas', label: 'Completadas', count: reservas.filter(r => r.estado === 'completada').length, color: '#64748b' },
        ].map(k => (
          <div key={k.key} className="stat-pill" style={{ cursor: 'pointer' }} onClick={() => setFiltroFecha(filtroFecha === k.key ? '' : k.key)}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: k.color }} />
            <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{k.count}</span>
            <span>{k.label}</span>
            {filtroFecha === k.key && <X size={10} style={{ marginLeft: 2 }} />}
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="filters-row">
        <div style={{ position: 'relative', flex: 1, maxWidth: 280 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input className="erp-input" style={{ paddingLeft: 30, width: '100%' }} placeholder="Buscar por huésped o vivienda..."
            value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>
        <select className="erp-select" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="confirmada">Confirmada</option>
          <option value="activa">Activa</option>
          <option value="completada">Completada</option>
          <option value="cancelada">Cancelada</option>
        </select>
        <select className="erp-select" value={filtroPlataforma} onChange={e => setFiltroPlataforma(e.target.value)}>
          <option value="">Todas las plataformas</option>
          <option value="airbnb">Airbnb</option>
          <option value="booking">Booking.com</option>
          <option value="vrbo">VRBO</option>
          <option value="directo">Directo</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="table-wrapper">
        <table className="erp-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Vivienda</th>
              <th>Huésped</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Pers.</th>
              <th>Plataforma</th>
              <th>Estado</th>
              <th>Precio</th>
              <th>Impacto op.</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {reservasFiltradas.map(r => {
              const v = getVivienda(r.viviendaId);
              const impactos = getImpactoOperativo(r);
              const isHoy = r.checkIn === todayStr || r.checkOut === todayStr;
              return (
                <tr key={r.id} onClick={() => setSelectedReserva(r)} style={isHoy ? { background: '#1a2440' } : {}}>
                  <td style={{ fontSize: 11, color: '#475569' }}>{r.id}</td>
                  <td>
                    <div style={{ fontWeight: 500, color: '#e2e8f0', fontSize: 12 }}>{v?.nombre}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{v?.ciudad}</div>
                  </td>
                  <td style={{ fontSize: 13, fontWeight: 500 }}>{r.huesped}</td>
                  <td style={{ fontSize: 12, color: r.checkIn === todayStr ? '#f87171' : '#94a3b8', fontWeight: r.checkIn === todayStr ? 700 : 400 }}>
                    {r.checkIn === todayStr ? 'HOY' : r.checkIn}
                  </td>
                  <td style={{ fontSize: 12, color: r.checkOut === todayStr ? '#fb923c' : '#94a3b8', fontWeight: r.checkOut === todayStr ? 700 : 400 }}>
                    {r.checkOut === todayStr ? 'HOY' : r.checkOut}
                  </td>
                  <td style={{ fontSize: 12 }}>{r.numPersonas}</td>
                  <td><Badge value={r.plataforma} /></td>
                  <td><Badge value={r.estado} /></td>
                  <td style={{ color: '#4ade80', fontWeight: 600, fontSize: 12 }}>{r.precio}€</td>
                  <td>
                    {impactos?.filter(i => i.tipo === 'alerta').length > 0 ? (
                      <span className="badge badge-incidencia">⚠ Alerta op.</span>
                    ) : <span style={{ color: '#475569', fontSize: 11 }}>—</span>}
                  </td>
                  <td><ChevronRight size={14} color="#475569" /></td>
                </tr>
              );
            })}
            {reservasFiltradas.length === 0 && (
              <tr><td colSpan={11} style={{ textAlign: 'center', color: '#64748b', padding: 32 }}>
                Sin reservas con los filtros aplicados
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Panel lateral de detalle ── */}
      {selectedReserva && (
        <div className="detail-overlay" onClick={() => setSelectedReserva(null)}>
          <div className="detail-panel" onClick={e => e.stopPropagation()}>
            <div className="detail-panel-header">
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>{selectedReserva.huesped}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{selectedReserva.id} · {getVivienda(selectedReserva.viviendaId)?.nombre}</div>
              </div>
              <button className="icon-btn" onClick={() => setSelectedReserva(null)}><X size={16} /></button>
            </div>

            <div style={{ padding: 20 }}>
              {/* Datos principales */}
              <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
                  {[
                    ['Check-in', selectedReserva.checkIn],
                    ['Check-out', selectedReserva.checkOut],
                    ['Personas', selectedReserva.numPersonas],
                    ['Plataforma', ''],
                    ['Estado', ''],
                    ['Precio', `${selectedReserva.precio}€`],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 11, color: '#475569', marginBottom: 2 }}>{k}</div>
                      {k === 'Plataforma' ? <Badge value={selectedReserva.plataforma} /> :
                        k === 'Estado' ? <Badge value={selectedReserva.estado} /> :
                          <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{v}</div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Vivienda asociada */}
              {(() => {
                const v = getVivienda(selectedReserva.viviendaId);
                return v ? (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                      Vivienda asociada
                    </div>
                    <div className="card-sm flex-between" style={{ cursor: 'pointer' }} onClick={() => { setSelectedReserva(null); navigate(`/viviendas/${v.id}`); }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{v.nombre}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{v.ciudad} · {v.barrio}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Badge value={v.estado} />
                        <ChevronRight size={14} color="#475569" />
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Impacto operativo */}
              {getImpactoOperativo(selectedReserva)?.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                    Impacto operativo
                  </div>
                  {getImpactoOperativo(selectedReserva).map((imp, i) => (
                    <div key={i} className={`alert-item alert-${imp.tipo === 'alerta' ? 'alta' : 'info'}`} style={{ marginBottom: 6 }}>
                      <span style={{ fontSize: 13 }}>{imp.tipo === 'alerta' ? '⚠' : 'ℹ'}</span>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>{imp.texto}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Notas */}
              {selectedReserva.notas && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                    Notas
                  </div>
                  <div style={{ fontSize: 13, color: '#94a3b8', background: '#0f172a', padding: 12, borderRadius: 6, border: '1px solid #334155' }}>
                    {selectedReserva.notas}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
