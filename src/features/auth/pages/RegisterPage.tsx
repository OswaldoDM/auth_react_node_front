import { Link } from "react-router-dom";
import { useActionState, useState } from "react";
import { registerAction } from "@/features/auth/actions/register.action";
import { PasswordValidator } from "@/features/auth/components/PasswordValidator";
import { useAuthRedirect } from "@/features/auth/hooks/useAuthRedirect";
import { Spinner } from "@/features/auth/components/Spinner";

export function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null);
    
  const [password, setPassword] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false); 
  
  // Redirigir a la pantalla de verificación OTP al completar los datos del registro.
  const shouldRedirect = state?.success ?? false;
  const redirectTo = state?.email ? 
    `/verify-email?email=${encodeURIComponent(state.email)}` 
    : "/verify-email";
  const forceReload = false;  
  useAuthRedirect( shouldRedirect, redirectTo, forceReload );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-500">Sign up to get started</p>
        </div>
        
        {state?.error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
            {state.error}
          </div>
        )}

        <form className="space-y-6" action={formAction}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">Full Name</label>
            <input 
              id="name"
              name="name"
              type="text" 
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">Email</label>
            <input 
              id="email"
              name="email"
              type="email" 
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">Password</label>            
            <input 
              id="password"
              name="password"
              type="password" 
              required
              pattern="(?=.*[A-Z])(?=.*[!@#$&*]).{8,}"
              title="Debe contener al menos 8 caracteres, una mayúscula y un símbolo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsPasswordFocused(true)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              placeholder="••••••••"
            />            
            <PasswordValidator password={password} isFocused={isPasswordFocused} />
          </div>
          
          <button 
            type="submit" 
            disabled={isPending}
            className={`w-full text-white font-medium py-3 rounded-lg transition-colors flex items-center cursor-pointer justify-center 
              bg-gray-900 hover:bg-black disabled:cursor-not-allowed`}
          >
            {isPending ? <Spinner /> : "Create Account"}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account? <Link to="/login" replace className="text-gray-900 font-medium hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
