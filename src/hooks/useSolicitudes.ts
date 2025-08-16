import { useState, useEffect } from 'react';
import { Solicitud, CreateSolicitudInput, UpdateSolicitudStatusInput } from '../lib/api/types';
import * as solicitudesAPI from '../lib/api/solicitudes';

export function useSolicitudes() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSolicitudes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await solicitudesAPI.fetchSolicitudes();
      setSolicitudes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const createSolicitud = async (data: CreateSolicitudInput) => {
    try {
      const nueva = await solicitudesAPI.createSolicitud(data);
      setSolicitudes(prev => [nueva, ...prev]);
      return nueva;
    } catch (err) {
      throw err;
    }
  };

  const updateSolicitudStatus = async (data: UpdateSolicitudStatusInput) => {
    try {
      const actualizada = await solicitudesAPI.updateSolicitudStatus(data);
      setSolicitudes(prev => prev.map(sol => sol.id === data.id ? actualizada : sol));
      return actualizada;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  return {
    solicitudes,
    loading,
    error,
    refetch: fetchSolicitudes,
    createSolicitud,
    updateSolicitudStatus
  };
}
