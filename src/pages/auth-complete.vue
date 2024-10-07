<script lang="ts" setup>
import { onMounted } from 'vue'

const closeWindow = () => {
  // Check if the window was opened by another window (e.g., the main app)
  if (window.opener) {
    // Notify the parent window that authentication is complete
    window.opener.postMessage(
      'auth-complete',
      process.env.HOST_URL
    )
    // Optionally, close this window after sending the message
    window.close()
  }
}
onMounted(closeWindow);
</script>
<template>
  <div>
    <p>Authentication successful! You can now close this window.</p>
    <button @click="() => window.close()">close window</button>
  </div>
</template>
<style scoped>
/* Add any styles you need here */
</style>
