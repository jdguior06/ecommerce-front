import React, { useState, useEffect } from 'react';
import { fetchProductos, crearProducto, modificarProducto, desactivarProducto } from '../../services/productoService'; // Servicios de productos
import { Button, IconButton, Collapse, Table, TableBody, TableCell, TableHead, TableRow, Typography, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ProductoModal from './modales/ProductoModal'; // Modal para crear/editar productos
import { fetchCategorias } from '../../services/categoriaService';

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null); // Para editar productos
  const [expandedRows, setExpandedRows] = useState({}); // Para controlar las filas expandidas

  // Obtener productos al cargar la página
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const [dataProductos, dataCategorias] = await Promise.all([
          fetchProductos(),
          fetchCategorias(),
        ]);
        setProductos(dataProductos);
        setCategorias(dataCategorias);
        console.log(dataProductos);
        console.log(dataCategorias);
      } catch (error) {
        setError('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };
    obtenerDatos();
  }, []);

  // Crear un nuevo producto
  const handleCrearProducto = () => {
    setSelectedProducto(null); // Reseteamos el producto seleccionado
    setModalOpen(true); // Abrimos el modal para crear un nuevo producto
  };

  // Editar un producto
  const handleEditProducto = (producto) => {
    setSelectedProducto(producto); // Cargamos el producto seleccionado
    setModalOpen(true); // Abrimos el modal para editar
  };

  // Guardar producto (crear o editar)
  const handleSaveProducto = async (producto) => {
    try {
      if (producto.id) {
        await modificarProducto(producto.id, producto); // Modificar producto
      } else {
        await crearProducto(producto); // Crear nuevo producto
      }
      const updatedProductos = await fetchProductos(); // Refrescamos la lista de productos
      setProductos(updatedProductos);
      setModalOpen(false); // Cerramos el modal
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  // Desactivar un producto
  const handleDesactivarProducto = async (id) => {
    try {
      await desactivarProducto(id);
      const updatedProductos = await fetchProductos(); // Refrescamos la lista de productos
      setProductos(updatedProductos);
    } catch (error) {
      console.error('Error al desactivar producto:', error);
    }
  };

  // Controlar la expansión de la fila para mostrar variantes
  const handleExpandRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id], // Alternar la expansión de la fila
    }));
  };

  if (loading) return <div>Cargando productos...</div>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Gestión de Productos
      </Typography>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <Button variant="contained" color="primary" onClick={handleCrearProducto} style={{ marginBottom: '20px' }}>
        + Crear Producto
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Precio</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Categoría</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Acciones</TableCell>
            <TableCell>Variantes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productos.map((producto) => (
            <>
              <TableRow key={producto.id}>
                <TableCell>{producto.id}</TableCell>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>{producto.descripcion}</TableCell>
                <TableCell>${producto.precio.toFixed(2)}</TableCell>
                <TableCell>{producto.stock_general}</TableCell>
                <TableCell>{producto.categoria ? producto.categoria.nombre : 'Sin categoría'}</TableCell>
                <TableCell style={{ color: producto.activo ? 'green' : 'red' }}>
                  {producto.activo ? 'Activo' : 'Inactivo'}
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEditProducto(producto)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDesactivarProducto(producto.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleExpandRow(producto.id)}>
                    <ExpandMoreIcon />
                  </IconButton>
                </TableCell>
              </TableRow>

              {/* Variantes del producto */}
              <TableRow>
                <TableCell colSpan={9}>
                  <Collapse in={expandedRows[producto.id]} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                      <Typography variant="h6">Variantes:</Typography>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Talla</TableCell>
                            <TableCell>Color</TableCell>
                            <TableCell>Stock</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {producto.variantes && producto.variantes.length > 0 ? (
                            producto.variantes.map((variante) => (
                              <TableRow key={variante.id}>
                                <TableCell>{variante.talla}</TableCell>
                                <TableCell>{variante.color}</TableCell>
                                <TableCell>{variante.stock}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3}>No hay variantes disponibles</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>

      {/* Modal para crear/editar productos */}
      <ProductoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveProducto}
        producto={selectedProducto}
        categorias={categorias}
      />
    </div>
  );
};

export default ProductosPage;
