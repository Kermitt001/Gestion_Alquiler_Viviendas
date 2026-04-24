// Layout principal que envuelve todas las páginas
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet, useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/': 'Dashboard — Vista General',
  '/viviendas': 'Módulo de Viviendas',
  '/reservas': 'Módulo de Reservas',
  '/tareas': 'Módulo de Tareas Operativas',
  '/incidencias': 'Módulo de Incidencias',
  '/suministros': 'Módulo de Suministros y Proveedores',
  '/alertas': 'Panel de Alertas',
  '/usuarios': 'Gestión de Usuarios y Roles',
};

export default function Layout() {
  const location = useLocation();
  const titulo = PAGE_TITLES[location.pathname] || 'ApartGroup ERP';

  return (
    <div className="layout-wrapper">
      <Sidebar />
      <div className="main-content">
        <Topbar titulo={titulo} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
