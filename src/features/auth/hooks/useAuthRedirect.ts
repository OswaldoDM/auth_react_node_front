import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
/**
 - Hook que encapsula la lógica de redirección cuando se cumple una condición (ej: éxito en 
   una acción).
 - Cumple con el principio de SRP abstrayendo los efectos de navegación de los componentes. 
*/
 export function useAuthRedirect(
   shouldRedirect: boolean,
   redirectTo: string = "/",
   forceReload: boolean
 ) {
   const navigate = useNavigate();
   const hasRedirected = useRef(false);

   useEffect(() => {    
    if (!shouldRedirect || hasRedirected.current) return;
    hasRedirected.current = true;

     if (forceReload) {
       window.location.replace(redirectTo);
     } else {
       navigate(redirectTo, { replace: true });
     }
   }, [shouldRedirect, redirectTo, forceReload, navigate]);
 }

