import { useContext, useEffect, useState } from "react";
import { CarritoContext } from "../context/CartContex";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  IconButton,
  Box,
  Divider,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { generarVenta } from "../services/ventaService";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContex";

function CarritoPage() {
  const { carrito, eliminarDelCarrito, actualizarCantidad, vaciarCarrito } =
    useContext(CarritoContext);
  const { auth, loadingAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirigir al login si el usuario no está autenticado y la autenticación ya ha cargado
  useEffect(() => {
    if (!loadingAuth && !auth) {
      console.log("Usuario no autenticado. Redirigiendo a login.");
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [auth, loadingAuth, navigate, location.pathname]);

  const procesarVenta = async () => {
    if (carrito.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    setLoading(true);
    setError(null);

    const ventaDTO = {
      total: carrito.reduce(
        (acc, item) => acc + item.precio * item.cantidad,
        0
      ), // Calcula el total
      detalleVentaDTOS: carrito.map((item) => ({
        id_producto_variante: item.id,
        cantidad: item.cantidad,
        precio: item.precio,
        monto: item.precio * item.cantidad,
      })),
    };

    try {
      const resultadoVenta = await generarVenta(ventaDTO);
      console.log("Datos de la venta", resultadoVenta);
      alert("Venta realizada con éxito");
      vaciarCarrito(); // Limpiar el carrito después de la venta
      navigate("/"); // Redirigir a la página principal u otra página
    } catch (error) {
      console.error("Error al procesar la venta:", error);
      setError("Ocurrió un error al procesar la venta. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (carrito.length === 0) {
    return <Typography variant="h5">Tu carrito está vacío.</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={3}>
        {carrito.map((item) => (
          <Grid item xs={12} key={item.id}>
            <Card>
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                {/* Imagen del producto */}
                <Box sx={{ width: 100, height: 100, marginRight: 2 }}>
                  <img
                    src={
                      item.imagenes && item.imagenes.length > 0
                        ? item.imagenes[0]
                        : "https://via.placeholder.com/100"
                    }
                    alt={item.nombre}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                </Box>

                {/* Detalles del producto */}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{item.nombre}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Precio: BOB {item.precio.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Talla: {item.talla} |{" "}
                    <Box
                      component="span"
                      sx={{
                        display: "inline-block",
                        width: 20,
                        height: 20,
                        backgroundColor: item.color,
                        borderRadius: "50%",
                        border: "1px solid #ddd",
                      }}
                    ></Box>{" "}
                    Color
                  </Typography>
                </Box>

                {/* Botones de control de cantidad */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    size="small"
                    onClick={() =>
                      actualizarCantidad(item.id, item.cantidad - 1)
                    }
                    disabled={item.cantidad <= 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography variant="body1" sx={{ mx: 1 }}>
                    {item.cantidad}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() =>
                      actualizarCantidad(item.id, item.cantidad + 1)
                    }
                  >
                    <AddIcon />
                  </IconButton>
                </Box>

                {/* Botón para eliminar el producto */}
                <IconButton
                  color="secondary"
                  onClick={() => eliminarDelCarrito(item.id)}
                  sx={{ marginLeft: 2 }}
                >
                  <Tooltip title="Eliminar del carrito">
                    <DeleteIcon />
                  </Tooltip>
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Total del carrito y acciones */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 2,
            }}
          >
            <Typography variant="h6">
              Total: BOB{" "}
              {carrito
                .reduce(
                  (total, item) => total + item.precio * item.cantidad,
                  0
                )
                .toFixed(2)}
            </Typography>

            {/* Botón para vaciar el carrito */}
            <Button
              variant="outlined"
              color="secondary"
              onClick={vaciarCarrito}
              sx={{ marginRight: 2 }}
            >
              Vaciar Carrito
            </Button>

            {/* Botón para proceder con la compra */}
            <Button
              variant="contained"
              color="primary"
              onClick={procesarVenta}
              disabled={loading}
            >
              {loading ? "Procesando..." : "Realizar Compra"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CarritoPage;
