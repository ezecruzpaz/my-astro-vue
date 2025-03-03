<template>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Lista de Autores</h1>
  
      <button @click="mostrarModal = true" class="bg-blue-500 text-white px-4 py-2 rounded">
        Agregar Autor
      </button>
  
      <div class="mt-4">
        <ul v-if="autores.length > 0" class="space-y-2">
          <li v-for="autor in autores" :key="autor.id" class="p-3 border rounded bg-gray-100">
            <strong>{{ autor.nombre }} {{ autor.apellido }}</strong> - Fecha de Nacimiento: {{ autor.fechaNacimiento }}
            <ul v-if="autor.gradosAcademicos.length > 0" class="mt-2 pl-4 list-disc">
              <li v-for="grado in autor.gradosAcademicos" :key="grado.gradoAcademicoGuid">
                🎓 {{ grado.nombre }} en {{ grado.centroAcademico }} ({{ grado.fechaGrado }})
              </li>
            </ul>
          </li>
        </ul>
        <p v-else class="text-gray-600">No hay autores registrados.</p>
      </div>
  
      <div v-if="mostrarModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg shadow-lg w-1/2">
          <h2 class="text-xl font-bold mb-4">Agregar Autor</h2>
  
          <form @submit.prevent="agregarAutor">
            <div class="mb-2">
              <label class="block text-gray-700">Nombre:</label>
              <input v-model="autor.nombre" type="text" class="border w-full p-2 rounded" required>
            </div>
  
            <div class="mb-2">
              <label class="block text-gray-700">Apellido:</label>
              <input v-model="autor.apellido" type="text" class="border w-full p-2 rounded" required>
            </div>
  
            <div class="mb-2">
              <label class="block text-gray-700">Fecha de Nacimiento:</label>
              <input v-model="autor.fechaNacimiento" type="date" class="border w-full p-2 rounded" required>
            </div>
  
            <h3 class="text-lg font-semibold mt-4">Grados Académicos</h3>
  
            <div v-for="(grado, index) in autor.gradosAcademicos" :key="index" class="mb-3 p-3 border rounded bg-gray-100">
              <label class="block text-gray-700">Nombre del Grado:</label>
              <input v-model="grado.nombre" type="text" class="border w-full p-2 rounded" required>
  
              <label class="block text-gray-700 mt-2">Centro Académico:</label>
              <input v-model="grado.centroAcademico" type="text" class="border w-full p-2 rounded" required>
  
              <label class="block text-gray-700 mt-2">Fecha de Grado:</label>
              <input v-model="grado.fechaGrado" type="date" class="border w-full p-2 rounded" required>
  
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
