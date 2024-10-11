import ProductGrid from '../components/ProductGrid';   
import { Box } from '@mui/material';

function Home() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* El ProductGrid ocupará todo el espacio disponible */}
      <Box sx={{ flexGrow: 1 }}>
        <ProductGrid />
      </Box>
    </Box>
  );
}

export default Home;
