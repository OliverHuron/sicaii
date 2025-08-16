// Tipos TypeScript para el API
export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    equipos: number;
  };
}

export interface Dependencia {
  id: number;
  nombre: string;
  descripcion?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    equipos: number;
    solicitudes: number;
  };
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'ADMIN' | 'OPERADOR' | 'VISITANTE';
  createdAt: string;
  updatedAt: string;
}

export interface Equipo {
  id: number;
  nombre: string;
  codigo: string;
  serie?: string;
  descripcion?: string;
  estado: 'DISPONIBLE' | 'EN_USO' | 'MANTENIMIENTO' | 'BAJA';
  categoriaId: number;
  dependenciaId?: number;
  categoria: Categoria;
  dependencia?: Dependencia;
  createdAt: string;
  updatedAt: string;
}

export interface SolicitudItem {
  id: number;
  equipoId: number;
  cantidad: number;
  equipo: Equipo;
}

export interface Solicitud {
  id: number;
  motivo?: string;
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'COMPLETADA' | 'CANCELADA';
  solicitanteId: number;
  aprobadorId?: number;
  dependenciaId?: number;
  solicitante: Usuario;
  aprobador?: Usuario;
  dependencia?: Dependencia;
  items: SolicitudItem[];
  createdAt: string;
  updatedAt: string;
}

// Tipos para formularios
export interface CreateCategoriaInput {
  nombre: string;
  descripcion?: string;
}

export interface CreateDependenciaInput {
  nombre: string;
  descripcion?: string;
}

export interface CreateEquipoInput {
  nombre: string;
  codigo: string;
  serie?: string;
  descripcion?: string;
  estado?: 'DISPONIBLE' | 'EN_USO' | 'MANTENIMIENTO' | 'BAJA';
  categoriaId: number;
  dependenciaId?: number;
}

export interface CreateSolicitudInput {
  motivo?: string;
  solicitanteId: number;
  dependenciaId?: number;
  items: Array<{
    equipoId: number;
    cantidad: number;
  }>;
}

export interface UpdateSolicitudStatusInput {
  id: number;
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'COMPLETADA' | 'CANCELADA';
  aprobadorId?: number;
}
