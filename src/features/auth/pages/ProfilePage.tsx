import { useSession } from "../lib/auth-client";

export function ProfilePage() {
  const { data: session } = useSession();
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-8 py-10 border-b border-gray-200 flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-3xl font-bold">
              {session?.user.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{session?.user.name}</h1>
              <p className="text-gray-500">{session?.user.email}</p>
            </div>
          </div>          
        </div>
      </main>
    </div>
  );
}
