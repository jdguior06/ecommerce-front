import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Dashboard from "./pages/admin/Dashboard";
import PrivateRoutes from "./routes/PrivateRoutes";
import AdminRoute from "./routes/AdminRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CategoriasPage from "./pages/admin/CategoriasPage";
import ProductosPage from "./pages/admin/ProductosPage";
import { CarritoProvider } from "./context/CartContex";
import CarritoPage from "./pages/CarritoPage";
import ProductoDetalles from "./pages/ProductoDetalles";
import { AuthProvider } from "./context/AuthContex";

function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="producto/:id" element={<ProductoDetalles />} />
              <Route path="carrito" element={<CarritoPage />} />
            </Route>
            <Route element={<PrivateRoutes />}>
              {/* Rutas específicas para administradores */}
              <Route
                path="/dashboard"
                element={
                  <AdminRoute>
                    <Dashboard />
                  </AdminRoute>
                }
              >
                <Route path="categorias" element={<CategoriasPage />} />
                <Route path="productos" element={<ProductosPage />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;
