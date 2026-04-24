// ============================================================
// ZUSTAND STORE — Estado global del ERP
// Permite acciones que simulan lógica real del sistema
// ============================================================

import { create } from 'zustand';
import {
  viviendas as viviendasData,
  tareasIniciales,
  incidenciasIniciales,
  suministros as suministrosData,
  reservas as reservasData,
  usuarios,
  proveedores,
  today,
  fmtDate,
} from '../data/mockData';
import { addDays } from 'date-fns';

// ── Generar alertas automáticamente desde los datos ──────────
const generarAlertas = (viviendas, tareas, incidencias, suministros, reservas) => {
  const alertas = [];
  const todayStr = fmtDate(today);
  const mananaStr = fmtDate(addDays(today, 1));
  const pasadoStr = fmtDate(addDays(today, 2));

  // 1. Check-in próximo con vivienda no lista
  viviendas.forEach(v => {
    if (v.proximaEntrada && v.proximaEntrada <= mananaStr && v.estado !== 'lista') {
      alertas.push({
        id: `alerta-checkin-${v.id}`,
        tipo: 'check-in-no-lista',
        criticidad: v.proximaEntrada === todayStr ? 'critica' : 'alta',
        titulo: `Check-in hoy/mañana — ${v.nombre} no está lista`,
        descripcion: `Entrada: ${v.proximaEntrada}. Estado actual: ${v.estado}. Requiere acción inmediata.`,
        viviendaId: v.id,
        entidad: 'vivienda',
        entidadId: v.id,
        atendida: false,
        fecha: todayStr,
      });
    }
  });

  // 2. Incidencias críticas abiertas
  incidencias.filter(i => i.criticidad === 'critica' && i.estado !== 'resuelta').forEach(i => {
    const v = viviendas.find(vv => vv.id === i.viviendaId);
    alertas.push({
      id: `alerta-inc-critica-${i.id}`,
      tipo: 'incidencia-critica',
      criticidad: 'critica',
      titulo: `Incidencia crítica activa — ${v?.nombre}`,
      descripcion: i.descripcion.substring(0, 100),
      entidad: 'incidencia',
      entidadId: i.id,
      viviendaId: i.viviendaId,
      atendida: false,
      fecha: i.fecha,
    });
  });

  // 3. Tareas retrasadas
  tareas.filter(t => t.estado === 'retrasada').forEach(t => {
    const v = viviendas.find(vv => vv.id === t.viviendaId);
    alertas.push({
      id: `alerta-tarea-ret-${t.id}`,
      tipo: 'tarea-retrasada',
      criticidad: 'alta',
      titulo: `Tarea retrasada — ${v?.nombre}`,
      descripcion: `Tarea de ${t.tipo} con hora límite ${t.horaLimite}. ${t.notas}`,
      entidad: 'tarea',
      entidadId: t.id,
      viviendaId: t.viviendaId,
      atendida: false,
      fecha: t.fecha,
    });
  });

  // 4. Stock bajo
  suministros.filter(s => s.stockActual < s.stockMinimo && s.estadoReposicion === 'stock-bajo').forEach(s => {
    alertas.push({
      id: `alerta-stock-${s.id}`,
      tipo: 'stock-bajo',
      criticidad: 'media',
      titulo: `Stock bajo — ${s.nombre}`,
      descripcion: `Stock actual: ${s.stockActual} ${s.unidad}. Mínimo: ${s.stockMinimo}. Sin pedido activo.`,
      entidad: 'suministro',
      entidadId: s.id,
      viviendaId: null,
      atendida: false,
      fecha: todayStr,
    });
  });

  // 5. Incidencias de seguridad en vivienda con check-in próximo
  incidencias.filter(i => i.tipo === 'seguridad' && i.estado !== 'resuelta').forEach(i => {
    const v = viviendas.find(vv => vv.id === i.viviendaId);
    if (v?.proximaEntrada && v.proximaEntrada <= pasadoStr) {
      alertas.push({
        id: `alerta-seguridad-${i.id}`,
        tipo: 'incidencia-seguridad',
        criticidad: 'critica',
        titulo: `Incidencia de seguridad — ${v.nombre}`,
        descripcion: `Incidencia de seguridad activa con check-in el ${v.proximaEntrada}. ${i.descripcion}`,
        entidad: 'incidencia',
        entidadId: i.id,
        viviendaId: i.viviendaId,
        atendida: false,
        fecha: i.fecha,
      });
    }
  });

  return alertas;
};

