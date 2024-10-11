import api from './api'; // Importamos la configuración de Axios

export const fetchProductos = async () => {
  try {
    const response = await api.get('/producto'); // Supongo que tu endpoint es /producto
    if (Array.isArray(response.data)) {
      return response.data;
      }
  } catch (error) {
    console.error('Error al listar productos:', error);
    console.error('La API no devolvió un array de productos');
    return []; // Devuelve un array vacío si no es un array
  }
};

export const fetchProductoById = async (id) => {
  try {
    const response = await api.get(`/producto/${id}`); // Asegúrate de que tu backend soporte esta ruta
    return response.data;
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    return null;
  }
};


export const crearProducto = async (producto) => {
  try {
    const response = await api.post('/producto', producto);
    return response.data;
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }
};

export const modificarProducto = async (id, producto) => {
  try {
    const response = await api.put(`/producto/${id}`, producto); // Usamos PUT para actualizar
    return response.data;
  } catch (error) {
    console.error('Error al modificar producto:', error);
    throw error;
  }
};

export const desactivarProducto = async (id) => {
  try {
    const response = await api.patch(`/producto/${id}/desactivar`);
    return response.data;
  } catch (error) {
    console.error('Error al desactivar producto:', error);
    throw error;
  }
};
