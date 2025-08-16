import { Equipo, CreateEquipoInput } from './types';

const API_BASE = '/.netlify/functions';

export async function fetchEquipos(): Promise<Equipo[]> {
  const response = await fetch(`${API_BASE}/equipos`);
  if (!response.ok) {
    throw new Error('Error cargando equipos');
  }
  return response.json();
}

export async function createEquipo(data: CreateEquipoInput): Promise<Equipo> {
  const response = await fetch(`${API_BASE}/equipos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Error creando equipo');
  }
  
  return response.json();
}

export async function updateEquipo(id: number, data: Partial<CreateEquipoInput>): Promise<Equipo> {
  const response = await fetch(`${API_BASE}/equipos`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, ...data }),
  });
  
  if (!response.ok) {
    throw new Error('Error actualizando equipo');
  }
  
  return response.json();
}

// Utilidades para formatear estados de equipos
export function formatEstadoEquipo(estado: string): string {
  const estados = {
    DISPONIBLE: 'Disponible',
    EN_USO: 'En Uso',
    MANTENIMIENTO: 'Mantenimiento',
    BAJA: 'Dado de Baja'
  };
  return estados[estado as keyof typeof estados] || estado;
}

export function getEstadoEquipoColor(estado: string): string {
  const colores = {
    DISPONIBLE: 'green',
    EN_USO: 'blue',
    MANTENIMIENTO: 'yellow',
    BAJA: 'red'
  };
  return colores[estado as keyof typeof colores] || 'gray';
}
