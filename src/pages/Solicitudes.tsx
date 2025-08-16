import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search, Edit, Eye } from "lucide-react";

interface Solicitud {
  id: string;
  tipo: 'Reparación' | 'Mantenimiento' | 'Requerimiento' | 'Asistencia Técnica';
  descripcion: string;
  usuario: string;
  dependencia: string;
  estado: 'Pendiente' | 'En Proceso' | 'Completada' | 'Rechazada';
  prioridad: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  fechaCreacion: string;
  fechaActualizacion: string;
}

const mockSolicitudes: Solicitud[] = [
  {
    id: '1',
    tipo: 'Reparación',
    descripcion: 'La computadora no enciende, necesita revisión técnica',
    usuario: 'Juan Pérez',
    dependencia: 'Administración',
    estado: 'Pendiente',
    prioridad: 'Alta',
    fechaCreacion: '2024-01-15',
    fechaActualizacion: '2024-01-15'
  },
  {
    id: '2',
    tipo: 'Mantenimiento',
    descripcion: 'Limpieza preventiva de impresora',
    usuario: 'María García',
    dependencia: 'Recursos Humanos',
    estado: 'En Proceso',
    prioridad: 'Media',
    fechaCreacion: '2024-01-10',
    fechaActualizacion: '2024-01-12'
  }
];

export default function Solicitudes() {
  const { isAdmin } = useAuth();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>(mockSolicitudes);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
  const [formData, setFormData] = useState({
    tipo: '',
    descripcion: '',
    prioridad: 'Media',
    estado: 'Pendiente'
  });

  const filteredSolicitudes = solicitudes.filter(solicitud =>
    solicitud.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    solicitud.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    solicitud.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'Pendiente': return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pendiente</Badge>;
      case 'En Proceso': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">En Proceso</Badge>;
      case 'Completada': return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completada</Badge>;
      case 'Rechazada': return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Rechazada</Badge>;
      default: return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const getPriorityBadge = (prioridad: string) => {
    switch (prioridad) {
      case 'Baja': return <Badge variant="outline" className="text-green-600 border-green-600">Baja</Badge>;
      case 'Media': return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Media</Badge>;
      case 'Alta': return <Badge variant="outline" className="text-orange-600 border-orange-600">Alta</Badge>;
      case 'Crítica': return <Badge variant="outline" className="text-red-600 border-red-600">Crítica</Badge>;
      default: return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSolicitud: Solicitud = {
      id: Date.now().toString(),
      tipo: formData.tipo as any,
      descripcion: formData.descripcion,
      usuario: 'Usuario Actual', // En implementación real, obtener del contexto
      dependencia: 'Dependencia del Usuario', // En implementación real, obtener del contexto
      estado: 'Pendiente',
      prioridad: formData.prioridad as any,
      fechaCreacion: new Date().toISOString().split('T')[0],
      fechaActualizacion: new Date().toISOString().split('T')[0]
    };
    setSolicitudes(prev => [...prev, newSolicitud]);
    setIsFormOpen(false);
    setFormData({ tipo: '', descripcion: '', prioridad: 'Media', estado: 'Pendiente' });
  };

  const updateSolicitud = (id: string, updates: Partial<Solicitud>) => {
    setSolicitudes(prev => prev.map(s => 
      s.id === id 
        ? { ...s, ...updates, fechaActualizacion: new Date().toISOString().split('T')[0] }
        : s
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Solicitudes</h2>
          <p className="text-muted-foreground">
            {isAdmin ? 'Gestiona todas las solicitudes del sistema' : 'Envía y gestiona tus solicitudes'}
          </p>
        </div>
        {!isAdmin && (
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nueva Solicitud
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nueva Solicitud</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Solicitud *</Label>
                  <Select value={formData.tipo} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Reparación">Reparación</SelectItem>
                      <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                      <SelectItem value="Requerimiento">Requerimiento de Equipo</SelectItem>
                      <SelectItem value="Asistencia Técnica">Asistencia Técnica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción *</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                    required
                    rows={4}
                    placeholder="Describe detalladamente tu solicitud..."
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Enviar Solicitud</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Buscar solicitudes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Descripción</TableHead>
                {isAdmin && <TableHead>Usuario</TableHead>}
                {isAdmin && <TableHead>Dependencia</TableHead>}
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSolicitudes.map((solicitud) => (
                <TableRow key={solicitud.id}>
                  <TableCell>
                    <Badge variant="secondary">{solicitud.tipo}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={solicitud.descripcion}>
                      {solicitud.descripcion}
                    </div>
                  </TableCell>
                  {isAdmin && <TableCell>{solicitud.usuario}</TableCell>}
                  {isAdmin && <TableCell>{solicitud.dependencia}</TableCell>}
                  <TableCell>{getStatusBadge(solicitud.estado)}</TableCell>
                  <TableCell>{getPriorityBadge(solicitud.prioridad)}</TableCell>
                  <TableCell>{new Date(solicitud.fechaCreacion).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {isAdmin && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedSolicitud(solicitud)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Actualizar Solicitud</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Estado</Label>
                                  <Select 
                                    value={selectedSolicitud?.estado} 
                                    onValueChange={(value) => selectedSolicitud && updateSolicitud(selectedSolicitud.id, { estado: value as any })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                                      <SelectItem value="En Proceso">En Proceso</SelectItem>
                                      <SelectItem value="Completada">Completada</SelectItem>
                                      <SelectItem value="Rechazada">Rechazada</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Prioridad</Label>
                                  <Select 
                                    value={selectedSolicitud?.prioridad} 
                                    onValueChange={(value) => selectedSolicitud && updateSolicitud(selectedSolicitud.id, { prioridad: value as any })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Baja">Baja</SelectItem>
                                      <SelectItem value="Media">Media</SelectItem>
                                      <SelectItem value="Alta">Alta</SelectItem>
                                      <SelectItem value="Crítica">Crítica</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Descripción</Label>
                                <p className="text-sm bg-muted p-3 rounded">{selectedSolicitud?.descripcion}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}