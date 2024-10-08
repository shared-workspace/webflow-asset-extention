<script setup lang="ts">
import { ref, onMounted } from "vue";
import Extension from "./components/extension.vue"
import { $api } from "./utils/api";
const isAuth = ref(false);
const isLoading = ref(true);
const password = ref("");
const verifySession = () => {
  isLoading.value = true;
  $api<{ authorized?: boolean }>("/api/verify-session").then(({ data }) => {
    console.log("verifySession", data);
    if (data.authorized === true) {
      isAuth.value = true;
    } else {
      isAuth.value = false;
    }
  }).finally(() => {
    isLoading.value = false;
  });
};
const createSession = () => {
  isLoading.value = true;
  $api<{ token?: string }>("/api/create-session", {
    method: "POST",
    data: { password: password.value },
  }).then(({ data }) => {
    console.log("createSession", data);
    if (typeof data?.token === "string") {
      localStorage.setItem("token", data.token);
      isAuth.value = true;
    } else isLoading.value = false;
  }).finally(() => {
    isLoading.value = false;
  });
};
onMounted(() => {
  if (localStorage.getItem("token")) {
    verifySession();
  } else {
    isAuth.value = false;
    isLoading.value = false;
  }
})


</script>
<template>
  <div v-if="isLoading" class="loading-screen">
    <div class="spinner"></div>
  </div>
  <div v-else>
    <div v-if="isAuth">
      <Extension :is-auth="isAuth" />
    </div>
    <div v-else>
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" v-model="password" />
      <button @click="createSession">Login</button>
    </div>
  </div>
</template>
<style>
:root {
  --top-bar-height: 32px;
  --padding-regular: 8px;
  --background1: #404040;
  --border1: #363636;
  --backgroundInactive: #4d4d4d;
  --backgroundActive: #363636;
  --textInactive: #b3b3b3;
}

body {
  overflow: hidden;
  background: #303030;
  padding: 0;
  margin: 0;
}

.bottom-bar span {
  color: #fff;
  letter-spacing: 2px;
}

html,
body,
#__nuxt,
main {
  height: 100%;
}
</style>
<style scoped>

.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;

  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
