// Módulo de Usuarios y Roles — Gestión de perfiles y permisos simulados
import { useState } from 'react';
import { Users, Search, Shield } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { Badge } from '../../components/ui/Badge';
import Breadcrumb from '../../components/shared/Breadcrumb';
import RoleSelector from '../../components/shared/RoleSelector';

const PERMISOS_POR_ROL = {
  admin: {
    label: 'Administrador del Sistema',
    color: '#4ade80',
    permisos: [
      'Gestión de usuarios y roles',
      'Configuración general del sistema',
      'Acceso a todos los módulos',
      'Exportación de datos',
      'Vista de auditoría',
      'Gestión de permisos avanzados',
    ],
  },
  operaciones: {
    label: 'Responsable de Operaciones',
    color: '#60a5fa',
    permisos: [
      'Vista global de viviendas y estados',
      'Gestión de alertas operativas',
      'Asignación de tareas al equipo',
      'Consulta y creación de incidencias',
      'Gestión de reservas',
      'Vista de suministros y alertas de stock',
      'Reportes y KPIs',
    ],
  },
  limpieza: {
    label: 'Personal de Limpieza',
    color: '#fb923c',
    permisos: [
      'Ver tareas asignadas propias',
      'Marcar tareas como iniciadas y completadas',
      'Reportar incidencias desde una vivienda',
      'Acceso a suministros disponibles',
      'Vista de su agenda del día',
    ],
    noPermisos: [
      'Modificar reservas',
      'Acceder a datos financieros',
      'Gestionar usuarios',
      'Eliminar incidencias',
    ],
  },
  mantenimiento: {
    label: 'Personal de Mantenimiento',
    color: '#c084fc',
    permisos: [
      'Ver incidencias técnicas asignadas',
      'Actualizar estado de incidencias',
      'Marcar resolución de incidencias',
      'Registrar notas de reparación',
      'Solicitar materiales a operaciones',
    ],
    noPermisos: [
      'Modificar reservas',
      'Gestionar viviendas',
      'Acceder a suministros generales',
      'Gestionar usuarios',
    ],
  },
};

export default function UsuariosList() {
  const { usuarios, currentRole } = useAppStore();
  const [filtroRol, setFiltroRol] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [selectedRolDetalle, setSelectedRolDetalle] = useState(null);

  const usuariosFiltrados = usuarios.filter(u => {
    const matchBusq = !busqueda || u.nombre.toLowerCase().includes(busqueda.toLowerCase()) || u.email.toLowerCase().includes(busqueda.toLowerCase());
    const matchRol = !filtroRol || u.rol === filtroRol;
    const matchEstado = !filtroEstado || u.estado === filtroEstado;
    return matchBusq && matchRol && matchEstado;
  });

  const kpis = {
    total: usuarios.length,
    activos: usuarios.filter(u => u.estado === 'activo').length,
    porRol: {
      operaciones: usuarios.filter(u => u.rol === 'operaciones').length,
      limpieza: usuarios.filter(u => u.rol === 'limpieza').length,
      mantenimiento: usuarios.filter(u => u.rol === 'mantenimiento').length,
      admin: usuarios.filter(u => u.rol === 'admin').length,
    },
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/' }, { label: 'Usuarios y Roles' }]} />

      <div className="page-header">
        <div>
          <h1 className="page-title">Usuarios y Roles</h1>
          <p className="page-subtitle">{usuarios.length} usuarios registrados · {kpis.activos} activos</p>
        </div>
      </div>

      {/* KPIs rol */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {Object.entries(kpis.porRol).map(([rol, count]) => (
          <div key={rol} className="stat-pill" style={{ cursor: 'pointer' }} onClick={() => setFiltroRol(filtroRol === rol ? '' : rol)}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: PERMISOS_POR_ROL[rol]?.color }} />
            <span style={{ fontWeight: 700 }}>{count}</span>
            <span>{PERMISOS_POR_ROL[rol]?.label}</span>
          </div>
        ))}
      </div>

      {/* Selector de rol para demo */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Shield size={14} color="#60a5fa" />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc' }}>Selector de perfil — Demo en clase</span>
          <span className="badge badge-rol-operaciones">DEMO</span>
        </div>
        <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
          Cambia el rol activo para navegar por el sistema con la perspectiva de cada perfil de usuario.
          El sistema adaptará las vistas y permisos según el rol seleccionado.
        </p>
        <RoleSelector />
      </div>

      {/* Permisos por rol */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, marginBottom: 24 }}>
        {Object.entries(PERMISOS_POR_ROL).map(([rol, info]) => (
          <div
            key={rol}
            className="card"
            style={{ borderLeft: `3px solid ${info.color}`, cursor: 'pointer' }}
            onClick={() => setSelectedRolDetalle(selectedRolDetalle === rol ? null : rol)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: info.color }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>{info.label}</span>
              <Badge value={rol} />
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: selectedRolDetalle === rol ? 10 : 0 }}>
              {info.permisos.length} permisos activos {info.noPermisos ? `· ${info.noPermisos.length} restringidos` : ''}
            </div>
            {selectedRolDetalle === rol && (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 11, color: '#4ade80', marginBottom: 4, fontWeight: 600 }}>✓ Puede:</div>
                <ul style={{ fontSize: 11, color: '#94a3b8', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {info.permisos.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
                {info.noPermisos && (
                  <>
                    <div style={{ fontSize: 11, color: '#f87171', marginTop: 8, marginBottom: 4, fontWeight: 600 }}>✗ No puede:</div>
                    <ul style={{ fontSize: 11, color: '#64748b', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {info.noPermisos.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Listado de usuarios */}
      <div style={{ marginBottom: 12, fontWeight: 600, color: '#94a3b8', fontSize: 13 }}>Directorio de usuarios</div>

      <div className="filters-row">
        <div style={{ position: 'relative', flex: 1, maxWidth: 280 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input className="erp-input" style={{ paddingLeft: 30, width: '100%' }} placeholder="Buscar por nombre o email..."
            value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>
        <select className="erp-select" value={filtroRol} onChange={e => setFiltroRol(e.target.value)}>
          <option value="">Todos los roles</option>
          <option value="operaciones">Operaciones</option>
          <option value="limpieza">Limpieza</option>
          <option value="mantenimiento">Mantenimiento</option>
          <option value="admin">Admin</option>
        </select>
        <select className="erp-select" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="erp-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: `${PERMISOS_POR_ROL[u.rol]?.color || '#475569'}22`,
                      border: `1px solid ${PERMISOS_POR_ROL[u.rol]?.color || '#475569'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, color: PERMISOS_POR_ROL[u.rol]?.color || '#94a3b8',
                      flexShrink: 0
                    }}>
                      {u.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#e2e8f0', fontSize: 13 }}>{u.nombre}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: 12, color: '#64748b' }}>{u.email}</td>
                <td style={{ fontSize: 12, color: '#64748b' }}>{u.telefono}</td>
                <td><Badge value={u.rol} /></td>
                <td><Badge value={u.estado} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
