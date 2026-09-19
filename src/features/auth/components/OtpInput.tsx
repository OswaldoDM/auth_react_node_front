import React, { useRef } from "react";

interface OtpInputProps {
  value: string;                  // El string completo del código actual (ej: "123456" o "12")
  onChange: (otp: string) => void;// Función del padre para actualizar el estado del OTP
  length?: number;                // Cantidad de dígitos/casillas (por defecto: 6)
  disabled?: boolean;             // Si está deshabilitado durante el envío (isPending)
}

/**
 - Componente interactivo para el ingreso de código OTP (por defecto 6 casillas).  
 
 - Características clave:
   - Salto automático de foco a la siguiente casilla al escribir un número.
   - Retroceso inteligente con Backspace (si la casilla está vacía, borra y salta a la anterior).
   - Navegación fluida con las flechas del teclado (izquierda/derecha).
   - Soporte completo para pegar (ej: pegar "123456" rellena todas las casillas a la vez).
 * 5. Auto-selección del texto al hacer clic/foco para facilitar la sobreescritura.
 */
export function OtpInput({ value, onChange, length = 6, disabled = false }: OtpInputProps) {

  // Arreglo de referencias directas a cada elemento <input> del DOM.
  // Nos permite controlar el foco (.focus()) de cualquier casilla de forma programática.
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /** 
   - Convertimos el string 'value' (ej: "12") en un arreglo de longitud fija 
     (ej: ["1", "2", "", "", "", ""]).
   - Esto nos permite iterar con .map() y renderizar cada casilla individualmente.  
 */
  const digits = Array.from({ length }, (_, i) => value[i] || "");

  /**
   - Pone el foco del cursor en la casilla indicada por el índice.
   - Valida que el índice esté dentro del rango permitido (0 a length - 1).
   */
  const focusInput = (index: number) => {
    if (index >= 0 && index < length) {
      inputRefs.current[index]?.focus();
    }
  };

  /**
   - Se ejecuta cuando el usuario escribe o cambia el valor de una casilla.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const rawValue = e.target.value;
    
    // 1. Limpieza: eliminamos cualquier caracter que no sea un número (solo dígitos 0-9).
    const cleanVal = rawValue.replace(/\D/g, "");

    /** 
     - 2.Si el usuario borra el número de la casilla actual:
     
     - la función retorna sin hacer nada, y el valor de la casilla se mantiene igual.
     
     - Esto permite que el usuario borre el número de una casilla y 
       luego escriba un nuevo número en la misma casilla, en lugar de
       borrar el número de la casilla anterior automáticamente.
     
     - Esto soluciona el bug de que al borrar el número de una casilla, 
       el número de la casilla anterior se borrara automáticamente.
    */
    
    if (!cleanVal) {
      // a. Clonamos el arreglo actual de dígitos (inmutabilidad en React)
      //    Ejemplo: si digits era ["1", "2", "5", "4", "5", "6"]
      const newDigits = [...digits];

      // b. Vaciamos la casilla específica que el usuario borró (ej: index 2)
      //    newDigits ahora es: ["1", "2", "", "4", "5", "6"]
      newDigits[index] = "";

      // c. Unimos el arreglo en un solo string y se lo enviamos al componente padre
      //    newDigits.join("") produce: "12456"
      onChange(newDigits.join(""));

      // d. Detenemos la ejecución de la función aquí
      return;
    }

    // 3. Tomamos solo el último dígito ingresado (en caso de que escriban rápido sobre un valor existente).
    const digit = cleanVal.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    
    // 4. Notificamos al padre con el nuevo string concatenado (ej: "123").
    const newOtp = newDigits.join("");
    onChange(newOtp);

    // 5. Salto automático: si no estamos en la última casilla, movemos el foco a la siguiente.
    if (index < length - 1) {
      focusInput(index + 1);
    }
  };

  /**
   - Manejo de teclas especiales para mejorar la experiencia de usuario (UX).
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Si presiona Backspace (Borrar):
    if (e.key === "Backspace") {
      // Si la casilla actual ya está vacía y no es la primera, borramos la casilla anterior y saltamos a ella.
      if (!digits[index] && index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        onChange(newDigits.join(""));
        focusInput(index - 1);
        e.preventDefault();
      }
    } 
    // Navegación con flecha izquierda: retrocede el cursor a la casilla anterior
    else if (e.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
      e.preventDefault();
    } 
    // Navegación con flecha derecha: avanza el cursor a la casilla siguiente
    else if (e.key === "ArrowRight" && index < length - 1) {
      focusInput(index + 1);
      e.preventDefault();
    }
  };

  /**
   - Se ejecuta cuando el usuario pega texto desde el portapapeles 
     (Ctrl+V / Cmd+V / Clic derecho pegar).
   */
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault(); // Evitamos el pegado por defecto del navegador en un solo input

    // 1. Obtenemos el texto del portapapeles, quitamos no-dígitos y cortamos al límite de casillas (ej: 6).
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pastedData) return;

    // 2. Enviamos el valor completo al padre.
    onChange(pastedData);

    // 3. Movemos el foco al siguiente input disponible o al último input llenado.
    const nextIndex = Math.min(pastedData.length, length - 1);
    focusInput(nextIndex);
  };

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3 w-full my-6">
      {digits.map((digit, index) => (
        <input
          key={index}
          /** 
           - Guardamos la referencia de cada input en nuestro arreglo inputRefs.
           - React nos entrega el nodo del input y lo guardamos en la posición
             correspondiente: 0, 1, 2, 3, 4 o 5
           */
          ref={(input) => {
            inputRefs.current[index] = input;
          }}
          type="text"
          inputMode="numeric"             // Muestra teclado numérico en dispositivos móviles
          pattern="[0-9]*"                // Refuerzo semántico para números
          maxLength={1}                   // Máximo 1 caracter por casilla
          value={digit}
          disabled={disabled}
          onChange={(e) => handleInputChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()} // Auto-selecciona el dígito al recibir foco para sobreescribir fácil
          className="w-11 h-13 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
          aria-label={`Dígito ${index + 1} del código de verificación`}
        />
      ))}
    </div>
  );
}

