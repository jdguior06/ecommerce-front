import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContex';

const AdminRoute = ({ children }) => {
  const { auth, loadingAuth } = useAuth(); // Añadir loadingAuth para controlar la carga

  if (loadingAuth) {
    // Mostrar un indicador de carga mientras se verifica la autenticación
    return <div>Cargando autenticación...</div>;
  }

  if (!auth || !auth.role || !auth.role.includes('ROLE_ADMIN')) {
    // Si no está autenticado o no tiene el rol de admin, redirigir al home o login
    return <Navigate to="/" />;
  }

  // Si es admin, renderizar el componente hijo
  return children;
};

export default AdminRoute;
