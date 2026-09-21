import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

/**
  En producción (Vercel), utilizamos window.location.origin para que las peticiones a la API
  salgan hacia el mismo dominio del frontend (/api/auth/...).
  Vercel (mediante vercel.json) actúa como Reverse Proxy y reenvía internamente las peticiones
  hacia el backend en Render. Esto garantiza que las cookies de sesión sean "First-Party"
  y que el navegador acepte 'SameSite=Lax' sin ser bloqueadas por políticas de terceros.
    
  En desarrollo local, usamos localhost:3000.
*/

export const authClient = createAuthClient({  
  baseURL: import.meta.env.PROD ? window.location.origin : "http://localhost:3000",
  sessionOptions: {
    refetchOnWindowFocus: false, // Evita revalidaciones innecesarias al cambiar de foco/ventana
  },
  plugins: [
    emailOTPClient(), // Plugin para habilitar métodos de verificación con código OTP
  ],
});

// Exportamos el hook para usarlo en los componentes
export const { useSession } = authClient;


