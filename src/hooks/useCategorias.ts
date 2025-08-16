import { useState, useEffect } from 'react';
import { Categoria, CreateCategoriaInput } from '../lib/api/types';
import * as categoriasAPI from '../lib/api/categorias';

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriasAPI.fetchCategorias();
      setCategorias(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const createCategoria = async (data: CreateCategoriaInput) => {
    try {
      const nueva = await categoriasAPI.createCategoria(data);
      setCategorias(prev => [...prev, nueva]);
      return nueva;
    } catch (err) {
      throw err;
    }
  };

  const updateCategoria = async (id: number, data: Partial<CreateCategoriaInput>) => {
    try {
      const actualizada = await categoriasAPI.updateCategoria(id, data);
      setCategorias(prev => prev.map(cat => cat.id === id ? actualizada : cat));
      return actualizada;
    } catch (err) {
      throw err;
    }
  };

  const deleteCategoria = async (id: number) => {
    try {
      await categoriasAPI.deleteCategoria(id);
      setCategorias(prev => prev.filter(cat => cat.id !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  return {
    categorias,
    loading,
    error,
    refetch: fetchCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria
  };
}
