import api from './api';

export const fetchCategorias = async () => {
  try {
    const response = await api.get('/categoria');
    return response.data;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error;
  }
};

export const crearCategoria = async (categoria) => {
  try {
    const response = await api.post('/categoria', categoria);
    return response.data;
  } catch (error) {
    console.error('Error al crear categoría:', error);
    throw error;
  }
};

export const modificarCategoria = async (id, categoria) => {
    try {
        const response = await api.patch(`/categoria/${id}`, categoria);
        return response.data
    } catch (error) {
        console.error('Error al modificar una categoria')
        throw error;
    }
}

export const desactivarCategoria = async (id) => {
    try {
        const response = await api.patch(`/categoria/${id}/desactivar`);
        return response.data
    } catch (error) {
        console.error('Error al desactivar una categoria')
        throw error;
    }
}
