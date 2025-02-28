<template>
  <div class="container">
    <h1 class="title">Lista de Libros</h1>

    <div v-if="libros.length" class="table-container">
      <table class="book-table">
        <thead>
          <tr>
            <th class="header">Título</th>
            <th class="header">Fecha de publicación</th>
            <th class="header">ID del autor</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="libro in libros" :key="libro.libreriaMaterialId" class="book-row">
            <td class="cell">{{ libro.titulo }}</td>
            <td class="cell">{{ formatFecha(libro.fechaPublicacion) }}</td>
            <td class="cell">{{ libro.autorLibro }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else-if="loading" class="loading">Cargando libros...</p>
    <p v-else class="error">No se encontraron libros o hubo un error.</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const libros = ref([]);
    const loading = ref(true);
    const error = ref(null);

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

    onMounted(() => {
  obtenerLibros(); // Obtener los libros al cargar el componente

  // Refrescar la lista cada 10 segundos
  setInterval(obtenerLibros, 2000);
});

    return {
      libros,
      loading,
      error,
      formatFecha,
      obtenerLibros, // Exportar la función para usarla en otros componentes
    };
  },
};
</script>

<style scoped>
.container {
  padding: 40px;
  background-color: #f9f9f9;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Roboto', sans-serif;
}

.title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 40px;
  text-align: center;
}

.table-container {
  width: 100%;
  max-width: 1000px;
  overflow-x: auto;
}

.book-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.header {
  background-color: #4CAF50;
  color: white;
  font-size: 18px;
  font-weight: 500;
  padding: 15px;
  text-align: left;
}

.book-row {
  transition: background-color 0.3s ease-in-out;
}

.book-row:hover {
  background-color: #f1f1f1;
}

.cell {
  font-size: 16px;
  color: #555;
  padding: 15px;
  border-bottom: 1px solid #ddd;
}

.cell:first-child {
  font-weight: 500;
  color: #222;
}

.loading {
  font-size: 18px;
  color: #666;
  margin-top: 20px;
}

.error {
  font-size: 18px;
  color: red;
  margin-top: 20px;
}
</style>