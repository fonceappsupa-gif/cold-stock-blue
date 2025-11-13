import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, MessageSquare, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "El nombre es requerido").max(100, "El nombre es muy largo"),
  email: z.string().trim().email("Email inválido").max(255, "El email es muy largo"),
  phone: z.string().trim().min(10, "El teléfono debe tener al menos 10 dígitos").max(20, "El teléfono es muy largo"),
  message: z.string().trim().min(10, "El mensaje debe tener al menos 10 caracteres").max(1000, "El mensaje es muy largo")
});

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // En producción, el usuario debe cargar su propio QR de WhatsApp
  const whatsappQR = "/wppqr.png"; // Placeholder, el usuario debe reemplazar esto

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validar datos
      const validatedData = contactSchema.parse(formData);
      
      setIsSubmitting(true);

      // Llamar al edge function para enviar el email
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: validatedData
      });

      if (error) throw error;

      toast({
        title: "¡Mensaje enviado!",
        description: "Nos pondremos en contacto contigo pronto.",
      });

      // Limpiar formulario
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Error de validación",
          description: error.errors[0].message,
          variant: "destructive"
        });
      } else {
        console.error('Error sending contact:', error);
        toast({
          title: "Error",
          description: "No se pudo enviar el mensaje. Intenta de nuevo.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-cyan-500/20 text-cyan-300 border-cyan-500/50">
            Contacto
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 neon-text">
            ¿Listo para Comenzar?
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Contáctanos y descubre cómo Cold Stock puede transformar tu negocio
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Formulario de Contacto */}
          <Card className="glass-card border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-2xl text-cyan-400 flex items-center">
                <Mail className="h-6 w-6 mr-2" />
                Envíanos un Mensaje
              </CardTitle>
              <CardDescription className="text-slate-300">
                Completa el formulario y nos pondremos en contacto contigo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-cyan-200">Nombre completo</Label>
                  <Input
                    id="name"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-slate-900/50 border-cyan-500/30 text-white placeholder:text-slate-500 focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-cyan-200">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-slate-900/50 border-cyan-500/30 text-white placeholder:text-slate-500 focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-cyan-200">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+57 300 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="bg-slate-900/50 border-cyan-500/30 text-white placeholder:text-slate-500 focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-cyan-200">Mensaje</Label>
                  <Textarea
                    id="message"
                    placeholder="Cuéntanos sobre tu negocio y qué plan te interesa..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="bg-slate-900/50 border-cyan-500/30 text-white placeholder:text-slate-500 focus:border-cyan-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  {isSubmitting ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Mensaje
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* WhatsApp QR Code */}
          <div className="space-y-6">
            <Card className="glass-card border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-2xl text-cyan-400 flex items-center">
                  <MessageSquare className="h-6 w-6 mr-2" />
                  Contáctanos por WhatsApp
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Escanea el código QR para chatear directamente con nosotros
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="relative cursor-pointer group">
                      <div className="w-64 h-64 bg-white rounded-lg p-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <img 
                          src={whatsappQR} 
                          alt="WhatsApp QR Code" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-cyan-500 text-white rounded-full p-3">
                          <Maximize2 className="h-6 w-6" />
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <div className="bg-white rounded-lg p-8 flex items-center justify-center">
                      <img 
                        src={whatsappQR} 
                        alt="WhatsApp QR Code - Vista ampliada" 
                        className="w-full max-w-md h-auto"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
                <p className="text-sm text-slate-400 text-center mt-4">
                  Haz clic en el código para ampliar
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-cyan-500/20">
              <CardContent className="pt-6">
                <div className="space-y-4 text-slate-300">
                  <div>
                    <h4 className="font-semibold text-cyan-400 mb-2">Horario de Atención</h4>
                    <p>Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                    <p>Sábados: 9:00 AM - 1:00 PM</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-cyan-400 mb-2">Email</h4>
                    <p>Coldstock03@gmail.com</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-cyan-400 mb-2">Whatsapp</h4>
                    <p>314-218-2069</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-cyan-400 mb-2">Ubicación</h4>
                    <p>Bucaramanga, Colombia</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
