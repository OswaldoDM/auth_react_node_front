export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-200">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Welcome Home!
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl">
            This is the main application area.
          </p>          
        </div>
      </main>
    </div>
  );
}
