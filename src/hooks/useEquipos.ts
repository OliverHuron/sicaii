import { useState, useEffect } from 'react';
import { Equipo, CreateEquipoInput } from '../lib/api/types';
import * as equiposAPI from '../lib/api/equipos';

export function useEquipos() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await equiposAPI.fetchEquipos();
      setEquipos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const createEquipo = async (data: CreateEquipoInput) => {
    try {
      const nuevo = await equiposAPI.createEquipo(data);
      setEquipos(prev => [...prev, nuevo]);
      return nuevo;
    } catch (err) {
      throw err;
    }
  };

  const updateEquipo = async (id: number, data: Partial<CreateEquipoInput>) => {
    try {
      const actualizado = await equiposAPI.updateEquipo(id, data);
      setEquipos(prev => prev.map(eq => eq.id === id ? actualizado : eq));
      return actualizado;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchEquipos();
  }, []);

  return {
    equipos,
    loading,
    error,
    refetch: fetchEquipos,
    createEquipo,
    updateEquipo
  };
}
