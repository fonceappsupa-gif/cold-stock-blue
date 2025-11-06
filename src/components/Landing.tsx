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
  Maximize2,
  TrendingUp,
  Bell,
  Lock,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import canvasImage from "@/assets/Modelo Canvas ColdStock .png";
import { useEffect, useState } from "react";

export default function Landing() {
  const [particles, setParticles] = useState<Array<{ id: number; left: string; delay: string; duration: string }>>([]);

  useEffect(() => {
    // Generate random particles for the hero section
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${15 + Math.random() * 20}s`
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Header */}
      <header className="border-b glass-effect sticky top-0 z-50 animate-fade-in">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 group">
              <Snowflake className="h-8 w-8 text-primary transition-transform group-hover:rotate-180 duration-700" />
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Cold Stock
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="relative overflow-hidden group">
                  <span className="relative z-10">Iniciar Sesión</span>
                  <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity" />
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-primary shadow-cold hover:shadow-glow hover:scale-105 transition-all duration-300 relative overflow-hidden group">
                  <span className="relative z-10 flex items-center">
                    Comenzar Gratis
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 shimmer" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-arctic">
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="particle"
              style={{
                left: particle.left,
                animationDelay: particle.delay,
                animationDuration: particle.duration,
              }}
            />
          ))}
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-arctic-blue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <Badge variant="secondary" className="mb-8 animate-pulse-glow glass-effect px-6 py-2 text-base">
              <Sparkles className="h-5 w-5 mr-2" />
              Tecnología de Vanguardia en Gestión de Inventarios
            </Badge>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 animate-slide-up">
              <span className="block mb-2">Cold Stock</span>
              <span className="block bg-gradient-primary bg-clip-text text-transparent text-4xl md:text-5xl lg:text-6xl">
                Gestión Inteligente de Cuartos Fríos
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 animate-slide-up max-w-3xl mx-auto leading-relaxed">
              Revoluciona tu gestión de inventarios con tecnología de punta. 
              Alertas automáticas, control en tiempo real y análisis predictivo para optimizar tu operación.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up mb-16">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-primary shadow-frost hover:shadow-glow hover:scale-105 transition-all duration-300 px-8 py-6 text-lg group relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    <Package className="mr-2 h-6 w-6" />
                    Empezar Ahora
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </span>
                  <div className="absolute inset-0 shimmer" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="glass-effect border-primary/30 hover:bg-primary/10 px-8 py-6 text-lg group">
                <BarChart3 className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" />
                Ver Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in">
              <div className="glass-effect p-6 rounded-xl hover-lift">
                <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                <div className="text-sm text-muted-foreground">Disponibilidad</div>
              </div>
              <div className="glass-effect p-6 rounded-xl hover-lift" style={{ animationDelay: '0.2s' }}>
                <div className="text-3xl font-bold text-primary mb-2">-80%</div>
                <div className="text-sm text-muted-foreground">Desperdicio</div>
              </div>
              <div className="glass-effect p-6 rounded-xl hover-lift" style={{ animationDelay: '0.4s' }}>
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Monitoreo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 animate-fade-in">
            <Badge variant="outline" className="mb-4">
              <Sparkles className="h-4 w-4 mr-2" />
              Características Principales
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Tecnología que impulsa tu negocio
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Herramientas profesionales diseñadas para maximizar eficiencia, 
              reducir pérdidas y mantener control absoluto de tu inventario.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover-lift hover-glow border-primary/10 group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-cold rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-cold">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl mb-3">Control de Caducidad</CardTitle>
                <CardDescription className="text-base">
                  Sistema inteligente de alertas que monitorea fechas de vencimiento en tiempo real, 
                  evitando pérdidas y optimizando la rotación de productos.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-lift hover-glow border-primary/10 group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-cold rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-cold">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl mb-3">Análisis en Tiempo Real</CardTitle>
                <CardDescription className="text-base">
                  Dashboards interactivos con métricas clave, gráficos dinámicos y 
                  reportes automatizados para tomar decisiones informadas.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-lift hover-glow border-primary/10 group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-cold rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-cold">
                  <Bell className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl mb-3">Alertas Inteligentes</CardTitle>
                <CardDescription className="text-base">
                  Notificaciones automáticas personalizables para niveles de stock críticos, 
                  próximos vencimientos y eventos importantes.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-lift hover-glow border-primary/10 group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-cold rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-cold">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl mb-3">Gestión de Equipos</CardTitle>
                <CardDescription className="text-base">
                  Sistema de roles avanzado con permisos granulares para administradores, 
                  operarios y diferentes niveles de acceso.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-lift hover-glow border-primary/10 group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-cold rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-cold">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl mb-3">Seguridad Total</CardTitle>
                <CardDescription className="text-base">
                  Encriptación de datos, autenticación multifactor y backup automático 
                  para proteger tu información empresarial crítica.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-lift hover-glow border-primary/10 group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-cold rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-cold">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl mb-3">Análisis Predictivo</CardTitle>
                <CardDescription className="text-base">
                  Algoritmos inteligentes que predicen tendencias de consumo y 
                  optimizan automáticamente los niveles de stock.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 bg-gradient-cold relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-in-left">
              <Badge variant="outline" className="mb-6">
                <Zap className="h-4 w-4 mr-2" />
                Resultados Comprobados
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Transforma tu operación con{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  tecnología inteligente
                </span>
              </h2>
              <div className="space-y-6">
                {[
                  { 
                    icon: TrendingUp, 
                    title: "Reducción del desperdicio", 
                    desc: "Hasta 80% menos pérdidas por productos vencidos" 
                  },
                  { 
                    icon: BarChart3, 
                    title: "Eficiencia operativa", 
                    desc: "Automatización que ahorra hasta 15 horas semanales" 
                  },
                  { 
                    icon: Bell, 
                    title: "Alertas predictivas", 
                    desc: "Anticipación de vencimientos con 7 días de antelación" 
                  },
                  { 
                    icon: Shield, 
                    title: "Control total", 
                    desc: "Trazabilidad completa de cada producto en tiempo real" 
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-cold">
                      <benefit.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="animate-slide-in-right">
              <Card className="glass-effect shadow-frost hover-lift p-10 border-primary/20">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                    <Snowflake className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">
                    Comienza tu transformación digital
                  </h3>
                  <p className="text-muted-foreground">
                    Únete a las empresas que ya optimizan su gestión de inventarios
                  </p>
                </div>
                <div className="space-y-4">
                  <Link to="/register" className="block">
                    <Button className="w-full bg-gradient-primary shadow-cold hover:shadow-glow hover:scale-105 transition-all duration-300 py-6 text-lg group">
                      <span className="flex items-center justify-center">
                        Crear Cuenta Gratis
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                      </span>
                    </Button>
                  </Link>
                  <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground pt-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-primary mr-2" />
                      Sin tarjeta
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-primary mr-2" />
                      Setup en 5 min
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-primary mr-2" />
                      Soporte 24/7
                    </div>
                  </div>
                </div>
              </Card>
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
          </div>


        </div>
      </section>

      {/* Footer */}
      <footer className="border-t glass-effect py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6 group">
              <Snowflake className="h-8 w-8 text-primary transition-transform group-hover:rotate-180 duration-700" />
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Cold Stock
              </span>
            </div>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Gestión inteligente de inventarios con control de caducidad. 
              Tecnología de punta para optimizar tu operación.
            </p>
            <div className="flex justify-center space-x-6 mb-8">
              <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="text-muted-foreground hover:text-primary transition-colors">
                Registrarse
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Cold Stock. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}