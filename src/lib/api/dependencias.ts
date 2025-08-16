import { Dependencia, CreateDependenciaInput } from './types';

const API_BASE = '/.netlify/functions';

export async function fetchDependencias(): Promise<Dependencia[]> {
  const response = await fetch(`${API_BASE}/dependencias`);
  if (!response.ok) {
    throw new Error('Error cargando dependencias');
  }
  return response.json();
}

export async function createDependencia(data: CreateDependenciaInput): Promise<Dependencia> {
  const response = await fetch(`${API_BASE}/dependencias`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Error creando dependencia');
  }
  
  return response.json();
}

export async function updateDependencia(id: number, data: Partial<CreateDependenciaInput>): Promise<Dependencia> {
  const response = await fetch(`${API_BASE}/dependencias`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, ...data }),
  });
  
  if (!response.ok) {
    throw new Error('Error actualizando dependencia');
  }
  
  return response.json();
}
