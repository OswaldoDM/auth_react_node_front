import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthActionState } from "./types";

// Acción del lado del cliente para solicitar el reenvío de un código OTP por correo.

export async function resendOtpAction(
  _prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState> {

  const email = formData.get("email") as string;

  if (!email) {
    return { error: "No se especificó un correo válido." };
  }

  try {
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    });

    if (error) {
      return { error: error.message || "Error al reenviar el código." };
    }

    return { success: true };
  } catch (err: unknown) {
    console.error("Error al reenviar OTP:", err);
    return { error: "No se pudo reenviar el código. Intenta de nuevo." };
  }
}
