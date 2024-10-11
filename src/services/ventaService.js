import api from './api';

export const fetchVentas = async () => {
    try {
      const response = await api.get('/venta'); 
      if (Array.isArray(response.data)) {
        return response.data;
        }
    } catch (error) {
      console.error('La API no devolvió un array de ventas', error);
      return []; 
    }
  };

export const generarVenta = async (venta) => {
    try {
        const response = await api.post('/venta', venta);
        response.data
    } catch (error) {
        console.error('Error al realizar la venta:', error.response || error.message);
        throw error
    }
}