<script lang="ts" setup>
const { $api } = useNuxtApp();
const { createSession } = useSession();
const router = useRouter();
const password = ref('');
const login = () => {
    $api("/api/auth", {
        method: "POST",
        body: { password: password.value },
    }).then((newSession) => createSession(newSession));
    router.push("/");
}

</script>
<template>
    <div>
        <h1>Login</h1>
        <input type="password" v-model="password" placeholder="Password" />
        <button @click="login">Login</button>
    </div>
</template>