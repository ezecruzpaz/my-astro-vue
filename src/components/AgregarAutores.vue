<template>
  <div class="p-6">
    <h1 class="text-center text-2xl font-semibold">Lista de Autores</h1>

    <!-- Botón para abrir el modal -->
    <button @click="mostrarModal = true" class="bg-blue-500 text-white px-4 py-2 rounded mb-4">
      Agregar Autor
    </button>

    <!-- Tabla de Autores -->
    <div class="overflow-x-auto">
      <table class="min-w-full table-auto bg-white shadow-lg rounded-lg mx-auto text-center">
        <thead>
          <tr class="bg-gray-200">
            <th class="px-4 py-2">Nombre</th>
            <th class="px-4 py-2">Apellido</th>
            <th class="px-4 py-2">Fecha de Nacimiento</th>
            <th class="px-4 py-2">Grados Académicos</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="autor in autores" :key="autor.id" class="border-b hover:bg-gray-50">
            <td class="px-4 py-2">{{ autor.nombre }}</td>
            <td class="px-4 py-2">{{ autor.apellido }}</td>
            <td class="px-4 py-2">{{ autor.fechaNacimiento }}</td>
            <td class="px-4 py-2">
              <ul v-if="autor.gradosAcademicos.length > 0">
                <li v-for="grado in autor.gradosAcademicos" :key="grado.gradoAcademicoGuid">
                  🎓 {{ grado.nombre }} en {{ grado.centroAcademico }} 
                </li>
              </ul>
              <p v-else>No tiene grados registrados</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para agregar autor -->
    <div v-if="mostrarModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div class="popup-content">
        <h2 class="text-xl font-bold mb-4">Agregar Autor</h2>

        <form @submit.prevent="agregarAutor">
          <div class="mb-4">
            <label class="block text-gray-700">Nombre:</label>
            <input v-model="autor.nombre" type="text" class="form-input" required>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700">Apellido:</label>
            <input v-model="autor.apellido" type="text" class="form-input" required>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700">Fecha de Nacimiento:</label>
            <input v-model="autor.fechaNacimiento" type="date" class="form-input" required>
          </div>

          <h3 class="text-lg font-semibold mt-4">Grados Académicos</h3>
          <div v-for="(grado, index) in autor.gradosAcademicos" :key="index" class="mb-4 p-3 border rounded bg-gray-100">
            <label class="block text-gray-700">Nombre del Grado:</label>
            <input v-model="grado.nombre" type="text" class="form-input" required>

            <label class="block text-gray-700 mt-2">Centro Académico:</label>
            <input v-model="grado.centroAcademico" type="text" class="form-input" required>

            <label class="block text-gray-700 mt-2">Fecha de Grado:</label>
            <input v-model="grado.fechaGrado" type="date" class="form-input" required>

            <button @click="eliminarGrado(index)" type="button" class="mt-2 bg-red-500 text-white px-3 py-1 rounded">
              Eliminar
            </button>
          </div>

          <button @click="agregarGrado" type="button" class="bg-green-500 text-white px-3 py-1 rounded">
            Agregar Grado Académico
          </button>

          <div class="mt-4 flex justify-end space-x-2">
            <button type="button" @click="mostrarModal = false" class="bg-gray-500 text-white px-4 py-2 rounded">
              Cancelar
            </button>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
              Guardar Autor
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mostrarModal: false,
      autores: [],
      autor: {
        nombre: "",
        apellido: "",
        fechaNacimiento: "",
        gradosAcademicos: [],
      },
    };
  },
  methods: {
    async obtenerAutores() {
      try {
        const response = await fetch("http://localhost:5080/api/Autor");
        if (!response.ok) throw new Error("Error al obtener los autores");
        this.autores = await response.json();
      } catch (error) {
        console.error("Error:", error);
      }
    },
    agregarGrado() {
      this.autor.gradosAcademicos.push({
        nombre: "",
        centroAcademico: "",
        fechaGrado: "",
        gradoAcademicoGuid: this.generarGUID(),
      });
    },
    eliminarGrado(index) {
      this.autor.gradosAcademicos.splice(index, 1);
    },
    async agregarAutor() {
      try {
        const response = await fetch("http://localhost:5080/api/Autor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...this.autor,
            fechaNacimiento: new Date(this.autor.fechaNacimiento).toISOString(),
            gradosAcademicos: this.autor.gradosAcademicos.map((grado) => ({
              ...grado,
              fechaGrado: new Date(grado.fechaGrado).toISOString(),
            })),
          }),
        });

        if (!response.ok) throw new Error("Error al agregar el autor");

        alert("Autor agregado exitosamente");
        this.mostrarModal = false;
        this.autor = { nombre: "", apellido: "", fechaNacimiento: "", gradosAcademicos: [] };
        this.obtenerAutores();
      } catch (error) {
        console.error("Error:", error);
        alert("Ocurrió un error al agregar el autor");
      }
    },
    generarGUID() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        let r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
  },
  mounted() {
    this.obtenerAutores();
  },
};
</script>

<style scoped>
/* Estilos globales */
body {
  font-family: 'Arial', sans-serif;
}

/* Estilo para el modal */
.fixed {
  position: fixed;
}

.bg-gray-900 {
  background-color: rgba(0, 0, 0, 0.5);
}

.popup-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 400px; /* Ajusta el ancho del modal */
  width: 100%;
}

/* Estilos para la tabla */
table {
  width: 80%; /* Para asegurar que la tabla no ocupe todo el espacio */
  max-width: 1000px;
  border-collapse: collapse; /* Elimina los bordes entre celdas */
  margin: 0 auto; /* Centra la tabla */
}

th,
td {
  padding: 12px 15px;
  border: none; /* Elimina los bordes de las celdas */
}

th {
  background-color: #6d28d9; /* Color de encabezado */
  color: white;
  font-size: 18px;
  font-weight: 500;
  padding: 15px;
  text-align: left;
}

tr:hover {
  background-color: #f1f1f1; /* Color al pasar el ratón */
}

button {
  cursor: pointer;
}

/* Estilos de los inputs */
.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  color: #333;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-input:focus {
  border-color: #6d28d9;
  box-shadow: 0 0 0 3px rgba(109, 40, 217, 0.1);
  outline: none;
}
</style>