import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000", // La URL del backend
  plugins: [
    emailOTPClient(), // Plugin para habilitar métodos de verificación con código OTP
  ],
});

// Exportamos el hook para usarlo en los componentes
export const { useSession } = authClient;

