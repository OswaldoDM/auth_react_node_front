import { useState, useActionState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { verifyEmailAction } from "@/features/auth/actions/verify-email.action";
import { useAuthRedirect } from "@/features/auth/hooks/useAuthRedirect";
import { OtpInput } from "@/features/auth/components/OtpInput";
import { Spinner } from "@/features/auth/components/Spinner";
import { ResendOtpButton } from "@/features/auth/components/ResendOtpButton";

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";  

  const [otp, setOtp] = useState("");

  // Manejo del formulario principal
  const [state, formAction, isPending] = useActionState(verifyEmailAction, null);

  // Redirección con forceReload al tener éxito (rehidrata la sesión)
  const shouldRedirect = state?.success ?? false;
  const redirectTo = "/";
  const forceReload = true;
  useAuthRedirect(shouldRedirect, redirectTo, forceReload);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Verify your account
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Enter verification code sent to <span className="font-semibold text-gray-700">{email || "your email"}</span>
        </p>

        {/* Notificaciones */}
        {state?.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
            {state.error}
          </div>
        )}

        {/* Formulario Principal */}
        <form action={formAction}>
          {/* Inputs ocultos para que el FormData los reciba en la acción */}
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="otp" value={otp} />

          <OtpInput
            value={otp}
            onChange={setOtp}
            length={6}
            disabled={isPending}
          />

          <button
            type="submit"
            disabled={isPending || otp.length !== 6}
            className="w-full text-white font-bold py-3.5 rounded-lg transition-all tracking-wider text-sm flex items-center justify-center bg-black hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? <Spinner /> : "VERIFY"}
          </button>
        </form>

        {/* Pie de página con el componente con funcionalidad de Resend */}
        <div className="mt-6 text-left text-sm text-gray-600 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span>Didn’t get the code?</span>
            <ResendOtpButton 
              email={email} 
              onResendSuccess={() => setOtp("")} 
            />
          </div>

          <Link to="/register" replace className="text-xs text-gray-400 hover:text-gray-700">
            Back to register
          </Link>
        </div>

      </div>
    </div>
  );
}


