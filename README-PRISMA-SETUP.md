# SICAII - Sistema de Inventarios con Prisma y NeonDB

## 🚀 Configuración completada

### Variables de entorno requeridas

1. **En Netlify (Site settings > Environment variables):**
   ```
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require&pgbouncer=true
   DATABASE_URL_UNPOOLED=postgresql://user:password@host/database?sslmode=require
   ```

2. **En tu archivo `.env` local:**
   ```
   DATABASE_URL="postgresql://user:password@host/database?sslmode=require&pgbouncer=true"
   ```

### ✅ Archivos creados:

- `prisma/schema.prisma` - Esquema de base de datos completo
- `netlify.toml` - Configuración de Netlify
- `netlify/functions/` - APIs serverless para:
  - categorias.ts
  - solicitudes.ts  
  - equipos.ts
  - dependencias.ts
  - prismaClient.ts (cliente reutilizable)
- `src/lib/api/` - Servicios frontend para consumir APIs
- `src/hooks/` - Hooks personalizados para React
- Scripts de Prisma añadidos al `package.json`

## 🔧 Comandos importantes

### Configuración inicial (una vez):
```bash
# Ya completado - solo por referencia
npm install -D prisma @netlify/functions @types/node
npm install @prisma/client
npx prisma generate
```

### Para crear la base de datos:
```bash
# Opción 1: Push directo (desarrollo)
npx prisma db push

# Opción 2: Migración formal (recomendado)
npx prisma migrate dev --name init
```

### Comandos de desarrollo:
```bash
# Generar cliente Prisma
npm run prisma:generate

# Ver datos en navegador
npm run prisma:studio

# Desarrollo local
npm run dev
```

## 📊 Estructura de la base de datos

### Tablas principales:
- **categorias** - Categorías de equipos
- **dependencias** - Dependencias/departamentos  
- **equipos** - Inventario de equipos
- **users** - Usuarios del sistema
- **permisos** - Sistema de permisos
- **solicitudes** - Solicitudes de equipos (NUEVA)
- **solicitud_items** - Items de cada solicitud (NUEVA)
- **usuario_permisos** - Relación usuarios-permisos

### Estados disponibles:
- **Equipos:** DISPONIBLE, EN_USO, MANTENIMIENTO, BAJA
- **Solicitudes:** PENDIENTE, APROBADA, RECHAZADA, COMPLETADA, CANCELADA
- **Usuarios:** ADMIN, OPERADOR, VISITANTE

## 🌐 Endpoints API disponibles

### Categorías
- `GET /.netlify/functions/categorias` - Listar todas
- `POST /.netlify/functions/categorias` - Crear nueva
- `PUT /.netlify/functions/categorias` - Actualizar
- `DELETE /.netlify/functions/categorias/{id}` - Eliminar

### Solicitudes  
- `GET /.netlify/functions/solicitudes` - Listar todas
- `POST /.netlify/functions/solicitudes` - Crear nueva
- `PATCH /.netlify/functions/solicitudes` - Actualizar estado

### Equipos
- `GET /.netlify/functions/equipos` - Listar todos
- `POST /.netlify/functions/equipos` - Crear nuevo
- `PUT /.netlify/functions/equipos` - Actualizar

### Dependencias
- `GET /.netlify/functions/dependencias` - Listar todas
- `POST /.netlify/functions/dependencias` - Crear nueva
- `PUT /.netlify/functions/dependencias` - Actualizar

## 🔌 Cómo usar en componentes React

### Ejemplo básico con hook:
```tsx
import { useCategorias } from '@/hooks/useCategorias';

export function MiComponente() {
  const { categorias, loading, error, createCategoria } = useCategorias();
  
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {categorias.map(cat => (
        <div key={cat.id}>{cat.nombre}</div>
      ))}
    </div>
  );
}
```

### Ejemplo de creación de solicitud:
```tsx
import { useSolicitudes } from '@/hooks/useSolicitudes';

const { createSolicitud } = useSolicitudes();

const handleCrearSolicitud = async () => {
  await createSolicitud({
    motivo: "Necesito laptop para trabajo remoto",
    solicitanteId: 1,
    dependenciaId: 2,
    items: [
      { equipoId: 5, cantidad: 1 },
      { equipoId: 8, cantidad: 2 }
    ]
  });
};
```

## 🚨 Pasos siguientes

1. **Actualizar tus variables de entorno:**
   - Ve a Netlify dashboard > tu sitio > Site settings > Environment variables
   - Corrige `NETLFY_DATABASE_URL` → `DATABASE_URL`
   - Añade tu URL real de NeonDB

2. **Crear las tablas:**
   ```bash
   npx prisma db push
   ```

3. **Poblar datos iniciales** (opcional):
   ```bash
   npx prisma studio
   # O crear un archivo seed.ts
   ```

4. **Actualizar componentes:**
   - Reemplaza datos mock con hooks reales
   - Usa los tipos TypeScript incluidos
   - Maneja estados de loading/error

5. **Desplegar:**
   ```bash
   npm run build
   # Push a GitHub para deploy automático en Netlify
   ```

## 🛠️ Resolución de problemas

### Error "Cannot find module '@prisma/client'":
```bash
npx prisma generate
```

### Error de conexión a la BD:
- Verifica que DATABASE_URL esté bien configurada
- Asegúrate de que incluya `sslmode=require`
- Para Neon, usa la URL de "Pooled connection"

### Error en Netlify Functions:
- Verifica que `netlify.toml` esté en la raíz
- Asegúrate de que las funciones estén en `netlify/functions/`
- Revisa logs en Netlify dashboard

### Error de CORS:
- Las funciones ya incluyen headers CORS
- Si persiste, verifica la URL de las peticiones

## 📝 Estructura de archivos final

```
SICAII/
├── prisma/
│   └── schema.prisma
├── netlify/
│   └── functions/
│       ├── prismaClient.ts
│       ├── categorias.ts
│       ├── solicitudes.ts
│       ├── equipos.ts
│       └── dependencias.ts
├── src/
│   ├── lib/api/
│   │   ├── types.ts
│   │   ├── categorias.ts
│   │   ├── solicitudes.ts
│   │   ├── equipos.ts
│   │   └── dependencias.ts
│   └── hooks/
│       ├── useCategorias.ts
│       └── useSolicitudes.ts
├── .env
├── netlify.toml
└── package.json
```

¡Tu sistema de inventarios ahora está conectado a NeonDB con Prisma! 🎉
