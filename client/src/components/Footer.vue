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
  height: 5vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer p {
  color: white;
}

@media (min-width: 2560px) {
  .footer p {
    font-size: x-large;
  }
}

@media (min-width: 3840px) {
  .navbar a {
    font-size: xx-large;
  }
}
</style>
