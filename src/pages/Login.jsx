import { Alert, Box, Button, CircularProgress, Container, Paper, TextField, Typography, Link } from '@mui/material';
import { login as loginService } from '../services/authService';  // Renombrado para evitar conflicto de nombres
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContex';  // Importamos el hook de autenticación

function Login() {
  const { login } = useAuth(); // Obtener la función login del contexto
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Estado para manejar la carga

  const location = useLocation(); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await loginService(username, password); // Simulación del servicio de autenticación
    setLoading(false); // Finalizar el estado de carga

    if (result.success) {
      console.log("Login exitoso. Token:", result.token);
      login(result.token);  // Aquí llamamos al login del contexto para guardar el token
      const from = location.state?.from || '/'; // Redirigir a la página anterior o al home
      navigate(from); 
    } else {
      setError(result.message);
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register"); // Redirigir a la página de registro
  };

  const handleCancel = () => {
    navigate("/"); // Redirigir al home
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ padding: 4, marginTop: 8 }}>
        {/* Encabezado principal */}
        <Typography component="h1" variant="h4" align="center" gutterBottom sx={{ color: '#1a73e8', fontWeight: 'bold' }}>
          Bienvenido de Nuevo
        </Typography>
        <Typography component="p" align="center" sx={{ color: '#757575', marginBottom: 4 }}>
          Inicia sesión con tus credenciales
        </Typography>

        {/* Mostrar el mensaje de error */}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Usuario"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: '#1a73e8', ':hover': { backgroundColor: '#155ab7' } }}
            disabled={loading} // Deshabilitar el botón cuando se está autenticando
          >
            {loading ? <CircularProgress size={24} /> : 'Iniciar Sesión'}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={handleCancel}
            sx={{ mb: 2 }}
          >
            Cancelar
          </Button>

          {/* Enlace para redirigir al formulario de registro */}
          <Typography align="center" sx={{ mt: 2 }}>
            ¿No tienes cuenta?{' '}
            <Link onClick={handleRegisterRedirect} sx={{ cursor: 'pointer', color: '#1a73e8' }}>
              Regístrate aquí
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
