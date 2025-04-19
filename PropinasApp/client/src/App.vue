<!-- client/src/App.vue -->
<template>
  <div class="app-container">
    <PagarPropinas />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PagarPropinas from './views/PagarPropinas.vue';

export default defineComponent({
  name: 'App',
  components: {
    PagarPropinas
  }
});
</script>

<style>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}
</style>

