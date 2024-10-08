<script setup lang="ts">
const { $api } = useNuxtApp();
// const {api, init} = useGenerateAltText();
// init("https://automatic-happiness-94x9qv7qrw73p69g-3000.app.github.dev");
const isAuth = ref(false);
const isLoading = ref(true);
const password = ref("");
const verifySession = () => {
  isLoading.value = true;
  // const $api = api.value;
  $api("/api/verify-session").then((authorized) => {
    console.log(authorized);
    isAuth.value = !!authorized;
  }).finally(() => {
    isLoading.value = false;
  });
};
const createSession = () => {
  isLoading.value = true;
  // const $api = api.value;

  $api("/api/create-session", {
    params: {
      password: password.value
    }
  }).then((token) => {
    localStorage.setItem("token", token);
    isAuth.value = true;
  }).finally(() => {
    isLoading.value = false;
  });
};
onMounted(() => {
  $fetch("/api/users", {
    baseURL: "https://reqres.in",
    method: "POST",
    body: {
      name: "morpheus",
      job: "leader"
    }
  }).then((data) => {
    console.log(data);
  }); 
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
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard!</p>
    </div>
    <div v-else>
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" v-model="password" />
      <button @click="createSession">Login</button>
    </div>
  </div>
</template>
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
