<template>
  <div class="app-container">
    <TipPayment />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TipPayment from './views/TipPayment.vue';

export default defineComponent({
  name: 'App',
  components: {
    TipPayment
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