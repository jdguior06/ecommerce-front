import { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ChevronDownIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { CarritoContext } from "../context/CartContex";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContex";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [carritoOpen, setCarritoOpen] = useState(false);
  const { carrito } = useContext(CarritoContext);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { auth } = useAuth();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleCarrito = (open) => {
    setCarritoOpen(open);
  };

  const handleLogout = () => {
    logout(); // Elimina el token de autenticación y limpia el estado
    navigate("/"); // Redirige al home
  };

  const handleLogin = () => {
    navigate("/login"); // Redirige a la página de login
  };

  return (
    <header>
      <AppBar
        position="fixed"
        sx={{ backgroundColor: "#1a1a1a", boxShadow: "none" }}
      >
        <Toolbar sx={{ padding: "0 2rem" }}>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: "bold", color: "#f0f0f0" }}
          >
            Fashion JD
          </Typography>
          <Button
            color="inherit"
            endIcon={<ChevronDownIcon />}
            onClick={handleMenuClick}
            sx={{
              color: "#f0f0f0",
              fontSize: "1rem",
              fontWeight: 500,
              "&:hover": { backgroundColor: "transparent", color: "#e0e0e0" },
            }}
          >
            Productos
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              "& .MuiMenu-paper": {
                backgroundColor: "#2c2c2c",
                color: "#f0f0f0",
              },
            }}
          >
            <MenuItem onClick={handleMenuClose}>Producto 1</MenuItem>
            <MenuItem onClick={handleMenuClose}>Producto 2</MenuItem>
            <MenuItem onClick={handleMenuClose}>Producto 3</MenuItem>
          </Menu>

          {/* <Button color="inherit"
            sx={{ color: "#f0f0f0", fontSize: "1rem", fontWeight: 500,
              "&:hover": { backgroundColor: "transparent", color: "#e0e0e0" },
            }}
          >
            Características
          </Button> */}
          {auth?.role?.includes("ROLE_ADMIN") && (
            <Button
              component={Link}
              to="/dashboard"
              color="inherit"
              sx={{
                color: "#f0f0f0",
                fontSize: "1rem",
                fontWeight: 500,
                "&:hover": { backgroundColor: "transparent", color: "#e0e0e0" },
              }}
            >
              Gestionar tienda
            </Button>
          )}
          {auth ? (
            <Button color="inherit" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          ) : (
            // Si no está autenticado, mostrar el botón de Iniciar Sesión
            <Button color="inherit" onClick={handleLogin}>
              Iniciar Sesión
            </Button>
          )}
          <Button
            color="inherit"
            sx={{
              color: "#f0f0f0",
              fontSize: "1rem",
              fontWeight: 500,
              "&:hover": { backgroundColor: "transparent", color: "#e0e0e0" },
            }}
          >
            Empresa
          </Button>

          {/* Icono del carrito con Badge para mostrar cantidad */}
          <IconButton
            color="inherit"
            sx={{ color: "#f0f0f0" }}
            onClick={() => toggleCarrito(true)}
          >
            <Badge badgeContent={carrito.length} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          {/* Menú móvil (aparece solo en pantallas pequeñas) */}
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" }, color: "#f0f0f0" }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={carritoOpen}
        onClose={() => toggleCarrito(false)}
      >
        <Box
          sx={{
            width: "300px",
            backgroundColor: "#f4f4f4",
            height: "100%",
            padding: 2,
          }}
        >
          <IconButton onClick={() => toggleCarrito(false)}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Tu Carrito
          </Typography>
          {carrito.length === 0 ? (
            <Typography variant="body1">El carrito está vacío.</Typography>
          ) : (
            <List>
              {carrito.map((item) => (
                <ListItem
                  key={item.id}
                  sx={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}
                >
                  <img
                    src={item.imagenes[0]}
                    alt={item.nombre}
                    style={{ width: 50, height: 50, marginRight: 10 }}
                  />
                  <ListItemText
                    primary={item.nombre}
                    secondary={`Cantidad: ${
                      item.cantidad
                    } - Precio: BOB ${item.precio.toFixed(2)}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
          {carrito.length > 0 && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                toggleCarrito(false); // Cerrar el Drawer
                navigate("/carrito"); // Navegar a la página completa del carrito
              }}
            >
              Ver Carrito Completo
            </Button>
          )}
        </Box>
      </Drawer>

      {/* Menú móvil usando Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", sm: "none" },
          backgroundColor: "#1a1a1a",
        }}
      >
        <Box
          sx={{
            width: "250px",
            backgroundColor: "#1a1a1a",
            color: "#f0f0f0",
            height: "100%",
          }}
        >
          <IconButton onClick={handleDrawerToggle} sx={{ color: "#f0f0f0" }}>
            <CloseIcon />
          </IconButton>
          <List>
            {/* <ListItem button>
              <ListItemText primary="Productos" sx={{ color: "#f0f0f0" }} />
            </ListItem>
            <ListItem button>
              <ListItemText
                primary="Características"
                sx={{ color: "#f0f0f0" }}
              />
            </ListItem> */}
            <ListItem button>
              <ListItemText primary="Marketplace" sx={{ color: "#f0f0f0" }} />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Empresa" sx={{ color: "#f0f0f0" }} />
            </ListItem>
            <ListItem button>
              <ListItemText
                primary="Iniciar sesión"
                sx={{ color: "#f0f0f0" }}
              />
            </ListItem>
            <Button color="inherit" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </List>
        </Box>
      </Drawer>
    </header>
  );
}
