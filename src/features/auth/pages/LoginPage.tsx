import { Link } from "react-router-dom";
import { useActionState } from "react";
import { loginAction } from "@/features/auth/actions/login.action";
import { useAuthRedirect } from "@/features/auth/hooks/useAuthRedirect";
import { Spinner } from "@/features/auth/components/Spinner";

export function LoginPage() {  
  const [state, formAction, isPending] = useActionState(loginAction, null);    
  
  // El forceReload: true asegura que la página se recargue completamente  
  const shouldRedirect = state?.success ?? false;
  const redirectTo = "/";  
  const forceReload = true;  
  useAuthRedirect(shouldRedirect, redirectTo, forceReload);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500">Please sign in to your account</p>
        </div>

        {state?.error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
            {state.error}
          </div>
        )}

        <form className="space-y-6" action={formAction}>
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
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={isPending}
            className={`w-full text-white font-medium py-3 rounded-lg transition-colors flex items-center cursor-pointer justify-center 
              bg-gray-900 hover:bg-black disabled:cursor-not-allowed`}
          >
            {isPending ? <Spinner /> : "Sign In"}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account? <Link to="/register" replace className="text-gray-900 font-medium hover:underline">Register here</Link>
        </div>
      </div>
    </div>
  );
}
