import { Link, useNavigate } from "react-router-dom";
import { useSession } from "@/features/auth/lib/auth-client";
import { logoutAction } from "@/features/auth/actions/logout.action";

export function Navbar() {
  const { data: session } = useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutAction();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-900">AuthApp</Link>
            </div>
            <div className="flex space-x-4 items-center">
              {session ? (
                <>
                  <Link to="/profile" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">Profile</Link>
                  <button onClick={handleLogout} className="bg-gray-100 text-gray-900 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">Login</Link>
                  <Link to="/register" className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
  )
}
