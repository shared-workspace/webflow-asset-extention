<script lang="ts" setup>
import '~/reset.css';
import AssetWrapper from '@/components/AssetWrapper.vue';
const Webflow = typeof webflow !== 'undefined' ? webflow : useNuxtApp().$webflow;

const maxSelectionAllowed = 2;
const assetsData = ref<AssetDataMap>(new Map());
const assetsSelected = ref<AssetDataMap>(new Map());
const assetsGetFlag = ref(true);

const toggleAssetGetFlag = () => {
  assetsGetFlag.value = !assetsGetFlag.value;
};

// const assetDataUpdate = () => assetsData
const assetWrapperProps = {
  Webflow,
  assetsData: assetsData.value,
  assetsGetFlag: assetsGetFlag.value,
  assetsSelected: assetsSelected.value,
};

const selectAllAssets = () => { 
  console.log("Select All Assets");
  assetsData.value.forEach((asset, id) => {
    if (assetsSelected.value.size >= maxSelectionAllowed) return;
    assetsSelected.value.set(id, asset);
  });
}

const deselectAllAssets = () => {
  console.log("Deselect All Assets");
  assetsSelected.value.clear();
}

</script>
<template>
  <div class="wrapper">
    <div class="button-wrapper">
      <button @click="toggleAssetGetFlag">
        Generate
      </button>
      <button>
        Apply
      </button>
      <button @click="selectAllAssets" :disabled="assetsSelected.size === assetsData.size">
        Select All
      </button>
      <button @click="deselectAllAssets" :disabled="assetsSelected.size === 0">
        Deselect All
      </button>
    </div>
    <h2>Assets List</h2>
    <AssetWrapper :Webflow="Webflow" :assetsData="assetsData" :assetsSelected="assetsSelected" :maxSelectionAllowed="maxSelectionAllowed"
      :assetsGetFlag="assetsGetFlag" />
  </div>
</template>
<style>
body {
  background: #000;
  overflow: hidden;
}
</style>
<style scoped>
.wrapper,
.button-wrapper {
  justify-content: center;
  align-items: center;

}

.wrapper {
  height: 100vh;
  font-family: Arial, sans-serif;
  padding: .3rem 1rem;
  overflow: hidden;
}

.button-wrapper {
  background: #000;
  display: flex;
  padding: .5rem 0;
}

button {
  padding: 4px 8px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin: 0 1rem;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

h2 {
  text-align: center;
  font-size: 1rem;
  color: white;
  margin: 1rem 0;
}
</style>