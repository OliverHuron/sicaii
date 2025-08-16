import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InventoryFormProps {
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function InventoryForm({ initialData, onSave, onCancel }: InventoryFormProps) {
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    noPatrimonio: '',
    noSerie: '',
    categoria: '',
    dependencia: '',
    noFolio: '',
    estado: 'Disponible',
    fechaRecepcion: '',
    precio: '',
    descripcion: '',
    responsable: '',
    ubicacion: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        marca: initialData.marca || '',
        modelo: initialData.modelo || '',
        noPatrimonio: initialData.noPatrimonio || '',
        noSerie: initialData.noSerie || '',
        categoria: initialData.categoria || '',
        dependencia: initialData.dependencia || '',
        noFolio: initialData.noFolio || '',
        estado: initialData.estado || 'Disponible',
        fechaRecepcion: initialData.fechaRecepcion || '',
        precio: initialData.precio ? initialData.precio.toString() : '',
        descripcion: initialData.descripcion || '',
        responsable: initialData.responsable || '',
        ubicacion: initialData.ubicacion || ''
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      precio: formData.precio ? parseFloat(formData.precio) : undefined
    };
    onSave(submitData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="marca">Marca *</Label>
          <Input
            id="marca"
            value={formData.marca}
            onChange={(e) => handleChange('marca', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="modelo">Modelo *</Label>
          <Input
            id="modelo"
            value={formData.modelo}
            onChange={(e) => handleChange('modelo', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="noPatrimonio">No. Patrimonio *</Label>
          <Input
            id="noPatrimonio"
            value={formData.noPatrimonio}
            onChange={(e) => handleChange('noPatrimonio', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="noSerie">No. Serie *</Label>
          <Input
            id="noSerie"
            value={formData.noSerie}
            onChange={(e) => handleChange('noSerie', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="categoria">Categoría *</Label>
          <Select value={formData.categoria} onValueChange={(value) => handleChange('categoria', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Laptop">Laptop</SelectItem>
              <SelectItem value="Desktop">Desktop</SelectItem>
              <SelectItem value="Monitor">Monitor</SelectItem>
              <SelectItem value="Impresora">Impresora</SelectItem>
              <SelectItem value="Scanner">Scanner</SelectItem>
              <SelectItem value="Proyector">Proyector</SelectItem>
              <SelectItem value="Tablet">Tablet</SelectItem>
              <SelectItem value="Smartphone">Smartphone</SelectItem>
              <SelectItem value="Servidor">Servidor</SelectItem>
              <SelectItem value="Red">Equipo de Red</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dependencia">Dependencia *</Label>
          <Select value={formData.dependencia} onValueChange={(value) => handleChange('dependencia', value)}>
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
              <SelectItem value="Operaciones">Operaciones</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="noFolio">No. Folio *</Label>
          <Input
            id="noFolio"
            value={formData.noFolio}
            onChange={(e) => handleChange('noFolio', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="estado">Estado *</Label>
          <Select value={formData.estado} onValueChange={(value) => handleChange('estado', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Disponible">Disponible</SelectItem>
              <SelectItem value="En Uso">En Uso</SelectItem>
              <SelectItem value="En Reparación">En Reparación</SelectItem>
              <SelectItem value="Dado de Baja">Dado de Baja</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fechaRecepcion">Fecha de Recepción *</Label>
          <Input
            id="fechaRecepcion"
            type="date"
            value={formData.fechaRecepcion}
            onChange={(e) => handleChange('fechaRecepcion', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="precio">Precio (opcional)</Label>
          <Input
            id="precio"
            type="number"
            step="0.01"
            value={formData.precio}
            onChange={(e) => handleChange('precio', e.target.value)}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="responsable">Responsable</Label>
          <Input
            id="responsable"
            value={formData.responsable}
            onChange={(e) => handleChange('responsable', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ubicacion">Ubicación</Label>
          <Input
            id="ubicacion"
            value={formData.ubicacion}
            onChange={(e) => handleChange('ubicacion', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          value={formData.descripcion}
          onChange={(e) => handleChange('descripcion', e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {initialData ? 'Actualizar' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
}