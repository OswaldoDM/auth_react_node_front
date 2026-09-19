import { AppRoutes } from "./AppRoutes";

export function App() {
  return (
    <>
      {/* Overlay oscuro por encima de toda la app */}
      <div className="fixed inset-0 bg-black/10 pointer-events-none z-50"></div>
      <AppRoutes />
    </>
  );
}
