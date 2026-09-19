import { authClient } from "@/features/auth/lib/auth-client";

/**
 - Cierra la sesión del usuario actual a través de better-auth.
 - Lanza una excepción si el signOut falla para que el consumidor pueda manejar el error.
 */
export async function logoutAction(): Promise<void> {
  await authClient.signOut();
}
