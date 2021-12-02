<template>
  <div class="home">
    <Conversations v-if="$store.state.socket"/>
    <Chat v-if="$store.state.socket"/>
    <Spinner v-if="!$store.state.socket"/>
  </div>
</template>



<script lang="ts">
import { defineComponent } from 'vue';
import Conversations from './conversations/Conversations.vue'
import Chat from './chat/Chat.vue'
import Spinner from '../../components/Spinner.vue'

export default defineComponent({
  name: 'Home',
  components: {
    Conversations,
    Chat,
    Spinner
}
});
</script>



<style scoped>
.home {
  display: flex;
  height: 92vh;
  width: 100vw;
  max-width: 100%;
  background-color: #334155;
  justify-content: center;
}

.lds-ring {
  align-self: center;
}
</style>