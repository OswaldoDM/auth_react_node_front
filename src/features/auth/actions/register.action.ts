import { authClient } from '@/features/auth/lib/auth-client';
import type { RegisterActionState } from "./types"; 

export async function registerAction(
  _prevState: RegisterActionState | null, 
  formData: FormData
): Promise<RegisterActionState> {
  
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  try {
    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
    });
    
    if (error) {
      return { error: error.message || "Error al registrarse. Verifica tus datos." };
    }
    
    return { success: true, email };
  } catch (err: unknown) {
    console.error("Error en el registro:", err);
    return { error: "Error interno al registrarse." };
  }
}
