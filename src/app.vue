
<script lang="ts" setup>
import { ref } from 'vue';

const AssetsList = ref<string[]>([]);
const getAssetsList = async () => {
  const assets = await webflow.getAllAssets();
  for (const { id } of assets) {
    const asset = await webflow.getAssetById(id);
    if (asset) {
      // Get the URL of the asset
      const url = await asset.getUrl();
      AssetsList.value.push(url);
    }
  }
};
</script>
<template>
  <div class="wrapper">
    <div class="button-wrapper">
      <button @click="getAssetsList">
        Get List of Assets
      </button>
    </div>
    <div v-if="AssetsList.length">
      <h2>Assets List</h2>
      <ul>
        <li v-for="(asset, index) in AssetsList" :key="index">
          <img :src="asset" alt="Asset"  width="100" height="100" />
        </li>
      </ul>
    </div>
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
}

.button-wrapper {
  background: #000;
  display: flex;
  height: 40%;
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
ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

</style>