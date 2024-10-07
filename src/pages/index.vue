<script lang="ts" setup>
const isAuthenticated = ref(false);
const openAuthScreen = () => {
  window.addEventListener('message', handleAuthCompleteMessage)
  window.open("/api/auth", "_blank", "width=600,height=400");
};
const handleAuthCompleteMessage = (event: MessageEvent) => {
  if (event.data === 'auth-complete') {
    window.removeEventListener('message', handleAuthCompleteMessage)
    console.log('Extension Authentication complete. Handling logic here...');
    isAuthenticated.value = true;
  }
};
onMounted(() => {
  useFetch("/api/token", {})
})
</script>
<template>
  <button v-if="isAuthenticated">get Assets List</button>
  <button v-else @click="openAuthScreen">
    Authorize
  </button>
</template>