// Router principal del ERP — Define todas las rutas del sistema
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ViviendasList from './pages/Viviendas/ViviendasList';
import ViviendaDetail from './pages/Viviendas/ViviendaDetail';
import ReservasList from './pages/Reservas/ReservasList';
import TareasList from './pages/Tareas/TareasList';
import IncidenciasList from './pages/Incidencias/IncidenciasList';
import SuministrosList from './pages/Suministros/SuministrosList';
import AlertasPanel from './pages/Alertas/AlertasPanel';
import UsuariosList from './pages/Usuarios/UsuariosList';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="viviendas" element={<ViviendasList />} />
          <Route path="viviendas/:id" element={<ViviendaDetail />} />
          <Route path="reservas" element={<ReservasList />} />
          <Route path="tareas" element={<TareasList />} />
          <Route path="incidencias" element={<IncidenciasList />} />
          <Route path="suministros" element={<SuministrosList />} />
          <Route path="alertas" element={<AlertasPanel />} />
          <Route path="usuarios" element={<UsuariosList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
