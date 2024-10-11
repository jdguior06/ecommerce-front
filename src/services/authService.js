import api from './api'; 

export const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    console.log("Respuesta del login API:", response);

    if (response.status === 200) {
      const data = response.data;
      console.log("Token recibido:", data.token);
      localStorage.setItem('token', data.token);
      return { success: true, token: data.token };
    }
    return { success: false, message: 'Credenciales incorrectas' };
  } catch (error) {
    console.error('Error en la autenticación:', error);
    return { success: false, message: 'Error al iniciar sesión' };
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error durante el registro:', error);
    throw error;
  }
};