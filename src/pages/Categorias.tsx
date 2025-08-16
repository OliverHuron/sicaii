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
import { Plus, Search, Edit, Trash2, Tags } from "lucide-react";

interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  equipos: number;
  color: string;
}

const mockCategorias: Categoria[] = [
  {
    id: '1',
    nombre: 'Laptop',
    descripcion: 'Computadoras portátiles para trabajo móvil',
    equipos: 45,
    color: '#3B82F6'
  },
  {
    id: '2',
    nombre: 'Desktop',
    descripcion: 'Computadoras de escritorio para oficina',
    equipos: 32,
    color: '#10B981'
  },
  {
    id: '3',
    nombre: 'Monitor',
    descripcion: 'Pantallas y monitores para computadoras',
    equipos: 78,
    color: '#8B5CF6'
  },
  {
    id: '4',
    nombre: 'Impresora',
    descripcion: 'Impresoras y equipos de impresión',
    equipos: 15,
    color: '#F59E0B'
  },
  {
    id: '5',
    nombre: 'Proyector',
    descripcion: 'Proyectores para presentaciones',
    equipos: 8,
    color: '#EF4444'
  }
];

const availableColors = [
  '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
];

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>(mockCategorias);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    color: availableColors[0]
  });

  const filteredCategorias = categorias.filter(cat =>
    cat.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategoria) {
      // Update existing
      setCategorias(prev => prev.map(cat =>
        cat.id === selectedCategoria.id
          ? { ...cat, ...formData }
          : cat
      ));
    } else {
      // Add new
      const newCategoria: Categoria = {
        id: Date.now().toString(),
        ...formData,
        equipos: 0
      };
      setCategorias(prev => [...prev, newCategoria]);
    }
    setIsFormOpen(false);
    setSelectedCategoria(null);
    setFormData({ nombre: '', descripcion: '', color: availableColors[0] });
  };

  const handleEdit = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setFormData({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      color: categoria.color
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setCategorias(prev => prev.filter(cat => cat.id !== id));
  };

  const handleAddNew = () => {
    setSelectedCategoria(null);
    setFormData({ nombre: '', descripcion: '', color: availableColors[0] });
    setIsFormOpen(true);
  };

  const totalEquipos = categorias.reduce((acc, cat) => acc + cat.equipos, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categorías</h2>
          <p className="text-muted-foreground">Gestiona los tipos de equipos del inventario</p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Tags className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{categorias.length}</p>
                <p className="text-sm text-muted-foreground">Total Categorías</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Tags className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalEquipos}</p>
                <p className="text-sm text-muted-foreground">Total Equipos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Tags className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Math.round(totalEquipos / categorias.length)}</p>
                <p className="text-sm text-muted-foreground">Promedio por Categoría</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCategorias.map((categoria) => (
          <Card key={categoria.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: categoria.color }}
                  />
                  <h3 className="font-semibold">{categoria.nombre}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(categoria)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(categoria.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{categoria.descripcion}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{categoria.equipos}</span>
                <span className="text-sm text-muted-foreground">equipos</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Buscar categorías..."
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
                <TableHead>Categoría</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Equipos</TableHead>
                <TableHead>Porcentaje</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategorias.map((categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: categoria.color }}
                      />
                      <span className="font-medium">{categoria.nombre}</span>
                    </div>
                  </TableCell>
                  <TableCell>{categoria.descripcion}</TableCell>
                  <TableCell>{categoria.equipos}</TableCell>
                  <TableCell>
                    {totalEquipos > 0 ? ((categoria.equipos / totalEquipos) * 100).toFixed(1) : 0}%
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(categoria)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(categoria.id)}
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
              {selectedCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
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
              <Label htmlFor="descripcion">Descripción *</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                required
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-12 h-8 border border-input rounded cursor-pointer"
                />
                <span className="text-sm text-muted-foreground">{formData.color}</span>
              </div>
              <div className="flex gap-2 mt-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-gray-500"
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {selectedCategoria ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}