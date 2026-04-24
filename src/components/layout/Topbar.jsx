// Topbar superior: búsqueda, rol activo, alertas rápidas
import { Bell, Search, ChevronDown } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { useState } from 'react';

const ROL_LABELS = {
  operaciones: { label: 'Responsable de Operaciones', color: '#60a5fa' },
  limpieza: { label: 'Personal de Limpieza', color: '#fb923c' },
  mantenimiento: { label: 'Personal de Mantenimiento', color: '#c084fc' },
  admin: { label: 'Administrador', color: '#4ade80' },
};

export default function Topbar({ titulo }) {
  const { currentRole, setRole } = useAppStore();
  const alertas = useAppStore(s => s.alertas);
  const alertasActivas = alertas.filter(a => !a.atendida);
  const [showRoles, setShowRoles] = useState(false);

  const rol = ROL_LABELS[currentRole];

  return (
    <header className="topbar">
      {/* Título de página */}
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>{titulo}</span>
      </div>

      {/* Barra de búsqueda decorativa */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1e293b', border: '1px solid #334155', borderRadius: 6, padding: '6px 12px', minWidth: 200 }}>
        <Search size={13} color="#475569" />
        <span style={{ fontSize: 13, color: '#475569' }}>Buscar...</span>
      </div>

      {/* Alertas */}
      <div style={{ position: 'relative' }}>
        <button className="icon-btn erp-tooltip" data-tooltip={`${alertasActivas.length} alertas activas`}>
          <Bell size={16} />
          {alertasActivas.length > 0 && (
            <span style={{
              position: 'absolute', top: 4, right: 4,
              width: 8, height: 8, borderRadius: '50%', background: '#ef4444',
              border: '2px solid #0f172a'
            }} />
          )}
        </button>
      </div>

      {/* Selector de Rol */}
      <div style={{ position: 'relative' }}>
        <button
          className="btn btn-secondary"
          style={{ gap: 8, fontSize: 12 }}
          onClick={() => setShowRoles(!showRoles)}
        >
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: rol.color, flexShrink: 0
          }} />
          <span style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {rol.label}
          </span>
          <ChevronDown size={12} />
        </button>

        {showRoles && (
          <div style={{
            position: 'absolute', right: 0, top: '100%', marginTop: 4,
            background: '#1e293b', border: '1px solid #334155', borderRadius: 8,
            padding: 4, zIndex: 100, minWidth: 220
          }}>
            {Object.entries(ROL_LABELS).map(([key, val]) => (
              <button
                key={key}
                className="sidebar-nav-item"
                style={{ width: '100%', padding: '8px 12px' }}
                onClick={() => { setRole(key); setShowRoles(false); }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: val.color, flexShrink: 0 }} />
                {val.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
