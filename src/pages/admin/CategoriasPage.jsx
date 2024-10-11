import React, { useState, useEffect } from "react";
import {
  fetchCategorias,
  crearCategoria,
  desactivarCategoria,
  modificarCategoria,
} from "../../services/categoriaService";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Switch,
  TextField,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CategoriaEditModal from "./modales/CategoriaEditModal";

const CategoriasPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [mostrarInactivas, setMostrarInactivas] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  // Cargar categorías al cargar la página
  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const data = await fetchCategorias();
        setCategorias(data);
      } catch (error) {
        setError("Error al cargar las categorías");
      } finally {
        setLoading(false);
      }
    };
    obtenerCategorias();
  }, []);

  // Manejar la creación de una nueva categoría
  const handleCrearCategoria = async () => {
    if (nuevaCategoria.trim() === '') return; // Prevenir creación de categoría vacía

    try {
      setLoading(true);
      setError(null); // Resetear errores
      const categoria = { nombre: nuevaCategoria };
      const nueva = await crearCategoria(categoria);
      setCategorias([...categorias, nueva]); // Añadir la nueva categoría a la lista
      setNuevaCategoria(''); // Limpiar el input
      setSuccess(true); // Mostrar mensaje de éxito
    } catch (error) {
      console.error('Error al crear categoría:', error);
      setError('Error al crear la categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategoria = (categoria) => {
    setSelectedCategoria(categoria);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (categoriaActualizada) => {
    try {
      setLoading(true);
      await modificarCategoria(categoriaActualizada.id, {
        nombre: categoriaActualizada.nombre,
      });
      setCategorias(
        categorias.map((cat) =>
          cat.id === categoriaActualizada.id ? categoriaActualizada : cat
        )
      ); // Actualizar la lista
      setEditModalOpen(false); // Cerrar el modal
    } catch (error) {
      console.error("Error al modificar categoría:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDesactivarCategoria = async (id) => {
    try {
      await desactivarCategoria(id);
      setCategorias(
        categorias.map((cat) =>
          cat.id === id ? { ...cat, activo: false } : cat
        )
      ); // Marcar como inactivo
    } catch (error) {
      console.error("Error al desactivar categoría:", error);
    }
  };

  if (loading) return <div>Cargando categorías...</div>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestión de Categorías
      </Typography>

      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && (
        <div style={{ color: "green" }}>Categoría creada con éxito</div>
      )}

      {/* Filtros y creación de categoría */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          label="Nueva categoría"
          variant="outlined"
          size="small"
          value={nuevaCategoria}
          onChange={(e) => setNuevaCategoria(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCrearCategoria}
        >
          Crear Categoría
        </Button>
        <Box display="flex" alignItems="center">
          <Typography variant="body1">Mostrar inactivas</Typography>
          <Switch
            checked={mostrarInactivas}
            onChange={() => setMostrarInactivas(!mostrarInactivas)}
          />
        </Box>
      </Box>

      {/* Tabla de categorías */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>ID</strong>
              </TableCell>
              <TableCell>
                <strong>Nombre</strong>
              </TableCell>
              <TableCell>
                <strong>Estado</strong>
              </TableCell>
              <TableCell>
                <strong>Acciones</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categorias
              .filter((categoria) => mostrarInactivas || categoria.activo) // Filtrar por estado
              .map((categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell>{categoria.id}</TableCell>
                  <TableCell>{categoria.nombre}</TableCell>
                  <TableCell>
                    {categoria.activo ? (
                      <Typography color="green">Activa</Typography>
                    ) : (
                      <Typography color="red">Inactiva</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditCategoria(categoria)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDesactivarCategoria(categoria.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <CategoriaEditModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveEdit}
          categoria={selectedCategoria}
        />
      </TableContainer>
    </Box>
  );
};

export default CategoriasPage;
