import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import { SketchPicker } from "react-color"; // Librería para seleccionar color
import Dropzone, { useDropzone } from "react-dropzone"; // Librería para arrastrar y soltar archivos

const tallasPredefinidas = ["XS", "S", "M", "L", "XL", "XXL"]; // Lista de tallas predefinidas

const ProductoModal = ({
  open,
  onClose,
  onSave,
  producto,
  categorias = [],
}) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [variantes, setVariantes] = useState([]);
  const [imagenes, setImagenes] = useState([]); // Estado para las imágenes
  const [nuevaVariante, setNuevaVariante] = useState({
    talla: "",
    color: "",
    stock: "",
  });
  const [colorSeleccionado, setColorSeleccionado] = useState("#000000"); // Estado para el color
  // Si estás editando, carga los datos del producto seleccionado
  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre);
      setDescripcion(producto.descripcion);
      setPrecio(producto.precio);
      setCategoria(producto.categoria ? producto.categoria.id : "");
      setVariantes(producto.variantes || []);
      setImagenes(producto.imagenes || []); // Cargar imágenes si el producto ya tiene
    } else {
      // setNombre('');
      // setDescripcion('');
      // setPrecio('');
      // setCategoria('');
      // setVariantes([]);
      // setImagenes([]);
      limpiarFormulario();
    }
  }, [producto]);

  //limpieza del formulario cuando el modal se cierra
  useEffect(() => {
    if (!open) {
      limpiarFormulario();
    }
  }, [open]);

  const limpiarFormulario = () => {
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setCategoria("");
    setVariantes([]);
    setImagenes([]);
    setNuevaVariante({ talla: "", color: "", stock: "" });
    setColorSeleccionado("#000000");
  };

  //Subir imagenes a cloudinary
  const handleDrop = async (acceptedFiles) => {
    const uploadedImages = [];
    for (let file of acceptedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ecommerce_si");
      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/ds7majeoq/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        uploadedImages.push(data.secure_url);
      } catch (error) {
        console.error("Error al subir la imagen:", error);
      }
    }
    setImagenes([...imagenes, ...uploadedImages]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    multiple: true,
    onDrop: handleDrop,
  });

  // Validación para agregar variantes
  const handleAgregarVariante = () => {
    if (!nuevaVariante.talla || !colorSeleccionado || !nuevaVariante.stock) {
      alert("Todos los campos de la variante son requeridos");
      return;
    }

    setVariantes([
      ...variantes,
      {
        ...nuevaVariante,
        color: colorSeleccionado,
        stock: parseInt(nuevaVariante.stock, 10),
      },
    ]);
    setNuevaVariante({ talla: "", color: "", stock: "" }); // Limpiar variante actual
    setColorSeleccionado("#000000"); // Resetear color
  };

  // Manejar el guardado del producto
  const handleGuardar = () => {
    if (!nombre || !descripcion || !precio || !categoria) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const nuevoProducto = {
      nombre,
      descripcion,
      precio: parseFloat(precio),
      id_categoria: categoria, // Asegurarse que categoría tenga el formato correcto
      variantes,
      imagenes,
    };
    console.log("Producto a guardar:", nuevoProducto);
    onSave(nuevoProducto); // Llamar al método onSave del padre
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {producto ? "Editar Producto" : "Crear Producto"}
      </DialogTitle>
      <DialogContent>
        {/* Nombre */}
        <TextField
          label="Nombre"
          fullWidth
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          margin="dense"
        />

        {/* Descripción */}
        <TextField
          label="Descripción"
          fullWidth
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          margin="dense"
          multiline
          rows={3}
        />

        {/* Precio */}
        <TextField
          label="Precio"
          fullWidth
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          margin="dense"
        />

        {/* Categoría */}
        <TextField
          select
          label="Categoría"
          fullWidth
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          margin="dense"
        >
          {categorias.length > 0 ? (
            categorias.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.nombre}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No hay categorías disponibles</MenuItem>
          )}
        </TextField>

        {/* Variantes */}
        <Typography variant="h6" gutterBottom style={{ marginTop: "20px" }}>
          Variantes
        </Typography>

        <TextField
          select
          label="Talla"
          fullWidth
          value={nuevaVariante.talla}
          onChange={(e) =>
            setNuevaVariante({ ...nuevaVariante, talla: e.target.value })
          }
          margin="dense"
        >
          {tallasPredefinidas.map((talla) => (
            <MenuItem key={talla} value={talla}>
              {talla}
            </MenuItem>
          ))}
        </TextField>

        {/* Selección de color */}
        <Typography variant="subtitle1" style={{ marginTop: "10px" }}>
          Seleccionar Color
        </Typography>
        <SketchPicker
          color={colorSeleccionado}
          onChangeComplete={(color) => setColorSeleccionado(color.hex)}
        />

        <TextField
          label="Stock"
          type="number"
          fullWidth
          value={nuevaVariante.stock}
          onChange={(e) =>
            setNuevaVariante({ ...nuevaVariante, stock: e.target.value })
          }
          margin="dense"
        />

        <Button
          onClick={handleAgregarVariante}
          variant="contained"
          style={{ marginTop: "10px" }}
        >
          Agregar Variante
        </Button>

        {/* Lista de variantes agregadas */}
        {variantes.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle1">Variantes agregadas:</Typography>
            {variantes.map((variante, index) => (
              <div key={index}>
                {variante.talla} - {variante.color} - {variante.stock}
              </div>
            ))}
          </Box>
        )}

        {/* Carga de imágenes con estilo */}
        <Typography variant="h6" gutterBottom style={{ marginTop: "20px" }}>
          Imágenes del producto
        </Typography>
        <Dropzone onDrop={handleDrop} accept="image/*" multiple>
          {({ getRootProps, getInputProps }) => (
            <Box
              {...getRootProps()}
              p={2}
              border="2px dashed #ccc"
              textAlign="center"
            >
              <input {...getInputProps()} />
              <Typography variant="body1">
                Arrastra y suelta las imágenes aquí, o haz clic para seleccionar
                archivos
              </Typography>
            </Box>
          )}
        </Dropzone>
        <Box display="flex" gap="10px" mt={2}>
          {imagenes.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Imagen ${index}`}
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleGuardar} color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductoModal;
