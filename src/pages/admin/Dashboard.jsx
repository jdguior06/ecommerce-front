import * as React from 'react';
import { Box, AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom'; // Importamos useNavigate
import descarga from '../../assets/descarga.png'; // Aquí va tu logo personalizado
import { useAuth } from '../../context/AuthContex'; // Importa el contexto de autenticación

// Ancho del Drawer (Sidebar)
const drawerWidth = 240;

// Tema personalizado para el dashboard
const tiendaTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1e88e5', // Azul
    },
    secondary: {
      main: '#ff7043', // Naranja
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h6: {
      fontWeight: 'bold',
    },
    body1: {
      fontSize: '1rem',
    },
  },
});

// Menú de navegación
const NAVIGATION = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Productos', icon: <CategoryIcon />, path: '/dashboard/productos' },
  { text: 'Ventas', icon: <ShoppingCartIcon />, path: '/dashboard/ventas' },
  { text: 'Categorías', icon: <CategoryIcon />, path: '/dashboard/categorias' },
  { text: 'Pedidos', icon: <AttachMoneyIcon />, path: '/dashboard/pedidos' },
  { text: 'Clientes', icon: <PeopleIcon />, path: '/dashboard/clientes' },
  { text: 'Reportes', icon: <BarChartIcon />, path: '/dashboard/reportes' },
  { text: 'Integraciones', icon: <LayersIcon />, path: '/dashboard/integraciones' },
];

// Componente principal del Dashboard
function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false); 
  const { logout } = useAuth(); // Hook de autenticación
  const navigate = useNavigate(); // Hook de navegación

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    logout(); 
    navigate('/'); 
  };


  const drawer = (
    <div>
      <Toolbar sx={{ justifyContent: 'center', bgcolor: 'primary.main', color: 'white' }}>
        {/* Logo personalizado */}
        <img src={descarga} alt="Mi Tienda Logo" style={{ height: 40, marginRight: 10 }} />
        <Typography variant="h6">Mi Tienda</Typography>
      </Toolbar>
      <List>
        {NAVIGATION.map((item) => (
          <ListItem button key={item.text} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={tiendaTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        {/* AppBar - Encabezado */}
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            width: { sm: `calc(100% - ${drawerWidth}px)` }, // Ajusta el ancho del AppBar para pantallas grandes
            ml: { sm: `${drawerWidth}px` }, // Mueve el AppBar a la derecha cuando el Drawer está presente
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }} // Solo muestra el botón de menú en pantallas pequeñas
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Panel de Administración
            </Typography>

            {/* Botón de Cerrar Sesión */}
            <Button color="inherit" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </Toolbar>
        </AppBar>

        {/* Drawer para navegación en dispositivos móviles */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Mejor rendimiento en dispositivos móviles
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' }, 
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` }, 
            ml: { sm: `${drawerWidth}px` }, 
          }}
        >
          <Toolbar /> 
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Dashboard;
