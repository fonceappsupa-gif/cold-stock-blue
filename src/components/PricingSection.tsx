import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Construction } from "lucide-react";

export default function PricingSection() {
  const plans = [
    {
      name: "Plan Básico",
      price: "$49",
      period: "/mes",
      description: "Perfecto para pequeños negocios que comienzan",
      features: [
        "Hasta 100 productos",
        "1 usuario administrador",
        "2 operadores",
        "Alertas de vencimiento",
        "Reportes básicos",
        "Soporte por email"
      ],
      available: true,
      popular: false
    },
    {
      name: "Plan Profesional",
      price: "$99",
      period: "/mes",
      description: "La mejor opción para negocios en crecimiento",
      features: [
        "Productos ilimitados",
        "3 usuarios administradores",
        "10 operadores",
        "Alertas inteligentes en tiempo real",
        "Reportes avanzados y analytics",
        "Soporte prioritario 24/7",
        "Integración con WhatsApp",
        "Exportación de datos"
      ],
      available: true,
      popular: true
    },
    {
      name: "Plan Enterprise",
      price: "Contactar",
      period: "",
      description: "Solución personalizada para grandes empresas",
      features: [
        "Todo lo del Plan Profesional",
        "Usuarios ilimitados",
        "Múltiples ubicaciones",
        "API personalizada",
        "Servidor dedicado",
        "Capacitación presencial",
        "Soporte técnico dedicado"
      ],
      available: false,
      popular: false
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-cyan-500/20 text-cyan-300 border-cyan-500/50">
            Planes y Precios
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 neon-text">
            Elige el Plan Perfecto para tu Negocio
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Soluciones flexibles que se adaptan a las necesidades de tu empresa
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`glass-card border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 relative ${
                plan.popular ? 'ring-2 ring-cyan-500 scale-105' : ''
              } ${!plan.available ? 'opacity-75' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-1">
                    Más Popular
                  </Badge>
                </div>
              )}
              {!plan.available && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/50 px-4 py-1">
                    <Construction className="h-3 w-3 mr-1 inline" />
                    Próximamente
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl text-cyan-400 mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-slate-300">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-slate-400 text-lg">{plan.period}</span>}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-slate-300">
                      <CheckCircle className="h-5 w-5 text-cyan-400 mr-3 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700' 
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-500/30'
                  }`}
                  disabled={!plan.available}
                >
                  {plan.available ? 'Comenzar Ahora' : 'Próximamente'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-400">
            ¿Necesitas un plan personalizado? {" "}
            <a href="#contacto" className="text-cyan-400 hover:text-cyan-300 underline">
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
