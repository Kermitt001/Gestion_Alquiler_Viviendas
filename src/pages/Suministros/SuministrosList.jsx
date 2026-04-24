// Módulo de Suministros y Proveedores — Stock, alertas, reposición
import { useState } from 'react';
import { Package, Truck, Search, AlertTriangle } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { Badge } from '../../components/ui/Badge';
import Breadcrumb from '../../components/shared/Breadcrumb';

export default function SuministrosList() {
  const { suministros, proveedores, solicitarReposicion } = useAppStore();
  const [tab, setTab] = useState('suministros');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const categorias = [...new Set(suministros.map(s => s.categoria))];

  const suministrosFiltrados = suministros.filter(s => {
    const matchBusq = !busqueda || s.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchCat = !filtroCategoria || s.categoria === filtroCategoria;
    const matchEstado = !filtroEstado || s.estadoReposicion === filtroEstado;
    return matchBusq && matchCat && matchEstado;
  }).sort((a, b) => {
    // Primero los de stock bajo sin pedido
    if (a.estadoReposicion === 'stock-bajo' && b.estadoReposicion !== 'stock-bajo') return -1;
    if (b.estadoReposicion === 'stock-bajo' && a.estadoReposicion !== 'stock-bajo') return 1;
    return a.nombre.localeCompare(b.nombre);
  });

  const getProveedor = (id) => proveedores.find(p => p.id === id);

  const kpis = {
    stockBajo: suministros.filter(s => s.stockActual < s.stockMinimo).length,
    pedidosSolicitados: suministros.filter(s => s.estadoReposicion === 'pedido-solicitado').length,
    pendientesRecibir: suministros.filter(s => s.estadoReposicion === 'pendiente-recibir').length,
    ok: suministros.filter(s => s.estadoReposicion === 'ok').length,
  };

  const getStockPorcentaje = (s) => Math.min(100, Math.round((s.stockActual / s.stockMinimo) * 100));
  const getStockColor = (s) => {
    const pct = getStockPorcentaje(s);
    if (pct < 50) return '#ef4444';
    if (pct < 80) return '#f97316';
    return '#22c55e';
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/' }, { label: 'Suministros y Proveedores' }]} />

      <div className="page-header">
        <div>
          <h1 className="page-title">Suministros y Proveedores</h1>
          <p className="page-subtitle">Gestión de stock y relaciones con proveedores</p>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'Stock bajo (sin pedido)', count: kpis.stockBajo, color: '#ef4444' },
          { label: 'Pedidos en curso', count: kpis.pedidosSolicitados, color: '#60a5fa' },
          { label: 'Pendientes de recibir', count: kpis.pendientesRecibir, color: '#c084fc' },
          { label: 'Con stock OK', count: kpis.ok, color: '#22c55e' },
        ].map(k => (
          <div key={k.label} className="stat-pill">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: k.color }} />
            <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{k.count}</span>
            <span>{k.label}</span>
          </div>
        ))}
      </div>

      {/* Alerta de stock bajo sin pedido */}
      {kpis.stockBajo > 0 && (
        <div className="alert-item alert-alta" style={{ marginBottom: 16, borderRadius: '0 8px 8px 0' }}>
          <AlertTriangle size={16} color="#f97316" />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>
              {kpis.stockBajo} productos con stock por debajo del mínimo sin pedido activo
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>
              Solicita la reposición para evitar desabastecimiento en próximas preparaciones
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${tab === 'suministros' ? 'active' : ''}`} onClick={() => setTab('suministros')}>
          <Package size={13} style={{ marginRight: 6 }} /> Suministros ({suministros.length})
        </button>
        <button className={`tab ${tab === 'proveedores' ? 'active' : ''}`} onClick={() => setTab('proveedores')}>
          <Truck size={13} style={{ marginRight: 6 }} /> Proveedores ({proveedores.length})
        </button>
      </div>

      {/* ── Tab: Suministros ── */}
      {tab === 'suministros' && (
        <>
          <div className="filters-row">
            <div style={{ position: 'relative', flex: 1, maxWidth: 260 }}>
              <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
              <input className="erp-input" style={{ paddingLeft: 30, width: '100%' }} placeholder="Buscar producto..."
                value={busqueda} onChange={e => setBusqueda(e.target.value)} />
            </div>
            <select className="erp-select" value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
              <option value="">Todas las categorías</option>
              {categorias.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="erp-select" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
              <option value="">Todos los estados</option>
              <option value="ok">OK</option>
              <option value="stock-bajo">Stock bajo</option>
              <option value="pedido-solicitado">Pedido solicitado</option>
              <option value="pendiente-recibir">Pendiente recibir</option>
            </select>
          </div>

          <div className="table-wrapper">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Stock actual</th>
                  <th>Stock mínimo</th>
                  <th>Nivel</th>
                  <th>Proveedor</th>
                  <th>Estado</th>
                  <th>Último pedido</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {suministrosFiltrados.map(s => {
                  const prov = getProveedor(s.proveedorId);
                  const pct = getStockPorcentaje(s);
                  const color = getStockColor(s);
                  return (
                    <tr key={s.id} style={s.estadoReposicion === 'stock-bajo' ? { background: '#1f1408' } : {}}>
                      <td style={{ fontWeight: 500, color: '#e2e8f0' }}>{s.nombre}</td>
                      <td><span style={{ fontSize: 11, color: '#64748b' }}>{s.categoria}</span></td>
                      <td>
                        <span style={{ fontWeight: 700, color: s.stockActual < s.stockMinimo ? '#f87171' : '#4ade80' }}>
                          {s.stockActual}
                        </span>
                        <span style={{ fontSize: 11, color: '#475569' }}> {s.unidad}</span>
                      </td>
                      <td style={{ fontSize: 12, color: '#64748b' }}>{s.stockMinimo} {s.unidad}</td>
                      <td style={{ minWidth: 100 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ flex: 1, height: 6, background: '#0f172a', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.3s' }} />
                          </div>
                          <span style={{ fontSize: 11, color, fontWeight: 600, minWidth: 30 }}>{pct}%</span>
                        </div>
                      </td>
                      <td style={{ fontSize: 12, color: '#94a3b8' }}>{prov?.nombre || '—'}</td>
                      <td><Badge value={s.estadoReposicion} /></td>
                      <td style={{ fontSize: 11, color: '#475569' }}>{s.ultimoPedido || '—'}</td>
                      <td>
                        {s.estadoReposicion === 'stock-bajo' ? (
                          <button className="btn btn-secondary btn-sm" onClick={() => solicitarReposicion(s.id)}>
                            📦 Solicitar pedido
                          </button>
                        ) : (
                          <span style={{ fontSize: 11, color: '#475569' }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── Tab: Proveedores ── */}
      {tab === 'proveedores' && (
        <div className="grid-cards" style={{ marginTop: 4 }}>
          {proveedores.map(p => {
            const productosAsociados = suministros.filter(s => s.proveedorId === p.id);
            const stockBajoCount = productosAsociados.filter(s => s.estadoReposicion === 'stock-bajo').length;
            return (
              <div key={p.id} className="card" style={{ borderLeft: stockBajoCount > 0 ? '3px solid #f97316' : '3px solid #334155' }}>
                <div className="flex-between" style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>{p.nombre}</div>
                  {stockBajoCount > 0 && (
                    <span className="badge badge-stock-bajo">⚠ {stockBajoCount} productos bajos</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>{p.servicio}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                  <div className="flex-between">
                    <span style={{ color: '#475569' }}>Ciudad</span>
                    <span style={{ color: '#94a3b8' }}>{p.ciudad}</span>
                  </div>
                  <div className="flex-between">
                    <span style={{ color: '#475569' }}>Contacto</span>
                    <span style={{ color: '#60a5fa' }}>{p.contacto}</span>
                  </div>
                  <div className="flex-between">
                    <span style={{ color: '#475569' }}>Teléfono</span>
                    <span style={{ color: '#94a3b8' }}>{p.telefono}</span>
                  </div>
                  <div className="flex-between">
                    <span style={{ color: '#475569' }}>Tiempo respuesta</span>
                    <span style={{ color: '#4ade80', fontWeight: 600 }}>{p.tiempoRespuesta}</span>
                  </div>
                </div>
                <hr className="divider" />
                <div style={{ fontSize: 11, color: '#475569' }}>
                  Productos: {productosAsociados.map(s => s.nombre).join(', ').substring(0, 80) || '—'}
                  {productosAsociados.map(s => s.nombre).join(', ').length > 80 ? '...' : ''}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
