import { useState, useEffect, useActionState } from "react";
import { resendOtpAction } from "@/features/auth/actions/resend-otp.action";
import type { AuthActionState } from "@/features/auth/actions/types";

interface Props {
  email: string;
  onResendSuccess?: () => void;
}

/**
 * Componente que encapsula toda la lógica de reenvío de código OTP:
 * - Acción con useActionState
 * - Temporizador de enfriamiento (cooldown de 60 segundos)
 * - Manejo de estados de carga y errores
 */
export function ResendOtpButton({ email, onResendSuccess }: Props) {
  const [cooldown, setCooldown] = useState(0);

  // Acción envuelta para activar el cooldown inmediatamente al tener éxito sin efectos en cascada
  const [state, formAction, isPending] = useActionState(
    async (prevState: AuthActionState | null, formData: FormData) => {
      const result = await resendOtpAction(prevState, formData);
      if (result.success) {
        setCooldown(60);
        onResendSuccess?.(); // resetea el state otp en el padre
      }
      return result;
    },
    null
  );

  // Manejo del contador regresivo para el botón de reenvío
  useEffect(() => {
    // Al iniciar el componente el cooldown es 0, por lo que no hace nada.
    if (cooldown <= 0) return;

    // Cada 1000ms (1 segundo), resta 1 segundo al contador.
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    // Limpieza del timer cuando cambia el cooldown o al desmontar.
    return () => clearInterval(timer);    
  }, [cooldown]);


  return (
    <div className="flex flex-col gap-1">
      {/* Mensaje de confirmación del reenvío */}
      {state?.success && cooldown > 0 && (
        <p className="text-[10px] text-green-600 font-medium">
          Código reenviado
        </p>
      )}

      {/* Mensaje de error si falla el reenvío */}
      {state?.error && (
        <p className="text-[10px] text-red-600 font-medium">
          {state.error}
        </p>
      )}
      <form action={formAction}>
        <input type="hidden" name="email" value={email} />
        <button
          type="submit"
          disabled={isPending || cooldown > 0 || !email}
          className="font-semibold text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed underline cursor-pointer text-sm"
        >
          {isPending
            ? "Sending..."
            : cooldown > 0
            ? `Resend (${cooldown}s)`
            : "Resend"}
        </button>
      </form>
    </div>
  );
}
