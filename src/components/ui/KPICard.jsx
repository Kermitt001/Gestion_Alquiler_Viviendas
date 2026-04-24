// KPI Card para el dashboard
export default function KPICard({ title, value, subtitle, icon: Icon, color = '#3b82f6', trend, onClick }) {
  return (
    <div className="kpi-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="flex-between" style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </span>
        {Icon && (
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Icon size={16} color={color} />
          </div>
        )}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>
          {subtitle}
        </div>
      )}
      {trend && (
        <div style={{ fontSize: 11, color: trend.up ? '#4ade80' : '#f87171', marginTop: 4 }}>
          {trend.up ? '↑' : '↓'} {trend.text}
        </div>
      )}
    </div>
  );
}
