import { useState, useEffect } from 'react';
import { Dependencia, CreateDependenciaInput } from '../lib/api/types';
import * as dependenciasAPI from '../lib/api/dependencias';

export function useDependencias() {
  const [dependencias, setDependencias] = useState<Dependencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDependencias = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dependenciasAPI.fetchDependencias();
      setDependencias(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const createDependencia = async (data: CreateDependenciaInput) => {
    try {
      const nueva = await dependenciasAPI.createDependencia(data);
      setDependencias(prev => [...prev, nueva]);
      return nueva;
    } catch (err) {
      throw err;
    }
  };

  const updateDependencia = async (id: number, data: Partial<CreateDependenciaInput>) => {
    try {
      const actualizada = await dependenciasAPI.updateDependencia(id, data);
      setDependencias(prev => prev.map(dep => dep.id === id ? actualizada : dep));
      return actualizada;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchDependencias();
  }, []);

  return {
    dependencias,
    loading,
    error,
    refetch: fetchDependencias,
    createDependencia,
    updateDependencia
  };
}
