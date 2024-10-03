<script lang="ts" setup>
import '~/reset.css';
import AssetWrapper from '@/components/AssetWrapper.vue';
const assetsGetFlag = ref(true);
const getAssetsList = () => {
  assetsGetFlag.value = !assetsGetFlag.value;
};
</script>
<template>
  <div class="wrapper">
    <div class="button-wrapper">
      <button @click="getAssetsList">
        Get List of Assets
      </button>
    </div>
    <h2>Assets List</h2>
    <AssetWrapper v-if="assetsGetFlag" />
  </div>
</template>
<style scoped>
.wrapper,
.button-wrapper {
  justify-content: center;
  align-items: center;
}

.wrapper {
  height: 100vh;
  font-family: Arial, sans-serif;
  padding: 1rem .5rem;
}

.button-wrapper {
  background: #000;
  display: flex;
  padding: 1rem 0;
}

button {
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

h2 {
  text-align: center;
  font-size: 1rem;
  color: white;
  margin: 1rem 0;
}

</style>