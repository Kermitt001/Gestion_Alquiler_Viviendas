// Sidebar de navegación principal del ERP
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Home, Calendar, ClipboardList,
  AlertTriangle, Package, Bell, Users, Building2
} from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/viviendas', icon: Home, label: 'Viviendas' },
  { to: '/reservas', icon: Calendar, label: 'Reservas' },
  { to: '/tareas', icon: ClipboardList, label: 'Tareas' },
  { to: '/incidencias', icon: AlertTriangle, label: 'Incidencias' },
  { to: '/suministros', icon: Package, label: 'Suministros' },
  { to: '/alertas', icon: Bell, label: 'Alertas' },
  { to: '/usuarios', icon: Users, label: 'Usuarios' },
];
import { today, fmtDate } from '../../data/mockData';

export default function Sidebar() {
  const alertas = useAppStore(s => s.alertas);
  const tareas = useAppStore(s => s.tareas);
  const incidencias = useAppStore(s => s.incidencias);

  const alertasActivas = alertas.filter(a => !a.atendida);
  const tareasHoy = tareas.filter(t => t.fecha === fmtDate(today));

  const badgeCounts = {
    '/alertas': alertasActivas.length,
    '/incidencias': incidencias.filter(i => i.criticidad === 'critica' && i.estado !== 'resuelta').length,
    '/tareas': tareasHoy.filter(t => t.estado === 'pendiente' || t.estado === 'retrasada').length,
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Building2 size={16} color="white" />
        </div>
        <div>
          <div className="sidebar-logo-text">ApartGroup</div>
          <div className="sidebar-logo-sub">Sistema Operativo</div>
        </div>
      </div>

      {/* Navegación */}
      <div className="sidebar-section">
        <div className="sidebar-section-label">Operaciones</div>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
          >
            <Icon size={16} />
            <span style={{ flex: 1 }}>{label}</span>
            {badgeCounts[to] > 0 && (
              <span className="badge-count">{badgeCounts[to]}</span>
            )}
          </NavLink>
        ))}
      </div>

      {/* Footer del sidebar */}
      <div style={{ marginTop: 'auto', padding: '12px 16px', borderTop: '1px solid #1e293b' }}>
        <div style={{ fontSize: 10, color: '#334155', textAlign: 'center' }}>
          ApartGroup ERP v1.0 · Demo
        </div>
      </div>
    </aside>
  );
}
