import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

// Función para decodificar un JWT
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const decoded = JSON.parse(jsonPayload);

    const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
    if (decoded.exp && decoded.exp < currentTime) {
      console.log('El token ha expirado');
      localStorage.removeItem('token');
      return null;
    }

    return decoded;
  } catch (e) {
    console.error('Error al decodificar el token', e);
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true); // Estado para controlar la carga

  // Verificar si hay un token en localStorage al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded) {
        setAuth({ token, role: decoded.role }); // Verifica si el token tiene un campo `role`
      } else {
        setAuth(null); // Si el token es inválido o expiró, limpiamos el estado
      }
    } else {
      setAuth(null); // Si no hay token, el usuario no está autenticado
    }
    setLoadingAuth(false); // Finaliza la carga de autenticación
  }, []);

  // Función para iniciar sesión (guardando el token)
  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = decodeJWT(token);
    if (decoded) {
      setAuth({ token, role: decoded.role }); // Establecer el role después del login
    } else {
      console.error("Token inválido después de iniciar sesión");
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("token");
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext);
};
