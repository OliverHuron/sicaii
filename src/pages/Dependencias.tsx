import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Search, Edit, Trash2, Building2 } from "lucide-react";

interface Dependencia {
  id: string;
  nombre: string;
  responsable: string;
  contacto: string;
  ubicacion: string;
  usuarios: number;
  solicitudes: number;
  descripcion?: string;
}

const mockDependencias: Dependencia[] = [
  {
    id: '1',
    nombre: 'Sistemas',
    responsable: 'Carlos Rodríguez',
    contacto: 'carlos.rodriguez@empresa.com',
    ubicacion: 'Edificio A, Piso 3',
    usuarios: 5,
    solicitudes: 12,
    descripcion: 'Departamento de tecnologías de la información'
  },
  {
    id: '2',
    nombre: 'Administración',
    responsable: 'Ana Martínez',
    contacto: 'ana.martinez@empresa.com',
    ubicacion: 'Edificio A, Piso 1',
    usuarios: 8,
    solicitudes: 25,
    descripcion: 'Departamento administrativo general'
  },
  {
    id: '3',
    nombre: 'Recursos Humanos',
    responsable: 'Luis Gómez',
    contacto: 'luis.gomez@empresa.com',
    ubicacion: 'Edificio B, Piso 2',
    usuarios: 3,
    solicitudes: 8,
    descripcion: 'Gestión de talento humano'
  }
];

export default function Dependencias() {
  const [dependencias, setDependencias] = useState<Dependencia[]>(mockDependencias);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDependencia, setSelectedDependencia] = useState<Dependencia | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    responsable: '',
    contacto: '',
    ubicacion: '',
    descripcion: ''
  });

  const filteredDependencias = dependencias.filter(dep =>
    dep.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dep.responsable.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dep.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDependencia) {
      // Update existing
      setDependencias(prev => prev.map(dep =>
        dep.id === selectedDependencia.id
          ? { ...dep, ...formData }
          : dep
      ));
    } else {
      // Add new
      const newDependencia: Dependencia = {
        id: Date.now().toString(),
        ...formData,
        usuarios: 0,
        solicitudes: 0
      };
      setDependencias(prev => [...prev, newDependencia]);
    }
    setIsFormOpen(false);
    setSelectedDependencia(null);
    setFormData({ nombre: '', responsable: '', contacto: '', ubicacion: '', descripcion: '' });
  };

  const handleEdit = (dependencia: Dependencia) => {
    setSelectedDependencia(dependencia);
    setFormData({
      nombre: dependencia.nombre,
      responsable: dependencia.responsable,
      contacto: dependencia.contacto,
      ubicacion: dependencia.ubicacion,
      descripcion: dependencia.descripcion || ''
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setDependencias(prev => prev.filter(dep => dep.id !== id));
  };

  const handleAddNew = () => {
    setSelectedDependencia(null);
    setFormData({ nombre: '', responsable: '', contacto: '', ubicacion: '', descripcion: '' });
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dependencias</h2>
          <p className="text-muted-foreground">Gestiona las coordinaciones y departamentos</p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Dependencia
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{dependencias.length}</p>
                <p className="text-sm text-muted-foreground">Total Dependencias</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{dependencias.reduce((acc, dep) => acc + dep.usuarios, 0)}</p>
                <p className="text-sm text-muted-foreground">Total Usuarios</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{dependencias.reduce((acc, dep) => acc + dep.solicitudes, 0)}</p>
                <p className="text-sm text-muted-foreground">Total Solicitudes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Buscar dependencias..."
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
                <TableHead>Nombre</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Usuarios</TableHead>
                <TableHead>Solicitudes</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDependencias.map((dependencia) => (
                <TableRow key={dependencia.id}>
                  <TableCell className="font-medium">{dependencia.nombre}</TableCell>
                  <TableCell>{dependencia.responsable}</TableCell>
                  <TableCell>{dependencia.contacto}</TableCell>
                  <TableCell>{dependencia.ubicacion}</TableCell>
                  <TableCell>{dependencia.usuarios}</TableCell>
                  <TableCell>{dependencia.solicitudes}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(dependencia)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(dependencia.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDependencia ? 'Editar Dependencia' : 'Nueva Dependencia'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsable">Responsable *</Label>
              <Input
                id="responsable"
                value={formData.responsable}
                onChange={(e) => setFormData(prev => ({ ...prev, responsable: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contacto">Contacto *</Label>
              <Input
                id="contacto"
                type="email"
                value={formData.contacto}
                onChange={(e) => setFormData(prev => ({ ...prev, contacto: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ubicacion">Ubicación *</Label>
              <Input
                id="ubicacion"
                value={formData.ubicacion}
                onChange={(e) => setFormData(prev => ({ ...prev, ubicacion: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {selectedDependencia ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}