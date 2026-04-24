// Selector de rol para demo — aparece en el dashboard también
import useAppStore from '../../store/useAppStore';

const ROLES = [
  { key: 'operaciones', label: 'Responsable de Operaciones', color: '#60a5fa', desc: 'Visión global, alertas, decisiones' },
  { key: 'limpieza', label: 'Personal de Limpieza', color: '#fb923c', desc: 'Tareas asignadas, incidencias' },
  { key: 'mantenimiento', label: 'Personal de Mantenimiento', color: '#c084fc', desc: 'Incidencias técnicas' },
  { key: 'admin', label: 'Administrador', color: '#4ade80', desc: 'Usuarios, permisos, configuración' },
];

export default function RoleSelector({ compact = false }) {
  const { currentRole, setRole } = useAppStore();

  if (compact) {
    return (
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {ROLES.map(r => (
          <button
            key={r.key}
            className={`btn ${currentRole === r.key ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setRole(r.key)}
            style={currentRole === r.key ? { background: `${r.color}33`, borderColor: r.color, color: r.color } : {}}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: r.color }} />
            {r.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
      {ROLES.map(r => (
        <button
          key={r.key}
          onClick={() => setRole(r.key)}
          style={{
            padding: '12px 14px',
            background: currentRole === r.key ? `${r.color}15` : '#0f172a',
            border: `1px solid ${currentRole === r.key ? r.color : '#334155'}`,
            borderRadius: 8,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.15s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: r.color }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: currentRole === r.key ? r.color : '#e2e8f0' }}>
              {r.label}
            </span>
          </div>
          <div style={{ fontSize: 11, color: '#64748b', paddingLeft: 18 }}>{r.desc}</div>
        </button>
      ))}
    </div>
  );
}
