<template>
  <div class="footer">
    <p>Created by: Jimmy Du</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Footer'
});
</script>



<style scoped>
.footer {
  background-color: #0C4A6E;
  padding: 0.5rem;
}

.footer p {
  color: white;
}
</style>
