<template>
  <div class="container">
    <h2 class="text-2xl font-bold mb-4">📖 Agregar un Nuevo Libro</h2>

    <form @submit.prevent="agregarLibro" class="flex flex-col gap-4 p-4 border rounded-lg shadow-md max-w-lg">
      <input v-model="nuevoLibro.titulo" type="text" placeholder="Título del libro" required class="p-2 border rounded" />
      <input v-model="nuevoLibro.autorLibro" type="text" placeholder="Autor" required class="p-2 border rounded" />
      <input v-model="nuevoLibro.fechaPublicacion" type="date" required class="p-2 border rounded" />

      <button type="submit" class="p-2 bg-green-500 text-white rounded-lg hover:bg-green-700">
        ➕ Agregar Libro
      </button>
    </form>

    <p v-if="mensaje" class="text-green-600 mt-2 font-semibold">{{ mensaje }}</p>
    <p v-if="error" class="text-red-500 mt-2 font-semibold">❌ {{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";

const nuevoLibro = ref({
  titulo: "",
  autorLibro: "",
  fechaPublicacion: "",
});

const mensaje = ref("");
const error = ref("");

const agregarLibro = async () => {
  mensaje.value = "";
  error.value = "";

  try {
    const response = await fetch("https://librerias.somee.com/api/LibroMaterial", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoLibro.value),
    });

    if (!response.ok) {
      throw new Error("No se pudo agregar el libro");
    }

    mensaje.value = "✅ Libro agregado exitosamente";
    nuevoLibro.value = { titulo: "", autorLibro: "", fechaPublicacion: "" };
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Error desconocido";
  }
};
</script>
