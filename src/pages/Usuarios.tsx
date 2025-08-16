import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Search, Edit, Trash2, Users, Eye } from "lucide-react";

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'user';
  cargo: string;
  dependencia: string;
  numero: string;
  telefono?: string;
  activo: boolean;
  fechaCreacion: string;
  ultimoAcceso?: string;
}

const mockUsuarios: Usuario[] = [
  {
    id: '1',
    nombre: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@empresa.com',
    rol: 'admin',
    cargo: 'Jefe de Sistemas',
    dependencia: 'Sistemas',
    numero: '1001',
    telefono: '+52 555 1234',
    activo: true,
    fechaCreacion: '2024-01-01',
    ultimoAcceso: '2024-01-15'
  },
  {
    id: '2',
    nombre: 'Ana Martínez',
    email: 'ana.martinez@empresa.com',
    rol: 'user',
    cargo: 'Coordinadora',
    dependencia: 'Administración',
    numero: '1002',
    telefono: '+52 555 5678',
    activo: true,
    fechaCreacion: '2024-01-05',
    ultimoAcceso: '2024-01-14'
  },
  {
    id: '3',
    nombre: 'Luis Gómez',
    email: 'luis.gomez@empresa.com',
    rol: 'user',
    cargo: 'Analista',
    dependencia: 'Recursos Humanos',
    numero: '1003',
    activo: true,
    fechaCreacion: '2024-01-10',
    ultimoAcceso: '2024-01-13'
  }
];

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rol: 'user',
    cargo: '',
    dependencia: '',
    numero: '',
    telefono: '',
    activo: true
  });

  const filteredUsuarios = usuarios.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.dependencia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUsuario) {
      // Update existing
      setUsuarios(prev => prev.map(user =>
        user.id === selectedUsuario.id
          ? { 
              ...user, 
              nombre: formData.nombre,
              email: formData.email,
              rol: formData.rol as 'admin' | 'user',
              cargo: formData.cargo,
              dependencia: formData.dependencia,
              numero: formData.numero,
              telefono: formData.telefono || undefined,
              activo: formData.activo
            }
          : user
      ));
    } else {
      // Add new
      const newUsuario: Usuario = {
        id: Date.now().toString(),
        nombre: formData.nombre,
        email: formData.email,
        rol: formData.rol as 'admin' | 'user',
        cargo: formData.cargo,
        dependencia: formData.dependencia,
        numero: formData.numero,
        telefono: formData.telefono || undefined,
        activo: formData.activo,
        fechaCreacion: new Date().toISOString().split('T')[0],
        ultimoAcceso: undefined
      };
      setUsuarios(prev => [...prev, newUsuario]);
    }
    setIsFormOpen(false);
    setSelectedUsuario(null);
    setFormData({
      nombre: '',
      email: '',
      rol: 'user',
      cargo: '',
      dependencia: '',
      numero: '',
      telefono: '',
      activo: true
    });
  };

  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      cargo: usuario.cargo,
      dependencia: usuario.dependencia,
      numero: usuario.numero,
      telefono: usuario.telefono || '',
      activo: usuario.activo
    });
    setIsFormOpen(true);
  };

  const handleView = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsViewOpen(true);
  };

  const handleDelete = (id: string) => {
    setUsuarios(prev => prev.filter(user => user.id !== id));
  };

  const handleAddNew = () => {
    setSelectedUsuario(null);
    setFormData({
      nombre: '',
      email: '',
      rol: 'user',
      cargo: '',
      dependencia: '',
      numero: '',
      telefono: '',
      activo: true
    });
    setIsFormOpen(true);
  };

  const toggleUserStatus = (id: string) => {
    setUsuarios(prev => prev.map(user =>
      user.id === id ? { ...user, activo: !user.activo } : user
    ));
  };

  const getRoleBadge = (rol: string) => {
    switch (rol) {
      case 'admin': return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Administrador</Badge>;
      case 'user': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Usuario</Badge>;
      default: return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const getStatusBadge = (activo: boolean) => {
    return activo 
      ? <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Activo</Badge>
      : <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Inactivo</Badge>;
  };

  const activeUsers = usuarios.filter(u => u.activo).length;
  const adminUsers = usuarios.filter(u => u.rol === 'admin').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Usuarios</h2>
          <p className="text-muted-foreground">Gestiona los usuarios del sistema</p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{usuarios.length}</p>
                <p className="text-sm text-muted-foreground">Total Usuarios</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeUsers}</p>
                <p className="text-sm text-muted-foreground">Usuarios Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{adminUsers}</p>
                <p className="text-sm text-muted-foreground">Administradores</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{usuarios.length - adminUsers}</p>
                <p className="text-sm text-muted-foreground">Usuarios Regulares</p>
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
              placeholder="Buscar usuarios..."
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
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Dependencia</TableHead>
                <TableHead>Número</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Último Acceso</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{usuario.nombre}</div>
                      <div className="text-sm text-muted-foreground">{usuario.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(usuario.rol)}</TableCell>
                  <TableCell>{usuario.cargo}</TableCell>
                  <TableCell>{usuario.dependencia}</TableCell>
                  <TableCell className="font-mono">{usuario.numero}</TableCell>
                  <TableCell>{getStatusBadge(usuario.activo)}</TableCell>
                  <TableCell>
                    {usuario.ultimoAcceso 
                      ? new Date(usuario.ultimoAcceso).toLocaleDateString()
                      : 'Nunca'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(usuario)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(usuario)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleUserStatus(usuario.id)}
                        className={usuario.activo ? "text-yellow-600" : "text-green-600"}
                      >
                        {usuario.activo ? "Desactivar" : "Activar"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(usuario.id)}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rol">Rol *</Label>
                <Select value={formData.rol} onValueChange={(value) => setFormData(prev => ({ ...prev, rol: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuario</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo *</Label>
                <Input
                  id="cargo"
                  value={formData.cargo}
                  onChange={(e) => setFormData(prev => ({ ...prev, cargo: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dependencia">Dependencia *</Label>
                <Select value={formData.dependencia} onValueChange={(value) => setFormData(prev => ({ ...prev, dependencia: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar dependencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sistemas">Sistemas</SelectItem>
                    <SelectItem value="Administración">Administración</SelectItem>
                    <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
                    <SelectItem value="Contabilidad">Contabilidad</SelectItem>
                    <SelectItem value="Ventas">Ventas</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero">Número *</Label>
                <Input
                  id="numero"
                  value={formData.numero}
                  onChange={(e) => setFormData(prev => ({ ...prev, numero: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {selectedUsuario ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Usuario</DialogTitle>
          </DialogHeader>
          {selectedUsuario && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre:</label>
                <p className="text-sm">{selectedUsuario.nombre}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email:</label>
                <p className="text-sm">{selectedUsuario.email}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rol:</label>
                <div>{getRoleBadge(selectedUsuario.rol)}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Estado:</label>
                <div>{getStatusBadge(selectedUsuario.activo)}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cargo:</label>
                <p className="text-sm">{selectedUsuario.cargo}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Dependencia:</label>
                <p className="text-sm">{selectedUsuario.dependencia}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Número:</label>
                <p className="text-sm font-mono">{selectedUsuario.numero}</p>
              </div>
              {selectedUsuario.telefono && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Teléfono:</label>
                  <p className="text-sm">{selectedUsuario.telefono}</p>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha de Creación:</label>
                <p className="text-sm">{new Date(selectedUsuario.fechaCreacion).toLocaleDateString()}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Último Acceso:</label>
                <p className="text-sm">
                  {selectedUsuario.ultimoAcceso 
                    ? new Date(selectedUsuario.ultimoAcceso).toLocaleDateString()
                    : 'Nunca'
                  }
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}