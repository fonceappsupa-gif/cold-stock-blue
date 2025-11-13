import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, message }: ContactEmailRequest = await req.json();

    console.log('Sending contact email for:', { name, email, phone });

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    const adminEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Cold Stock <onboarding@resend.dev>",
        to: ["tu-email@ejemplo.com"],
        subject: `Nuevo contacto de ${name}`,
        html: `
          <h1>Nuevo Contacto desde Cold Stock</h1>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${message}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">Este mensaje fue enviado desde el formulario de contacto de Cold Stock</p>
        `,
      }),
    });

    if (!adminEmailResponse.ok) {
      const error = await adminEmailResponse.text();
      console.error('Error sending admin email:', error);
      throw new Error(`Failed to send admin email: ${error}`);
    }

    const userEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Cold Stock <onboarding@resend.dev>",
        to: [email],
        subject: "¡Gracias por contactarnos!",
        html: `
          <h1>¡Gracias por tu interés en Cold Stock, ${name}!</h1>
          <p>Hemos recibido tu mensaje y nos pondremos en contacto contigo pronto.</p>
          <p><strong>Tu mensaje:</strong></p>
          <p>${message}</p>
          <hr>
          <p>Mientras tanto, puedes:</p>
          <ul>
            <li>Visitar nuestra página web para conocer más sobre nuestros planes</li>
            <li>Contactarnos por WhatsApp para una respuesta más rápida</li>
          </ul>
          <p>Saludos,<br>El equipo de Cold Stock</p>
        `,
      }),
    });

    if (!userEmailResponse.ok) {
      const error = await userEmailResponse.text();
      console.error('Error sending user email:', error);
    }

    console.log("Emails sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
