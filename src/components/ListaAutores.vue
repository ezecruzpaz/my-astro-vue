<template>
    <div class="container">
      <h1 class="title">Lista de Autores</h1>
  
      <!-- Tabla de Autores -->
      <div class="table-container">
        <table class="book-table">
          <thead>
            <tr class="header">
              <th class="px-4 py-2">Nombre</th>
              <th class="px-4 py-2">Apellido</th>
              <th class="px-4 py-2">Fecha de Nacimiento</th>
              <th class="px-4 py-2">Grados Académicos</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="autor in autores" :key="autor.id" class="book-row">
              <td class="cell">{{ autor.nombre }}</td>
              <td class="cell">{{ autor.apellido }}</td>
              <td class="cell">{{ autor.fechaNacimiento }}</td>
              <td class="cell">
                <ul v-if="autor.gradosAcademicos.length > 0">
                  <li v-for="grado in autor.gradosAcademicos" :key="grado.gradoAcademicoGuid">
                     {{ grado.nombre }} en {{ grado.centroAcademico }}
                  </li>
                </ul>
                <p v-else>No tiene grados registrados</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Mensajes de carga y error -->
      <p v-if="loading" class="loading">Cargando autores...</p>
      <p v-else-if="error" class="error">❌ {{ error }}</p>
      <p v-else-if="!autores.length" class="error">No se encontraron autores.</p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      autores: {
        type: Array,
        required: true,
      },
      loading: {
        type: Boolean,
        default: false,
      },
      error: {
        type: String,
        default: null,
      },
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
  
  .book-row:hover {
    background-color: #f1f1f1;
  }
  
  .cell {
    padding: 12px;
    border-bottom: 1px solid #ddd;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    margin-bottom: 8px;
  }
  
  p {
    color: #666;
    font-style: italic;
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
  th,
td {
  padding: 12px 15px;
  text-align: left;
}
  </style>