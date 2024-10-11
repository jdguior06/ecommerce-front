import { Typography, Box, Link, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';  // Importar el icono de GitHub

function Footer() {
  return (
    <Box
      sx={{
        bgcolor: 'black',  // Fondo negro
        color: '#bdbdbd',  // Color gris claro para el texto
        p: 3,
        textAlign: 'center',  // Centrar el texto
      }}
    >
      {/* Texto de derechos reservados */}
      <Typography variant="body2" align="center" sx={{ mb: 2 }}>
        © 2024 Mi Tienda. Todos los derechos reservados.
      </Typography>

      {/* Enlaces y el logo de GitHub */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem' }}>
        <Link
          to="/privacy-policy"
          color="inherit"
          sx={{
            textDecoration: 'none',
            ':hover': { color: 'white' },  // Cambia el color a blanco al pasar el cursor
          }}
        >
          Política de Privacidad
        </Link>
        <Link
          to="/terms-of-use"
          color="inherit"
          sx={{
            textDecoration: 'none',
            ':hover': { color: 'white' },
          }}
        >
          Términos de Uso
        </Link>
        <Link
          to="/contact"
          color="inherit"
          sx={{
            textDecoration: 'none',
            ':hover': { color: 'white' },
          }}
        >
          Contacto
        </Link>

        {/* Agregar el icono de GitHub con espaciado adecuado */}
        <IconButton
          component="a"
          href="https://github.com/jdguior/ecommerce-front"  // Cambia esto por tu cuenta de GitHub
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: '#bdbdbd',  // Mismo color gris que el texto
            ':hover': { color: 'white' },  // Cambia el color a blanco al pasar el cursor
            fontSize: '1.5rem',
          }}
        >
          <GitHubIcon fontSize="large" />
        </IconButton>
      </Box>
    </Box>
  );
}

export default Footer;

