import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  Building2,
  Tags,
  Users,
  TrendingUp
} from "lucide-react";

export default function Dashboard() {
  const { user, isAdmin } = useAuth();

  const stats = [
    {
      title: "Total Inventarios",
      value: "1,234",
      icon: Package,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      change: "+12%"
    },
    {
      title: "Solicitudes Pendientes",
      value: "28",
      icon: FileText,
      color: "bg-gradient-to-r from-yellow-500 to-yellow-600",
      change: "+5%"
    },
    {
      title: "Equipos en Reparación",
      value: "15",
      icon: AlertTriangle,
      color: "bg-gradient-to-r from-red-500 to-red-600",
      change: "-3%"
    },
    {
      title: "Equipos Disponibles",
      value: "892",
      icon: CheckCircle,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      change: "+8%"
    }
  ];

  const adminStats = [
    {
      title: "Dependencias",
      value: "12",
      icon: Building2,
      color: "bg-gradient-to-r from-purple-500 to-purple-600"
    },
    {
      title: "Categorías",
      value: "8",
      icon: Tags,
      color: "bg-gradient-to-r from-indigo-500 to-indigo-600"
    },
    {
      title: "Usuarios",
      value: "45",
      icon: Users,
      color: "bg-gradient-to-r from-pink-500 to-pink-600"
    }
  ];

  const recentActivities = [
    { type: "Solicitud", description: "Nueva solicitud de mantenimiento - Computadora #001", time: "Hace 5 min", status: "pending" },
    { type: "Inventario", description: "Equipo agregado - Impresora HP LaserJet", time: "Hace 15 min", status: "success" },
    { type: "Solicitud", description: "Solicitud completada - Reparación Monitor #045", time: "Hace 1 hora", status: "completed" },
    { type: "Usuario", description: "Nuevo usuario registrado - Juan Pérez", time: "Hace 2 horas", status: "info" }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pendiente</Badge>;
      case 'success': return <Badge variant="outline" className="text-green-600 border-green-600">Exitoso</Badge>;
      case 'completed': return <Badge variant="outline" className="text-blue-600 border-blue-600">Completado</Badge>;
      case 'info': return <Badge variant="outline" className="text-purple-600 border-purple-600">Info</Badge>;
      default: return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Bienvenido, {user?.name} - {user?.cargo}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden">
            <CardContent className="p-0">
              <div className={`${stat.color} p-4 text-white`}>
                <div className="flex items-center justify-between">
                  <stat.icon className="h-6 w-6" />
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-xs">{stat.change}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Admin Only Stats */}
      {isAdmin && (
        <div className="grid gap-4 md:grid-cols-3">
          {adminStats.map((stat) => (
            <Card key={stat.title} className="overflow-hidden">
              <CardContent className="p-0">
                <div className={`${stat.color} p-4 text-white`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="p-4">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Actividades Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary">{activity.type}</Badge>
                    {getStatusBadge(activity.status)}
                  </div>
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}