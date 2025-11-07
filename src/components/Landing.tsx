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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";

export default function Landing() {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    // Generate snowflakes
    const newSnowflakes = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 5}s`,
      size: Math.random() * 10 + 5,
      opacity: Math.random() * 0.6 + 0.3
    }));
    setSnowflakes(newSnowflakes);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950">
      {/* Snowfall Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="absolute animate-fall"
            style={{
              left: flake.left,
              top: '-20px',
              width: `${flake.size}px`,
              height: `${flake.size}px`,
              animationDuration: flake.animationDuration,
              animationDelay: flake.animationDelay,
              opacity: flake.opacity
            }}
          >
            <Snowflake className="text-cyan-300 w-full h-full" />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
          }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
        .glass-card {
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(56, 189, 248, 0.2);
        }
        .neon-text {
          text-shadow: 0 0 10px rgba(56, 189, 248, 0.5),
                       0 0 20px rgba(56, 189, 248, 0.3),
                       0 0 30px rgba(56, 189, 248, 0.2);
        }
        .glow-effect {
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.3),
                      0 0 40px rgba(56, 189, 248, 0.1);
        }
      `}</style>

      {/* Header */}
      <header className="glass-card sticky top-0 z-40 border-b border-cyan-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Snowflake className="h-6 w-6 text-white animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <span className="text-2xl font-bold text-white neon-text">
                Cold Stock
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-cyan-100 hover:text-white hover:bg-cyan-500/20 transition-all"
                onClick={() => window.location.href = '/login'}
              >
                Iniciar Sesión
              </Button>
              <Button 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
                onClick={() => window.location.href = '/register'}
              >
                Comenzar Gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950"></div>
        
        {/* Animated orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <Badge className="mb-8 bg-cyan-500/20 text-cyan-100 border-cyan-500/50 px-6 py-2 text-base hover:bg-cyan-500/30 transition-all">
              <Sparkles className="h-5 w-5 mr-2" />
              Tecnología de Vanguardia en Gestión de Inventarios
            </Badge>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 animate-fade-in">
              <span className="block mb-2 text-white neon-text">Cold Stock</span>
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent text-4xl md:text-5xl lg:text-6xl">
                Gestión Inteligente de Cuartos Fríos
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-12 animate-fade-in max-w-3xl mx-auto leading-relaxed">
              Revoluciona tu gestión de inventarios con tecnología de punta. 
              Alertas automáticas, control en tiempo real y análisis predictivo para optimizar tu operación.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-8 py-6 text-lg shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 glow-effect"
                onClick={() => window.location.href = '/register'}
              >
                <Package className="mr-2 h-6 w-6" />
                Empezar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="glass-card text-cyan-100 border-cyan-500/50 hover:bg-cyan-500/20 px-8 py-6 text-lg group"
                onClick={() => window.location.href = '/login'}
              >
                <BarChart3 className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" />
                Ver Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
              {[
                { value: "99.9%", label: "Disponibilidad" },
                { value: "-80%", label: "Desperdicio" },
                { value: "24/7", label: "Monitoreo" }
              ].map((stat, i) => (
                <div key={i} className="glass-card p-6 rounded-xl hover:scale-105 transition-all duration-300 glow-effect">
                  <div className="text-3xl font-bold text-cyan-400 mb-2 neon-text">{stat.value}</div>
                  <div className="text-sm text-slate-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 bg-cyan-500/10 text-cyan-300 border-cyan-500/50">
              <Sparkles className="h-4 w-4 mr-2" />
              Características Principales
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white neon-text">
              Tecnología que impulsa tu negocio
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Herramientas profesionales diseñadas para maximizar eficiencia, 
              reducir pérdidas y mantener control absoluto de tu inventario.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "Control de Caducidad",
                desc: "Sistema inteligente de alertas que monitorea fechas de vencimiento en tiempo real, evitando pérdidas y optimizando la rotación de productos."
              },
              {
                icon: BarChart3,
                title: "Análisis en Tiempo Real",
                desc: "Dashboards interactivos con métricas clave, gráficos dinámicos y reportes automatizados para tomar decisiones informadas."
              },
              {
                icon: Bell,
                title: "Alertas Inteligentes",
                desc: "Notificaciones automáticas personalizables para niveles de stock críticos, próximos vencimientos y eventos importantes."
              },
              {
                icon: Users,
                title: "Gestión de Equipos",
                desc: "Sistema de roles avanzado con permisos granulares para administradores, operarios y diferentes niveles de acceso."
              },
              {
                icon: Lock,
                title: "Seguridad Total",
                desc: "Encriptación de datos, autenticación multifactor y backup automático para proteger tu información empresarial crítica."
              },
              {
                icon: TrendingUp,
                title: "Análisis Predictivo",
                desc: "Algoritmos inteligentes que predicen tendencias de consumo y optimizan automáticamente los niveles de stock."
              }
            ].map((feature, index) => (
              <Card key={index} className="glass-card border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 group">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-cyan-500/50">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-3 text-white">{feature.title}</CardTitle>
                  <CardDescription className="text-base text-slate-300">
                    {feature.desc}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-6 bg-cyan-500/10 text-cyan-300 border-cyan-500/50">
                <Zap className="h-4 w-4 mr-2" />
                Resultados Comprobados
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
                Transforma tu operación con{" "}
                <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent neon-text">
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
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/50">
                      <benefit.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1 text-white">{benefit.title}</h3>
                      <p className="text-slate-300">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Card className="glass-card shadow-2xl shadow-cyan-500/20 p-10 border-cyan-500/30 hover:scale-105 transition-transform duration-300">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-cyan-500/50">
                    <Snowflake className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white neon-text">
                    Comienza tu transformación digital
                  </h3>
                  <p className="text-slate-300">
                    Únete a las empresas que ya optimizan su gestión de inventarios
                  </p>
                </div>
                <div className="space-y-4">
                  <Button 
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-6 text-lg shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
                    onClick={() => window.location.href = '/register'}
                  >
                    Crear Cuenta Gratis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <div className="flex items-center justify-center space-x-6 text-sm text-slate-300 pt-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-cyan-400 mr-2" />
                      Sin tarjeta
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-cyan-400 mr-2" />
                      Setup en 5 min
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-cyan-400 mr-2" />
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
      <section className="py-20 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-white neon-text">Modelo Canvas</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Nuestro modelo de negocio diseñado para entregar valor a nuestros clientes
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="glass-card border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-cyan-400">Socios Clave</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Proveedores de equipos de refrigeración</li>
                  <li>• Proveedores tecnológicos (AWS, Azure)</li>
                  <li>• Cámara de Comercio de Bucaramanga</li>
                  <li>• SENA y entidades de apoyo al emprendimiento</li>
                  <li>• Empresas aliadas del sector alimentos</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-card border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-cyan-400">Actividades Clave</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Desarrollo y mantenimiento del software</li>
                  <li>• Monitoreo en la nube y soporte técnico</li>
                  <li>• Capacitación virtual para clientes</li>
                  <li>• Estrategias de marketing digital</li>
                  <li>• Alianzas comerciales estratégicas</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-card border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 lg:row-span-2 bg-gradient-to-br from-cyan-950/50 to-blue-950/50">
              <CardHeader>
                <CardTitle className="text-lg text-cyan-400">Propuesta de Valor</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Solución 100% en la nube accesible desde cualquier dispositivo</li>
                  <li>• Alertas inteligentes sobre vencimientos y stock</li>
                  <li>• Reportes automatizados que ahorran tiempo</li>
                  <li>• Interfaz intuitiva y fácil de usar</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-card border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-cyan-400">Recursos Clave</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Equipo de desarrollo Full Stack</li>
                  <li>• Infraestructura en la nube</li>
                  <li>• Plataforma web y app ColdStock</li>
                  <li>• Licencias y registro de marca</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-card border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-cyan-400">Relaciones con Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Atención personalizada y soporte técnico</li>
                  <li>• Capacitación inicial incluida</li>
                  <li>• Canal directo por email y WhatsApp</li>
                  <li>• Descuentos por referidos</li>
                </ul>
              </CardContent>
            </Card>

            <div className="lg:col-span-2">
              <div className="grid sm:grid-cols-2 gap-6">
                <Card className="glass-card border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg text-cyan-400">Canales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li>• Página web oficial</li>
                      <li>• Redes sociales</li>
                      <li>• Contacto directo con empresas</li>
                      <li>• Alianzas con distribuidores</li>
                      <li>• Ferias y eventos del sector</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="glass-card border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg text-cyan-400">Segmentos de Clientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li>• Restaurantes y hoteles</li>
                      <li>• Supermercados y distribuidores</li>
                      <li>• Empresas farmacéuticas</li>
                      <li>• PYMES de Bucaramanga</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="glass-card border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-cyan-400">Estructura de Costos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Desarrollo y alojamiento</li>
                  <li>• Nómina del equipo</li>
                  <li>• Marketing y publicidad</li>
                  <li>• Licencias y gastos legales</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 glass-card border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-cyan-400">Fuentes de Ingresos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-300">
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
      <footer className="glass-card border-t border-cyan-500/20 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6 group cursor-pointer">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Snowflake className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white neon-text">
                Cold Stock
              </span>
            </div>
            <p className="text-slate-300 mb-8 max-w-md mx-auto">
              Gestión inteligente de inventarios con control de caducidad. 
              Tecnología de punta para optimizar tu operación.
            </p>
            <div className="flex justify-center space-x-6 mb-8">
              <a href="#" className="text-slate-300 hover:text-cyan-400 transition-colors">
                Iniciar Sesión
              </a>
              <a href="#" className="text-slate-300 hover:text-cyan-400 transition-colors">
                Registrarse
              </a>
            </div>
            <p className="text-sm text-slate-400">
              © 2025 Cold Stock. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}