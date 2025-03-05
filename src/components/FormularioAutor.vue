<template>
  <div class="bg-white p-6 rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">Agregar Autor</h2>

    <form @submit.prevent="agregarAutor">
      <div class="mb-4">
        <label class="block text-gray-700 font-medium">Nombre:</label>
        <input v-model="autor.nombre" type="text" class="form-input" required>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 font-medium">Apellido:</label>
        <input v-model="autor.apellido" type="text" class="form-input" required>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 font-medium">Fecha de Nacimiento:</label>
        <input v-model="autor.fechaNacimiento" type="date" class="form-input" required>
      </div>

      <h3 class="text-lg font-semibold mt-4 text-gray-800">Grados Académicos</h3>
      <div v-for="(grado, index) in autor.gradosAcademicos" :key="index" class="mb-4 p-4 border rounded bg-gray-100">
        <label class="block text-gray-700 font-medium">Nombre del Grado:</label>
        <input v-model="grado.nombre" type="text" class="form-input" required>

        <label class="block text-gray-700 font-medium mt-2">Centro Académico:</label>
        <input v-model="grado.centroAcademico" type="text" class="form-input" required>

        <label class="block text-gray-700 font-medium mt-2">Fecha de Grado:</label>
        <input v-model="grado.fechaGrado" type="date" class="form-input" required>

        <button @click="eliminarGrado(index)" type="button" class="btn btn-danger">
          Eliminar
        </button>
      </div>

      <button @click="agregarGrado" type="button" class="btn btn-success">
        Agregar Grado Académico
      </button>

      <div class="btn-container">
        <button type="button" @click="cerrarModal"  class="btn btn-secondary">
          Cancelar
        </button>
        <button type="submit"  class="btn btn-primary" >
          Guardar Autor
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    autor: {
      type: Object,
      required: true,
    },
  },
  emits: ["agregar-autor", "cerrar-modal", "agregar-grado", "eliminar-grado"],
  methods: {
    agregarGrado() {
      this.$emit("agregar-grado");
    },
    eliminarGrado(index) {
      this.$emit("eliminar-grado", index);
    },
    agregarAutor() {
      this.$emit("agregar-autor");
    },
    cerrarModal() {
      this.$emit("cerrar-modal");
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

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
/* Botones generales */
.btn {
  padding: 10px 16px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

/* Colores específicos */
.btn-danger {
  background-color: #dc3545;
}

.btn-danger:hover {
  background-color: #b02a37;
}

.btn-success {
  background-color: #28a745;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-secondary {
  background-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-primary {
  background-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
}

/* Efecto de clic */
.btn:active {
  transform: scale(0.95);
}

/* Contenedor de botones */
.btn-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
