import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const CategoriaEditModal = ({ open, onClose, onSave, categoria }) => {
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    if (categoria) {
      setNombre(categoria.nombre); // Inicializamos el campo con el nombre de la categoría actual
    }
  }, [categoria]);

  const handleSave = () => {
    onSave({ ...categoria, nombre }); // Guardamos los cambios
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Categoría</DialogTitle>
      <DialogContent>
        <TextField
          label="Nombre de la categoría"
          fullWidth
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoriaEditModal;
