import { Categoria, CreateCategoriaInput } from './types';

const API_BASE = '/.netlify/functions';

export async function fetchCategorias(): Promise<Categoria[]> {
  const response = await fetch(`${API_BASE}/categorias`);
  if (!response.ok) {
    throw new Error('Error cargando categorías');
  }
  return response.json();
}

export async function createCategoria(data: CreateCategoriaInput): Promise<Categoria> {
  const response = await fetch(`${API_BASE}/categorias`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Error creando categoría');
  }
  
  return response.json();
}

export async function updateCategoria(id: number, data: Partial<CreateCategoriaInput>): Promise<Categoria> {
  const response = await fetch(`${API_BASE}/categorias`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, ...data }),
  });
  
  if (!response.ok) {
    throw new Error('Error actualizando categoría');
  }
  
  return response.json();
}

export async function deleteCategoria(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/categorias/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Error eliminando categoría');
  }
}
