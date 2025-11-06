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
  Zap,
  Maximize2
} from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import canvasImage from "@/assets/business-model-canvas.jpg";

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

      {/* Business Model Canvas Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Modelo Canvas</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nuestro modelo de negocio diseñado para entregar valor a nuestros clientes
            </p>
          </div>

          {/* Canvas Image Preview */}
          <div className="mb-12 flex justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative cursor-pointer group max-w-md">
                  <Card className="overflow-hidden hover:shadow-frost transition-all duration-300">
                    <img 
                      src={canvasImage} 
                      alt="Business Model Canvas" 
                      className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary text-primary-foreground rounded-full p-3">
                        <Maximize2 className="h-6 w-6" />
                      </div>
                    </div>
                  </Card>
                  <p className="text-sm text-muted-foreground text-center mt-3">
                    Haz clic para ampliar
                  </p>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-6xl w-full">
                <img 
                  src={canvasImage} 
                  alt="Business Model Canvas - Vista ampliada" 
                  className="w-full h-auto"
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Fila 1: Socios, Actividades y Propuesta de Valor */}
            <Card className="hover:shadow-cold transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg">Socios Clave</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Proveedores de equipos de refrigeración: aliados para ofrecer ColdStock como complemento a sus servicios</li>
                  <li>• Proveedores tecnológicos (AWS, Azure): garantizan la estabilidad, seguridad y escalabilidad del sistema</li>
                  <li>• Cámara de Comercio de Bucaramanga: acompañamiento en formalización empresarial</li>
                  <li>• SENA y entidades de apoyo al emprendimiento: asesoría, formación y validación del modelo de negocio</li>
                  <li>• Empresas aliadas del sector alimentos y logística: primeras en implementar pilotos del sistema</li>
                  <li>• Desarrolladores externos para integración con sensores IoT y nuevas funcionalidades</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-cold transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg">Actividades Clave</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Desarrollo, actualización y mantenimiento del software.</li>
                  <li>• Monitoreo en la nube y soporte técnico continuo</li>
                  <li>• Capacitación virtual para clientes nuevos</li>
                  <li>• Estrategias de marketing digital y demostraciones personalizadas</li>
                  <li>• Alianzas comerciales con proveedores de equipos de refrigeración</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-cold transition-all duration-300 lg:row-span-2 bg-gradient-cold">
              <CardHeader>
                <CardTitle className="text-lg">Propuesta de Valor</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Solución 100 % en la nube, accesible desde cualquier dispositivo</li>
                  <li>• Alertas inteligentes sobre fechas de vencimiento y niveles de stock</li>
                  <li>• Reportes automatizados que ahorran tiempo y evitan errores humanos</li>
                  <li>• Interfaz intuitiva, creada para que cualquier empleado pueda usarla sin conocimientos técnicos</li>
                </ul>
              </CardContent>
            </Card>

            {/* Fila 2: Recursos y continuación de Propuesta de Valor */}
            <Card className="hover:shadow-cold transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg">Recursos Clave</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Equipo humano: desarrolladores Full Stack, soporte técnico, asesor comercial</li>
                  <li>• Infraestructura en la nube (AWS o Azure)</li>
                  <li>• Plataforma web y app ColdStock</li>
                  <li>• Licencias, registro de marca y dominio web</li>
                  <li>• Material promocional y redes sociales</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-cold transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg">Relaciones con Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Atención personalizada con soporte técnico remoto y chat en línea</li>
                  <li>• Capacitación inicial incluida en la suscripción</li>
                  <li>• Canal de comunicación directo por email y WhatsApp</li>
                  <li>• Estrategia de fidelización: descuentos por referidos y upgrades de plan</li>
                  <li>• Reportes automáticos que fortalecen la confianza del cliente</li>
                </ul>
              </CardContent>
            </Card>

            {/* Fila 3: Canales y Segmentos */}
            <div className="lg:col-span-2">
              <div className="grid sm:grid-cols-2 gap-6">
                <Card className="hover:shadow-cold transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg">Canales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Página web oficial con registro de prueba gratuita</li>
                      <li>• Redes sociales (Instagram, Facebook, LinkedIn)</li>
                      <li>• Contacto directo con empresas y visitas comerciales</li>
                      <li>• Alianzas con distribuidores y cámaras de comercio</li>
                      <li>• Ferias locales y eventos del sector de alimentos y tecnología</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-cold transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg">Segmentos de Clientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Restaurantes, panaderías y hoteles que almacenan alimentos perecederos</li>
                      <li>• Supermercados, frigoríficos y distribuidores de alimentos que manejan grandes volúmenes</li>
                      <li>• Empresas del sector farmacéutico que requieren trazabilidad de medicamentos y vacunas</li>
                      <li>• PYMES del área metropolitana de Bucaramanga con proyección nacional</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="hover:shadow-cold transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg">Estructura de Costos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Desarrollo, mantenimiento y alojamiento en la nube</li>
                  <li>• Nómina del equipo técnico y comercial</li>
                  <li>• Marketing digital y publicidad</li>
                  <li>• Licencias de software, registro de marca y gastos legales</li>
                  <li>• Equipos y suscripciones tecnológicas</li>
                </ul>
              </CardContent>
            </Card>

            {/* Fila 4: Fuentes de Ingresos */}
            <Card className="lg:col-span-2 hover:shadow-cold transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg">Fuentes de Ingresos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Suscripciones mensuales/anuales por usuario</li>
                  <li>• Planes empresariales personalizados</li>
                  <li>• Servicios de implementación y capacitación</li>
                  <li>• Consultoría especializada en gestión de inventarios</li>
                </ul>
              </CardContent>
            </Card>
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