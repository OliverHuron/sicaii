import { Solicitud, CreateSolicitudInput, UpdateSolicitudStatusInput } from './types';

const API_BASE = '/.netlify/functions';

export async function fetchSolicitudes(): Promise<Solicitud[]> {
  const response = await fetch(`${API_BASE}/solicitudes`);
  if (!response.ok) {
    throw new Error('Error cargando solicitudes');
  }
  return response.json();
}

export async function createSolicitud(data: CreateSolicitudInput): Promise<Solicitud> {
  const response = await fetch(`${API_BASE}/solicitudes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Error creando solicitud');
  }
  
  return response.json();
}

export async function updateSolicitudStatus(data: UpdateSolicitudStatusInput): Promise<Solicitud> {
  const response = await fetch(`${API_BASE}/solicitudes`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Error actualizando estado de solicitud');
  }
  
  return response.json();
}

// Utilidades para formatear estados
export function formatEstadoSolicitud(estado: string): string {
  const estados = {
    PENDIENTE: 'Pendiente',
    APROBADA: 'Aprobada',
    RECHAZADA: 'Rechazada',
    COMPLETADA: 'Completada',
    CANCELADA: 'Cancelada'
  };
  return estados[estado as keyof typeof estados] || estado;
}

export function getEstadoColor(estado: string): string {
  const colores = {
    PENDIENTE: 'yellow',
    APROBADA: 'green',
    RECHAZADA: 'red',
    COMPLETADA: 'blue',
    CANCELADA: 'gray'
  };
  return colores[estado as keyof typeof colores] || 'gray';
}
