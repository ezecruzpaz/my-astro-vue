<template>
  <div class="container">
    <h1 class="title">Lista de Libros</h1>

    <!-- Campo de búsqueda por Nombre -->
    <div class="search-container">
      <input
        v-model="busquedaNombre"
        type="text"
        placeholder="Buscar libro por Nombre"
        class="search-input"
      />
    </div>

    <!-- Tabla de libros -->
    <div v-if="librosFiltrados.length" class="table-container">
      <table class="book-table">
        <thead>
          <tr>
            <th class="header">Título</th>
            <th class="header">Fecha de publicación</th>
            <th class="header">Nombre del autor</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="libro in librosFiltrados" :key="libro.libreriaMaterialId" class="book-row">
            <td class="cell">{{ libro.titulo }}</td>
            <td class="cell">{{ formatFecha(libro.fechaPublicacion) }}</td>
            <td class="cell">{{ obtenerNombreAutor(libro.autorLibroId) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mensajes de carga y error -->
    <p v-else-if="loading" class="loading">Cargando libros...</p>
    <p v-else-if="busquedaNombre && !librosFiltrados.length" class="error">No se encontró ningún libro con el Nombre ingresado.</p>
    <p v-else class="error">No se encontraron libros o hubo un error.</p>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
  setup() {
    const libros = ref([]);
    const autores = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const busquedaNombre = ref('');

    const formatFecha = (fecha) => {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    const obtenerLibros = async () => {
      try {
        const response = await fetch('https://librerias.somee.com/api/LibroMaterial');
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        libros.value = data;
      } catch (err) {
        error.value = err.message;
        console.error('Error al obtener los libros:', err);
      } finally {
        loading.value = false;
      }
    };

    const obtenerAutores = async () => {
      try {
        const response = await fetch('http://localhost:5080/api/Autor');
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        autores.value = data;
      } catch (err) {
        error.value = err.message;
        console.error('Error al obtener los autores:', err);
      }
    };

    const obtenerNombreAutor = (autorId) => {
      const autor = autores.value.find(a => a.autorLibroId === autorId);
      return autor ? `${autor.nombre} ${autor.apellido}` : 'Desconocido';
    };

    const librosFiltrados = computed(() => {
      if (!busquedaNombre.value) {
        return libros.value;
      }
      return libros.value.filter((libro) =>
        libro.titulo.toLowerCase().includes(busquedaNombre.value.toLowerCase())
      );
    });

    onMounted(async () => {
      await obtenerAutores(); // Primero obtener los autores
      await obtenerLibros();  // Luego obtener los libros
    });

    return {
      libros,
      autores,
      loading,
      error,
      busquedaNombre,
      librosFiltrados,
      formatFecha,
      obtenerNombreAutor,
    };
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Roboto', sans-serif;
}

.title {
  font-size: 2.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
  font-weight: 700;
}

.search-container {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #4a90e2;
  outline: none;
}

.table-container {
  display: flex;
  justify-content: center; /* Centrar la tabla */
  overflow-x: auto;
}

.book-table {
  width: 100%;
  max-width: 1200px; /* Aumentar el tamaño máximo de la tabla */
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header {
  background-color: #007bff; /* Cambiar el color del encabezado */
  color: white;
  padding: 12px;
  text-align: left;
  font-weight: 700;
}

.book-row:nth-child(even) {
  background-color: #f9f9f9;
}

.cell {
  padding: 12px;
  border-bottom: 1px solid #ddd;
}

.loading, .error {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-top: 20px;
}

.error {
  color: #ef4444;
}
</style>