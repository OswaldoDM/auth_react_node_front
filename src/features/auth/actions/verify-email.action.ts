import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthActionState } from "./types";

 // Acción del lado del cliente para verificar el código OTP de correo electrónico. 

export async function verifyEmailAction(
  _prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState> {
  
  const email = formData.get("email") as string;
  const otp = formData.get("otp") as string;

  if (!email) {
    return { error: "Por favor, ingresa un correo válido." };
  }

  if (!otp || otp.length !== 6) {
    return { error: "El código de verificación debe tener 6 dígitos." };
  }

  try {
    const { error } = await authClient.emailOtp.verifyEmail({
      email,
      otp,
    });

    if (error) {
      return { error: error.message || "Código inválido o expirado. Inténtalo de nuevo." };
    }

    return { success: true };
  } catch (err: unknown) {
    console.error("Error al verificar código OTP:", err);
    return { error: "Ocurrió un error inesperado durante la verificación." };
  }
}
