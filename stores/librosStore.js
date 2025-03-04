// Importa defineStore de Pinia
import { defineStore } from "pinia";

// Define y exporta el store
export const useLibrosStore = defineStore("libros", {
  // Estado inicial del store
  state: () => ({
    libros: [], // Lista de libros
  }),

  // Acciones para modificar el estado
  actions: {
    // Agrega un nuevo libro a la lista
    agregarLibro(libro) {
      this.libros.push(libro);
    },

    // Obtiene la lista de libros desde la API
    async obtenerLibros() {
      try {
        const response = await fetch("https://localhost:7293/api/LibroMaterial");
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        this.libros = data; // Actualiza la lista de libros
      } catch (err) {
        console.error("Error al obtener los libros:", err);
      }
    },
  },
});