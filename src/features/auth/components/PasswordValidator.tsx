interface Props {
  password: string;
  isFocused: boolean;
}

export function PasswordValidator({ password, isFocused }: Props) {
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasSymbol = /[!@#$&*]/.test(password);  

  if (!isFocused) return null;

  return (
    <div className="mt-3 text-sm transition-all duration-300">

      <ul className="space-y-1 text-gray-500">
        <li className={`flex items-center gap-1.5 ${hasLength ? "text-green-600" : ""}`}>
          {hasLength ? (
            <div className="w-2.5 h-2.5 bg-green-600 rounded-full"></div>
          ) : (
            <div className="w-2.5 h-2.5 bg-white border border-gray-400 rounded-full"></div>
          )}
          <p>Al menos 8 caracteres{hasLength && <span className="ml-1">✓</span>}</p>
        </li>
        
        <li className={`flex items-center gap-1.5 ${hasUpper ? "text-green-600" : ""}`}>
          {hasUpper ? (
            <div className="w-2.5 h-2.5 bg-green-600 rounded-full"></div>
          ) : (
            <div className="w-2.5 h-2.5 bg-white border border-gray-400 rounded-full"></div>
          )}
          <p>Una letra mayúscula {hasUpper && <span>✓</span>}</p>
        </li>

        <li className={`flex items-center gap-1.5 ${hasSymbol ? "text-green-600" : ""}`}>
          {hasSymbol ? (
            <div className="w-2.5 h-2.5 bg-green-600 rounded-full"></div>
          ) : (
            <div className="w-2.5 h-2.5 bg-white border border-gray-400 rounded-full"></div>
          )}
          <p>Un símbolo especial (!@#$&*) {hasSymbol && <span>✓</span>}</p>
        </li>
      </ul>
    </div>
  );
}
