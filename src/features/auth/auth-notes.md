## Login & Register

Las acciones se ejecutan de manera asíncrona pero la navegación de react-router-dom 
debe estar sincronizada con el árbol de componentes. Por esa razon, debemos usar
el useEffect para la redirección, en vez de redireccionar en la acción directamente.

Si usamos redirect en la acción, nos puede dar error de concurrencia ya que 
react-router-dom espera que la redirección se haga desde el árbol de componentes.

Toda la lógica de redirección está a cargo del hook <useAuthRedirect/>

- **window.location.replace("/")** -> Elimina /login del history stack -> el botón "Atrás" no lleva a /login
- **navigate(redirectTo, { replace: true })** -> Hace lo mismo que window.location.replace pero dentro de React Router. Esta vez sin recargar la página, ya que es una navegacion desde /register hasta /verify-email.
- **Listener pageshow** -> Previene un crash de React cuando el navegador restaura la página desde bfcache

**Porque se usa un hasRedirected = useRef()**
window.location.replace() programa la navegación pero no detiene la ejecución del JavaScript del frame actual. Por esa razon, React se sigue ejecutando. Si hay un re-render entre que se dispara el replace y la descarga del documento, podrías ver warnings de React o comportamiento inesperado. 

La idea es simple: un useRef que actúa como latch (cerrojo).
- Se dispara la navegación.
- Se establece hasRedirected.current = true.
- React hace su ciclo de re-render/limpieza.
- HasRedirected ya está en true, así que el useEffect no vuelve a disparar el replace.


## Rehidratar luego del Login

Cuando se dice rehidratar, significa que luego del login debe haber una recarga (forceReload) 
para poder tener los datos de la sesion del usuario actualizados.

**¿Por qué ocurre esto en una SPA (Single Page Application)?**
El inicio de sesión genera una Cookie: Cuando inicias sesión con éxito, el servidor responde y le dice al navegador: "Guarda esta cookie de sesión better-auth.session_token".

El estado en memoria de React aún no se ha enterado: En React, componentes como tu <Navbar />, <ProtectedRoute /> o hooks como useSession() tienen su propio estado en la memoria RAM del navegador. Si solo hiciéramos una navegación interna de React Router (navigate("/")), algunos componentes podrían seguir creyendo momentáneamente que el usuario es null (no autenticado), causando parpadeos o que una ruta protegida te devuelva al login por una milésima de segundo.

**Qué hace la recarga completa (forceReload: true = window.location.replace)**
Al recargar la página:
- Todo el árbol de componentes de React se inicia desde cero.
- useSession() se ejecuta inmediatamente leyendo la nueva cookie.
- Toda la aplicación arranca 100% sincronizada con el usuario autenticado.

**¿Por qué lo usamos en Login y no en Registro?**
- En el Registro (RegisterPage): Solo vamos de una pantalla pública (/register) a otra pantalla pública (/verify-email), por lo que una navegación rápida y suave con navigate es ideal (no hay sesión que sincronizar todavía).

- En el Login (LoginPage) y Verificación final (VerifyEmailPage): Aquí es donde el usuario pasa de ser un invitado a un usuario autenticado. La recarga limpia asegura que todas las rutas protegidas y la barra de navegación reconozcan la sesión al instante sin ningún desfase.

**¿Por qué es necesario el listener en <main/>?**
replace controla a dónde lleva el botón Atrás, pero no controla cómo el navegador carga esa página. El listener resuelve un escenario diferente:

1. Usuario hace login → `window.location.replace("/")` → está en `/` (home)
2. `/login` ya no está en el history. Perfecto.
3. El usuario sale del sitio (navega a Google, cierra la pestaña y la restaura, etc.)
4. Luego presiona "Atrás" o reabre la pestaña → el navegador restaura el snapshot congelado desde el bfcache
5. En ese snapshot, el árbol de React está a medias: dispatchers internos son `null` lo que se traduce en un error -> "Invalid hook call".
6. El listener captura ese momento (`event.persisted === true`) y fuerza un `reload()` limpio.


## Uso de Pattern y Validacion Progresiva en Register page

El atributo HTML5 "pattern" obliga al navegador a validar la contraseña mediante una 
expresión regular antes de enviar el formulario. Esto mejora enormemente la UX, 
ya que evita que el usuario tenga que esperar la respuesta del servidor solo 
para descubrir que le faltaba una mayúscula o un símbolo.

Teniendo el password en un state, se lo enviamos al componente PasswordValidator a traves
de las props para poder hacer validación progresiva.

**PasswordValidator.tsx**
PROGRESSIVE DISCLOSURE (Validación Progresiva):
En lugar de mostrar un gran mensaje de error cuando el usuario se equivoca al enviar,
evaluamos la contraseña en tiempo real mientras escribe. Mostramos visualmente qué
requisitos ya cumplió y cuáles le faltan, guiándolo paso a paso.