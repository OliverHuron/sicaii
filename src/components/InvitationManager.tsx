import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Plus, Play, Pause, Mail, ExternalLink, Settings, Eye } from 'lucide-react';

interface EmailAccount {
  id: string;
  email: string;
  status: 'active' | 'processing' | 'completed' | 'error';
  inviteLink?: string;
  credits?: number;
}

export const InvitationManager = () => {
  const { toast } = useToast();
  const [emails, setEmails] = useState<EmailAccount[]>([
    { id: '1', email: 'user1@example.com', status: 'completed', inviteLink: 'https://app.example.com/invite/abc123', credits: 50 },
    { id: '2', email: 'user2@example.com', status: 'processing', inviteLink: 'https://app.example.com/invite/def456' },
    { id: '3', email: 'user3@example.com', status: 'active' }
  ]);
  const [newEmail, setNewEmail] = useState('');
  const [inviteUrl, setInviteUrl] = useState('https://app.example.com/register');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const addEmail = () => {
    if (!newEmail) return;
    
    const emailExists = emails.some(email => email.email === newEmail);
    if (emailExists) {
      toast({
        title: "Error",
        description: "Este email ya está en la lista",
        variant: "destructive",
      });
      return;
    }

    const newAccount: EmailAccount = {
      id: Date.now().toString(),
      email: newEmail,
      status: 'active'
    };
    
    setEmails([...emails, newAccount]);
    setNewEmail('');
    
    toast({
      title: "Email añadido",
      description: "La cuenta ha sido agregada exitosamente",
    });
  };

  const removeEmail = (id: string) => {
    setEmails(emails.filter(email => email.id !== id));
  };

  const startAutomation = () => {
    if (emails.length === 0) {
      toast({
        title: "Error",
        description: "Añade al menos un email para comenzar",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    
    // Simular proceso de automatización
    const activeEmails = emails.filter(email => email.status === 'active');
    let processed = 0;
    
    const interval = setInterval(() => {
      processed++;
      const progressPercent = (processed / activeEmails.length) * 100;
      setProgress(progressPercent);
      
      if (processed <= activeEmails.length) {
        // Actualizar estado del email actual
        setEmails(prev => prev.map(email => {
          if (email.status === 'active' && processed === activeEmails.findIndex(e => e.id === email.id) + 1) {
            return { 
              ...email, 
              status: 'processing' as const
            };
          }
          return email;
        }));
      }
      
      if (processed >= activeEmails.length) {
        clearInterval(interval);
        setIsProcessing(false);
        toast({
          title: "Proceso completado",
          description: `Se procesaron ${activeEmails.length} cuentas exitosamente`,
        });
      }
    }, 2000);
  };

  const stopAutomation = () => {
    setIsProcessing(false);
    toast({
      title: "Proceso detenido",
      description: "La automatización se ha pausado",
    });
  };

  const getStatusBadge = (status: EmailAccount['status']) => {
    const statusConfig = {
      active: { label: 'Activo', variant: 'secondary' as const },
      processing: { label: 'Procesando', variant: 'default' as const },
      completed: { label: 'Completado', variant: 'success' as const },
      error: { label: 'Error', variant: 'destructive' as const }
    };
    
    return statusConfig[status];
  };

  const totalCredits = emails.reduce((sum, email) => sum + (email.credits || 0), 0);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-glass backdrop-blur-sm border border-border/50">
            <Settings className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Gestor de Invitaciones</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Automatización de Registro
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Gestiona múltiples cuentas de email y automatiza el proceso de registro con enlaces de invitación
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-glass backdrop-blur-sm border-border/50 shadow-glass">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/20">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{emails.length}</p>
                <p className="text-sm text-muted-foreground">Total Cuentas</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-glass backdrop-blur-sm border-border/50 shadow-glass">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-success/20">
                <Eye className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{emails.filter(e => e.status === 'completed').length}</p>
                <p className="text-sm text-muted-foreground">Completadas</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-glass backdrop-blur-sm border-border/50 shadow-glass">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary-glow/20">
                <ExternalLink className="h-6 w-6 text-primary-glow" />
              </div>
              <div>
                <p className="text-2xl font-bold">{emails.filter(e => e.inviteLink).length}</p>
                <p className="text-sm text-muted-foreground">Con Enlaces</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-glass backdrop-blur-sm border-border/50 shadow-glass">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-secondary-glow/20">
                <Settings className="h-6 w-6 text-secondary-glow" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCredits}</p>
                <p className="text-sm text-muted-foreground">Créditos Total</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Configuration */}
        <Card className="p-8 bg-gradient-glass backdrop-blur-sm border-border/50 shadow-card">
          <h2 className="text-2xl font-semibold mb-6">Configuración</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">URL de Invitación</label>
                <Input
                  value={inviteUrl}
                  onChange={(e) => setInviteUrl(e.target.value)}
                  placeholder="https://app.example.com/register"
                  className="bg-card/50"
                />
              </div>
              <div className="flex gap-2">
                <Input
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="nuevo@email.com"
                  className="bg-card/50"
                  onKeyPress={(e) => e.key === 'Enter' && addEmail()}
                />
                <Button onClick={addEmail} variant="glass">
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir
                </Button>
              </div>
            </div>
            <div className="flex items-end">
              <div className="w-full space-y-4">
                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
                <div className="flex gap-2">
                  {!isProcessing ? (
                    <Button onClick={startAutomation} variant="hero" className="flex-1">
                      <Play className="h-4 w-4 mr-2" />
                      Iniciar Automatización
                    </Button>
                  ) : (
                    <Button onClick={stopAutomation} variant="destructive" className="flex-1">
                      <Pause className="h-4 w-4 mr-2" />
                      Pausar Proceso
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Email List */}
        <Card className="p-8 bg-gradient-glass backdrop-blur-sm border-border/50 shadow-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Cuentas de Email</h2>
            <Badge variant="outline" className="px-3 py-1">
              {emails.length} cuentas
            </Badge>
          </div>
          
          <div className="space-y-4">
            {emails.map((email) => (
              <div key={email.id} className="flex items-center justify-between p-4 bg-card/30 rounded-lg border border-border/30 hover:bg-card/50 transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-primary/20">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{email.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={getStatusBadge(email.status).variant as any}>
                        {getStatusBadge(email.status).label}
                      </Badge>
                      {email.inviteLink && (
                        <Badge variant="outline" className="text-xs">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Link obtenido
                        </Badge>
                      )}
                      {email.credits && (
                        <Badge variant="success" className="text-xs">
                          {email.credits} créditos
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {email.inviteLink && (
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEmail(email.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {emails.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay cuentas añadidas aún</p>
                <p className="text-sm">Añade tu primera cuenta de email para comenzar</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};