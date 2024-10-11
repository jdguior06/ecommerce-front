import { useState, useEffect, useContext } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Button, CardActions } from '@mui/material';
import { fetchProductos } from '../services/productoService'; 
import { CarritoContext } from '../context/CartContex'
import { useNavigate } from 'react-router-dom';

function ProductGrid() {
  const { añadirAlCarrito } = useContext(CarritoContext)
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Obtener los productos desde la API
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const data = await fetchProductos();
        setProductos(data);
      } catch (error) {
        setError('Error al cargar productos');
      } finally {
        setLoading(false);
      }
    };

    obtenerProductos();
  }, []);

  if (loading) {
    return <Typography variant="h6">Cargando productos...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <Grid container spacing={3} sx={{ padding: 3, width: '100%', margin: 0 }}>
      {productos.map((product) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
          <Card sx={{ height: '100%' }}>
            <CardMedia
              component="img"
              height="200"
              image={product.imagenes && product.imagenes.length > 0 ? product.imagenes[0] : 'https://via.placeholder.com/150'}
              alt={product.nombre}
            />
            <CardContent>
              <Typography variant="h6" component="div">
                {product.nombre}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                BOB {product.precio.toFixed(2)}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" onClick={() => navigate(`/producto/${product.id}`)}>
                Ver más
              </Button>
              <Button size="small" color="primary" onClick={() => añadirAlCarrito(product, 1)}>
                Añadir al carrito
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default ProductGrid;
