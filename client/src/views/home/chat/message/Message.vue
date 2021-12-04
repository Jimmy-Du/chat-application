<template>
  <div class="message" :class="sender ? 'sent' : 'recieved'">
    <p class="message-username">{{ username }}</p>
    <p>{{ messageText }}</p>
  </div>
</template>



<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Message',
  props: {
    messageText: String,
    username: String,
    sender: Boolean
  }
});
</script>



<style scoped>
.message {
  color: white;
  margin: 0 1rem 0rem 1rem;
  border-bottom: solid white 1px;
}

.message-username {
  font-weight: bold;
}

.sent {
  text-align: right;
}

.recieved {
  text-align: left;
}

@media (min-width: 2560px) {
  .message {
    font-size: large;
  }
}
</style>