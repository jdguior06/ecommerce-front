import { createContext, useState, useEffect } from 'react';
export const CarritoContext = createContext();
export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

    // Cargar el carrito desde localStorage si existe
    useEffect(() => {
        const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));
        if (carritoGuardado) {
          setCarrito(carritoGuardado);
        }
      }, []);
      // Guardar el carrito en localStorage cada vez que cambie
      useEffect(() => {
        localStorage.setItem('carrito', JSON.stringify(carrito));
      }, [carrito]);

  // Función para añadir productos al carrito
  const añadirAlCarrito = (producto, cantidad) => {
    const productoExistente = carrito.find((item) => item.id === producto.id);
    if (productoExistente) {
      setCarrito(
        carrito.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad }]);
    }
  };

  // Función para eliminar productos del carrito
  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter((item) => item.id !== id));
  };

  // Función para actualizar la cantidad de un producto en el carrito
  const actualizarCantidad = (id, cantidad) => {
    setCarrito(
      carrito.map((item) =>
        item.id === id ? { ...item, cantidad } : item
      )
    );
  };

  const vaciarCarrito = () => {
    setCarrito([]);  // Limpia el carrito
    localStorage.removeItem('carrito');  // Borra el carrito guardado en localStorage
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        añadirAlCarrito,
        eliminarDelCarrito,
        actualizarCantidad,
        vaciarCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};
