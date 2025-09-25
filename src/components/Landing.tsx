import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Snowflake, 
  BarChart3, 
  Shield, 
  Clock, 
  Users, 
  Package,
  ArrowRight,
  CheckCircle,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Snowflake className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Cold Stock
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-primary shadow-cold hover:shadow-frost transition-all duration-300">
                  Comenzar Gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-arctic">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 animate-pulse-glow">
              <Zap className="h-4 w-4 mr-2" />
              Gestión Inteligente de Inventarios
            </Badge>
            <h1 className="text-5xl font-bold mb-6 animate-slide-up">
              Control Total de tu Inventario con{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Caducidad Inteligente
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-slide-up">
              Optimiza tu gestión de stock con dashboards interactivos, 
              alertas de vencimiento automáticas y control en tiempo real.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-primary shadow-frost hover:shadow-glow transition-all duration-300">
                  <Package className="mr-2 h-5 w-5" />
                  Empezar Ahora
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/10">
                <BarChart3 className="mr-2 h-5 w-5" />
                Ver Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Todo lo que necesitas para gestionar tu inventario
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Herramientas profesionales diseñadas para simplificar la gestión de stock
              y mantener control total sobre fechas de caducidad.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-cold transition-all duration-300 animate-float group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-cold rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Control de Caducidad</CardTitle>
                <CardDescription>
                  Alertas automáticas y seguimiento de fechas de vencimiento para evitar pérdidas.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-cold transition-all duration-300 animate-float group" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-cold rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Dashboard Interactivo</CardTitle>
                <CardDescription>
                  Visualización en tiempo real de métricas importantes y estadísticas de inventario.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-cold transition-all duration-300 animate-float group" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-cold rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Gestión de Equipos</CardTitle>
                <CardDescription>
                  Roles diferenciados para administradores y operarios con permisos específicos.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-cold transition-all duration-300 animate-float group" style={{ animationDelay: '0.6s' }}>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-cold rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Seguridad Avanzada</CardTitle>
                <CardDescription>
                  Acceso controlado con autenticación segura y protección de datos empresariales.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-cold transition-all duration-300 animate-float group" style={{ animationDelay: '0.8s' }}>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-cold rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Trazabilidad Completa</CardTitle>
                <CardDescription>
                  Seguimiento detallado de movimientos, lotes y historial de cambios.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-cold transition-all duration-300 animate-float group" style={{ animationDelay: '1s' }}>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-cold rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Configuración Rápida</CardTitle>
                <CardDescription>
                  Implementación inmediata sin complicaciones técnicas ni capacitación extensa.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-cold">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Beneficios que transformarán tu negocio
              </h2>
              <div className="space-y-4">
                {[
                  "Reducción del desperdicio por productos vencidos",
                  "Mayor eficiencia en la gestión de stock",
                  "Alertas proactivas de caducidad",
                  "Reportes detallados y análisis de tendencias",
                  "Control de acceso por roles de usuario",
                  "Interfaz intuitiva y fácil de usar"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-frost">
              <h3 className="text-xl font-semibold mb-6 text-center">
                ¿Listo para comenzar?
              </h3>
              <div className="space-y-4">
                <Link to="/register" className="block">
                  <Button className="w-full bg-gradient-primary shadow-cold hover:shadow-frost">
                    Crear Cuenta Gratis
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground text-center">
                  Sin compromisos • Configuración en minutos
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Snowflake className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Cold Stock
              </span>
            </div>
            <p className="text-muted-foreground">
              © 2024 Cold Stock. Gestión inteligente de inventarios con control de caducidad.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}