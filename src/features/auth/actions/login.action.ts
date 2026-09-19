import { authClient } from '@/features/auth/lib/auth-client';
import type { AuthActionState } from "./types"; 

export async function loginAction(
  _prevState: AuthActionState | null, 
  formData: FormData
): Promise<AuthActionState> {

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  try {
    const { error } = await authClient.signIn.email({
      email,
      password,
    });
    
    if (error) {
      return { error: error.message || "Error al iniciar sesión. Verifica tus datos." };
    }    
    
    return { success: true };
  } catch (err: unknown) {
    console.error("Error en el login:", err);
    return { error: "Error interno al iniciar sesión." };
  }
}
