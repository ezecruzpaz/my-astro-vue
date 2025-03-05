<template>
  <div class="container">
    <!-- Botón de "+" para abrir el popup -->
    <button @click="abrirPopup" class="add-button">
      +
    </button>

    <!-- Popup/modal -->
    <div v-if="mostrarPopup" class="popup-overlay">
      <div class="popup-content">
        <h2 class="form-title">Agregar un Nuevo Libro</h2>

        <!-- Formulario -->
        <form @submit.prevent="agregarLibro" class="form">
          <div class="form-group">
            <label for="titulo" class="form-label">Título del libro</label>
            <input
              v-model="nuevoLibro.titulo"
              type="text"
              id="titulo"
              placeholder="Ej: Cien años de soledad"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="fechaPublicacion" class="form-label">Fecha de publicación</label>
            <input
              v-model="nuevoLibro.fechaPublicacion"
              type="date"
              id="fechaPublicacion"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="autorLibro" class="form-label">Autor</label>
            <select
              v-model="nuevoLibro.autorLibro"
              id="autorLibro"
              required
              class="form-input"
            >
              <option value="" disabled>Seleccione un autor</option>
              <option v-for="autor in autores" :key="autor.autorLibroId" :value="autor.autorLibroId">
                {{ autor.nombre }} {{ autor.apellido }}
              </option>
            </select>
          </div>

          <button type="submit" class="form-button">
            Agregar Libro
          </button>
        </form>

        <!-- Botón para cerrar el popup -->
        <button @click="cerrarPopup" class="close-button">
          ✖
        </button>

        <!-- Mensajes de retroalimentación -->
        <p v-if="mensaje" class="form-message success">{{ mensaje }}</p>
        <p v-if="error" class="form-message error">❌ {{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const nuevoLibro = ref({
  titulo: "",
  fechaPublicacion: "",
  autorLibro: "", // ID del autor seleccionado
});

const autores = ref([]); // Lista de autores
const mensaje = ref("");
const error = ref("");
const mostrarPopup = ref(false); // Controla si el popup está visible

// Obtener la lista de autores
const obtenerAutores = async () => {
  try {
    const response = await fetch("http://localhost:5080/api/Autor");
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    autores.value = data;
  } catch (err) {
    error.value = "Error al obtener la lista de autores";
    console.error("Error al obtener los autores:", err);
  }
};

// Abrir el popup y cargar la lista de autores
const abrirPopup = () => {
  mostrarPopup.value = true;
  obtenerAutores();
};

// Cerrar el popup
const cerrarPopup = () => {
  mostrarPopup.value = false;
  mensaje.value = "";
  error.value = "";
  nuevoLibro.value = { titulo: "", fechaPublicacion: "", autorLibro: "" }; // Limpiar el formulario
};

// Agregar un nuevo libro
const agregarLibro = async () => {
  mensaje.value = "";
  error.value = "";

  try {
    // Crear el objeto con el formato esperado por la API
    const libroParaEnviar = {
      titulo: nuevoLibro.value.titulo,
      fechaPublicacion: new Date(nuevoLibro.value.fechaPublicacion).toISOString(),
      autorLibroId: parseInt(nuevoLibro.value.autorLibro), // Convertir a número
    };

    console.log("Datos a enviar:", JSON.stringify(libroParaEnviar, null, 2)); // Depuración

    // Enviar la solicitud POST a la API
    const response = await fetch("https://librerias.somee.com/api/LibroMaterial", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(libroParaEnviar),
    });

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      const errorText = await response.text(); // Leer la respuesta como texto
      throw new Error(errorText || "No se pudo agregar el libro");
    }

    // Mostrar mensaje de éxito y limpiar el formulario
    mensaje.value = "Libro agregado exitosamente";
    nuevoLibro.value = { titulo: "", fechaPublicacion: "", autorLibro: "" };

    // Cerrar el popup después de 2 segundos
    setTimeout(() => {
      cerrarPopup();
    }, 2000);
  } catch (err) {
    // Mostrar mensaje de error
    error.value = err instanceof Error ? err.message : "Error desconocido";
    console.error("Error al agregar el libro:", err); // Depuración
  }
};
</script>

<style scoped>
/* Estilos generales */
.container {
  position: relative;
  font-family: Arial, sans-serif;
}

/* Botón de "+" */
.add-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #28aad9, #8b5cf6);
  color: white;
  font-size: 2rem;
  font-weight: bold;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.add-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

/* Popup/modal */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  position: relative;
  font-family: Arial, sans-serif;
}

/* Botón para cerrar el popup */
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
}

.close-button:hover {
  color: #333;
}

/* Estilos del formulario */
.form-title {
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 1.5rem;
  font-family: Arial, sans-serif;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 0.5rem;
}

.form-input,
.form-input[type="date"],
.form-input[type="text"],
.form-input[type="select"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  color: #333;
  font-family: Arial, sans-serif;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-input[type="select"] {
  height: 3rem; /* Ajusta la altura del dropdown */
}

.form-input:focus {
  border-color: #2889d9;
  box-shadow: 0 0 0 3px rgba(109, 40, 217, 0.1);
  outline: none;
}

.form-button {
  width: 100%;
  padding: 0.75rem;
  background: #2d63e2; /* Color del botón */
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  font-family: Arial, sans-serif;
}

.form-button:hover {
  background: #5177ea; /* Color al pasar el ratón */
  transform: translateY(-2px);
}

.form-message {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  font-family: Arial, sans-serif;
}

.success {
  color: #10b981;
}

.error {
  color: #ef4444;
}

</style>