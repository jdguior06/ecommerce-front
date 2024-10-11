import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { fetchProductoById } from '../services/productoService'; // Función para obtener el producto por ID
import { Box, Typography, Grid, Button, Avatar } from '@mui/material';
import Zoom from 'react-medium-image-zoom'; // Para zoom de imágenes
import 'react-medium-image-zoom/dist/styles.css'; // Estilos para el zoom
import { Carousel } from 'react-responsive-carousel'; // Carrusel para imágenes
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Estilos del carrusel
import { CarritoContext } from '../context/CartContex'; // Importar el contexto del carrito

const ProductoDetalles = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [varianteSeleccionada, setVarianteSeleccionada] = useState(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState('');

  const { añadirAlCarrito } = useContext(CarritoContext); // Acceder al contexto del carrito

  useEffect(() => {
    const cargarProducto = async () => {
      const data = await fetchProductoById(id);
      setProducto(data);
      if (data.variantes && data.variantes.length > 0) {
        setVarianteSeleccionada(data.variantes[0]); // Selecciona la primera variante por defecto
      }
      if (data.imagenes && data.imagenes.length > 0) {
        setImagenSeleccionada(data.imagenes[0]); // Imagen inicial seleccionada
      }
    };

    cargarProducto();
  }, [id]);

  const handleVarianteSeleccion = (variante) => {
    setVarianteSeleccionada(variante);
  };

  const handleAgregarAlCarrito = () => {
    if (varianteSeleccionada) {
      añadirAlCarrito({
        ...producto, // Añadir el producto completo
        id: varianteSeleccionada.id, // ID de la variante del producto
        talla: varianteSeleccionada.talla, // Talla seleccionada
        color: varianteSeleccionada.color, // Color seleccionado
        imagenes: producto.imagenes, // Añadir imágenes del producto
        cantidad: 1, // Cantidad inicial de 1
        precio: producto.precio, // Usar el precio del producto
      }, 1); // La cantidad inicial es 1
      alert('Producto añadido al carrito');
    } else {
      alert('Por favor, selecciona una variante');
    }
  };

  return producto ? (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <Grid container spacing={4}>
        {/* Sección de imágenes del producto con carrusel y zoom */}
        <Grid item xs={12} md={6}>
          {/* Carrusel de imágenes */}
          {producto.imagenes && producto.imagenes.length > 0 ? (
            <Carousel
              showArrows={true}
              showThumbs={true}
              dynamicHeight={true}
              onChange={(index) => setImagenSeleccionada(producto.imagenes[index])}
              selectedItem={producto.imagenes.indexOf(imagenSeleccionada)}
            >
              {producto.imagenes.map((imagen, index) => (
                <div key={index}>
                  <Zoom>
                    <img
                      src={imagen}
                      alt={producto.nombre}
                      style={{ width: '100%', height: '400px', objectFit: 'contain' }}
                    />
                  </Zoom>
                </div>
              ))}
            </Carousel>
          ) : (
            <Typography>No hay imágenes disponibles.</Typography>
          )}
        </Grid>

        {/* Sección de detalles del producto */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>{producto.nombre}</Typography>
          <Typography variant="body1" gutterBottom>{producto.descripcion}</Typography>
          <Typography variant="h5" gutterBottom>Precio: BOB {producto.precio.toFixed(2)}</Typography>

          {/* Variantes del producto */}
          <Typography variant="h6" gutterBottom>Selecciona una variante:</Typography>
          <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
            {producto.variantes.map((variante, index) => (
              <Button
                key={index}
                onClick={() => handleVarianteSeleccion(variante)}
                variant={varianteSeleccionada?.id === variante.id ? 'contained' : 'outlined'}
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <div
                  style={{
                    width: '25px',
                    height: '25px',
                    borderRadius: '50%',
                    backgroundColor: variante.color,
                    border: '1px solid #ccc',
                  }}
                />
                <Typography>{variante.talla}</Typography>
              </Button>
            ))}
          </Box>

          {/* Mostrar stock de la variante seleccionada */}
          {varianteSeleccionada && (
            <Typography variant="body2">
              Talla seleccionada: {varianteSeleccionada.talla} - Stock disponible: {varianteSeleccionada.stock}
            </Typography>
          )}

          {/* Botón para añadir al carrito */}
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            onClick={handleAgregarAlCarrito}
          >
            Añadir al Carrito
          </Button>
        </Grid>
      </Grid>
    </Box>
  ) : (
    <Typography>Cargando detalles del producto...</Typography>
  );
};

export default ProductoDetalles;
