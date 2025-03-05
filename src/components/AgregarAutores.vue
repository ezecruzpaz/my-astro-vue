<template>
  <div class="p-6 relative">
    <!-- Botón para mostrar u ocultar el formulario -->
    <button @click="mostrarFormulario = !mostrarFormulario" class="btn-agregar">
      {{ mostrarFormulario ? "Cerrar Formulario" : "+" }}
    </button>

    <!-- Formulario flotante sobre la tabla -->
    <div v-if="mostrarFormulario" class="formulario-flotante">
      <FormularioAutor
        :autor="autor"
        @agregar-autor="agregarAutor"
        @cerrar-modal="mostrarFormulario = false"
        @agregar-grado="agregarGrado"
        @eliminar-grado="eliminarGrado"
      />
    </div>

    <!-- Lista de Autores -->
    <ListaAutores :autores="autores" />
  </div>
</template>

<script>
import FormularioAutor from "./FormularioAutor.vue";
import ListaAutores from "./ListaAutores.vue";

export default {
  components: {
    FormularioAutor,
    ListaAutores,
  },
  data() {
    return {
      mostrarFormulario: false, // Controla la visibilidad del formulario
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
        this.mostrarFormulario = false;
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
/* Estilos para el botón */
.btn-agregar {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, transform 0.2s ease;
  z-index: 1000;
}

.btn-agregar:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.btn-agregar:active {
  transform: translateY(0);
}

/* Estilos para el formulario flotante */
.formulario-flotante {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgb(255, 255, 255); /* Fondo semitransparente */
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  z-index: 1001;
  margin-top: 100px;
}
</style>