const useAppStore = create((set, get) => ({
  // ── Estado inicial ──────────────────────────────────────
  currentRole: 'operaciones', // rol activo para demo
  viviendas: viviendasData,
  tareas: tareasIniciales,
  incidencias: incidenciasIniciales,
  suministros: suministrosData,
  reservas: reservasData,
  usuarios,
  proveedores,

  // Generar alertas initial
  alertas: generarAlertas(viviendasData, tareasIniciales, incidenciasIniciales, suministrosData, reservasData),

  // ── Selector de rol ─────────────────────────────────────
  setRole: (rol) => set({ currentRole: rol }),

  // ── Acciones en Tareas ──────────────────────────────────
  updateTareaEstado: (tareaId, nuevoEstado) => {
    set(state => {
      const tareas = state.tareas.map(t =>
        t.id === tareaId ? { ...t, estado: nuevoEstado } : t
      );
      // Si la tarea se completa, rocalcular estado vivienda
      const tarea = tareas.find(t => t.id === tareaId);
      let viviendas = state.viviendas;
      if (tarea && nuevoEstado === 'completada') {
        const tareasVivienda = tareas.filter(t => t.viviendaId === tarea.viviendaId && t.estado !== 'completada');
        if (tareasVivienda.length === 0) {
          viviendas = viviendas.map(v => v.id === tarea.viviendaId ? { ...v, estado: 'lista' } : v);
        }
      }
      if (tarea && nuevoEstado === 'en-curso') {
        viviendas = viviendas.map(v => v.id === tarea.viviendaId ? { ...v, estado: 'en-preparacion' } : v);
      }
      const alertas = generarAlertas(viviendas, tareas, state.incidencias, state.suministros, state.reservas);
      return { tareas, viviendas, alertas };
    });
  },

  // ── Acciones en Incidencias ─────────────────────────────
  createIncidencia: (incidencia) => {
    set(state => {
      const nueva = { ...incidencia, id: `i${Date.now()}` };
      const incidencias = [nueva, ...state.incidencias];
      // Si es crítica, actualizar estado vivienda
      let viviendas = state.viviendas;
      if (nueva.criticidad === 'critica' || nueva.criticidad === 'alta') {
        viviendas = viviendas.map(v => v.id === nueva.viviendaId ? { ...v, estado: 'con-incidencia' } : v);
      }
      const alertas = generarAlertas(viviendas, state.tareas, incidencias, state.suministros, state.reservas);
      return { incidencias, viviendas, alertas };
    });
  },

  updateIncidencia: (incidenciaId, updates) => {
    set(state => {
      const incidencias = state.incidencias.map(i =>
        i.id === incidenciaId ? { ...i, ...updates } : i
      );
      // Si se resuelve, recalcular estado vivienda
      let viviendas = state.viviendas;
      const inc = incidencias.find(i => i.id === incidenciaId);
      if (inc && updates.estado === 'resuelta') {
        const incAbiertas = incidencias.filter(i => i.viviendaId === inc.viviendaId && i.estado !== 'resuelta');
        if (incAbiertas.length === 0) {
          const tareasPendientes = state.tareas.filter(t => t.viviendaId === inc.viviendaId && t.estado !== 'completada');
          const nuevoEstado = tareasPendientes.length > 0 ? 'en-preparacion' : 'lista';
          viviendas = viviendas.map(v => v.id === inc.viviendaId ? { ...v, estado: nuevoEstado } : v);
        }
      }
      const alertas = generarAlertas(viviendas, state.tareas, incidencias, state.suministros, state.reservas);
      return { incidencias, viviendas, alertas };
    });
  },

  // ── Acciones en Suministros ─────────────────────────────
  solicitarReposicion: (suministroId) => {
    set(state => {
      const suministros = state.suministros.map(s =>
        s.id === suministroId ? { ...s, estadoReposicion: 'pedido-solicitado', ultimoPedido: fmtDate(today) } : s
      );
      const alertas = generarAlertas(state.viviendas, state.tareas, state.incidencias, suministros, state.reservas);
      return { suministros, alertas };
    });
  },

  // ── Acciones en Alertas ─────────────────────────────────
  atenderAlerta: (alertaId) => {
    set(state => ({
      alertas: state.alertas.map(a => a.id === alertaId ? { ...a, atendida: true } : a),
    }));
  },

  // ── Acciones en Viviendas ───────────────────────────────
  updateViviendaEstado: (viviendaId, nuevoEstado) => {
    set(state => {
      const viviendas = state.viviendas.map(v => v.id === viviendaId ? { ...v, estado: nuevoEstado } : v);
      const alertas = generarAlertas(viviendas, state.tareas, state.incidencias, state.suministros, state.reservas);
      return { viviendas, alertas };
    });
  },

  // ── Getters computados ──────────────────────────────────
  getViviendaById: (id) => get().viviendas.find(v => v.id === id),
  getTareasByVivienda: (id) => get().tareas.filter(t => t.viviendaId === id),
  getIncidenciasByVivienda: (id) => get().incidencias.filter(i => i.viviendaId === id),
  getReservasByVivienda: (id) => get().reservas.filter(r => r.viviendaId === id),
  getTareasHoy: () => get().tareas.filter(t => t.fecha === fmtDate(today)),
  getAlertasActivas: () => get().alertas.filter(a => !a.atendida),
}));

export default useAppStore;
