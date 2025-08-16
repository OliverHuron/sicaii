import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { InventoryForm } from "@/components/InventoryForm";

interface Inventory {
  id: string;
  marca: string;
  modelo: string;
  noPatrimonio: string;
  noSerie: string;
  categoria: string;
  dependencia: string;
  noFolio: string;
  estado: 'Disponible' | 'En Uso' | 'En Reparación' | 'Dado de Baja';
  fechaRecepcion: string;
  fechaActualizacion: string;
  precio?: number;
  descripcion?: string;
  responsable?: string;
  ubicacion?: string;
}

const mockInventory: Inventory[] = [
  {
    id: '1',
    marca: 'HP',
    modelo: 'EliteBook 840',
    noPatrimonio: 'PAT001',
    noSerie: 'SN12345',
    categoria: 'Laptop',
    dependencia: 'Sistemas',
    noFolio: 'FOL001',
    estado: 'Disponible',
    fechaRecepcion: '2024-01-15',
    fechaActualizacion: '2024-01-15',
    precio: 15000,
    descripcion: 'Laptop corporativa con Windows 11',
    responsable: 'Juan Pérez',
    ubicacion: 'Oficina 201'
  },
  {
    id: '2',
    marca: 'Canon',
    modelo: 'PIXMA G3110',
    noPatrimonio: 'PAT002',
    noSerie: 'SN67890',
    categoria: 'Impresora',
    dependencia: 'Administración',
    noFolio: 'FOL002',
    estado: 'En Uso',
    fechaRecepcion: '2024-01-10',
    fechaActualizacion: '2024-01-20',
    precio: 3500,
    descripcion: 'Impresora multifuncional a color',
    responsable: 'María García',
    ubicacion: 'Recepción'
  }
];

export default function Inventarios() {
  const [inventory, setInventory] = useState<Inventory[]>(mockInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const filteredInventory = inventory.filter(item =>
    item.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.noPatrimonio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'Disponible': return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Disponible</Badge>;
      case 'En Uso': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">En Uso</Badge>;
      case 'En Reparación': return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">En Reparación</Badge>;
      case 'Dado de Baja': return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Dado de Baja</Badge>;
      default: return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const handleSave = (data: Partial<Inventory>) => {
    if (selectedItem) {
      // Update existing item
      setInventory(prev => prev.map(item => 
        item.id === selectedItem.id 
          ? { ...item, ...data, fechaActualizacion: new Date().toISOString().split('T')[0] }
          : item
      ));
    } else {
      // Add new item
      const newItem: Inventory = {
        id: Date.now().toString(),
        marca: data.marca || '',
        modelo: data.modelo || '',
        noPatrimonio: data.noPatrimonio || '',
        noSerie: data.noSerie || '',
        categoria: data.categoria || '',
        dependencia: data.dependencia || '',
        noFolio: data.noFolio || '',
        estado: data.estado || 'Disponible',
        fechaRecepcion: data.fechaRecepcion || new Date().toISOString().split('T')[0],
        fechaActualizacion: new Date().toISOString().split('T')[0],
        precio: data.precio,
        descripcion: data.descripcion,
        responsable: data.responsable,
        ubicacion: data.ubicacion
      };
      setInventory(prev => [...prev, newItem]);
    }
    setIsFormOpen(false);
    setSelectedItem(null);
  };

  const handleDelete = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  const handleEdit = (item: Inventory) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleView = (item: Inventory) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const handleAddNew = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventarios</h2>
          <p className="text-muted-foreground">Gestiona todos los equipos del inventario</p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Agregar Equipo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Buscar por marca, modelo, patrimonio o categoría..."
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
                <TableHead>Marca/Modelo</TableHead>
                <TableHead>No. Patrimonio</TableHead>
                <TableHead>No. Serie</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Dependencia</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Recepción</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.marca}</div>
                      <div className="text-sm text-muted-foreground">{item.modelo}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">{item.noPatrimonio}</TableCell>
                  <TableCell className="font-mono text-sm">{item.noSerie}</TableCell>
                  <TableCell>{item.categoria}</TableCell>
                  <TableCell>{item.dependencia}</TableCell>
                  <TableCell>{getStatusBadge(item.estado)}</TableCell>
                  <TableCell>{new Date(item.fechaRecepcion).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'Editar Equipo' : 'Agregar Nuevo Equipo'}
            </DialogTitle>
          </DialogHeader>
          <InventoryForm
            initialData={selectedItem}
            onSave={handleSave}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Equipo</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Marca:</label>
                <p className="text-sm">{selectedItem.marca}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Modelo:</label>
                <p className="text-sm">{selectedItem.modelo}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">No. Patrimonio:</label>
                <p className="text-sm font-mono">{selectedItem.noPatrimonio}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">No. Serie:</label>
                <p className="text-sm font-mono">{selectedItem.noSerie}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoría:</label>
                <p className="text-sm">{selectedItem.categoria}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Dependencia:</label>
                <p className="text-sm">{selectedItem.dependencia}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">No. Folio:</label>
                <p className="text-sm">{selectedItem.noFolio}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Estado:</label>
                <div>{getStatusBadge(selectedItem.estado)}</div>
              </div>
              {selectedItem.precio && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Precio:</label>
                  <p className="text-sm">${selectedItem.precio.toLocaleString()}</p>
                </div>
              )}
              {selectedItem.responsable && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Responsable:</label>
                  <p className="text-sm">{selectedItem.responsable}</p>
                </div>
              )}
              {selectedItem.descripcion && (
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Descripción:</label>
                  <p className="text-sm">{selectedItem.descripcion}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}