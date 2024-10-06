<script lang="ts" setup>
const Webflow = typeof webflow !== 'undefined' ? webflow : useNuxtApp().$webflow;
const { getAllAssets, assetMap, totalAssets, syncAssets, updateAssetAltText } = useAssetMap();
const { selectAll, deselectAll, isLimitReached, isNoneSelected, isAssetSelected, toggleAssetInSelectedMap, assetsSelectedMap, totalAssetsSelected, saveSelectedAssets, generateAltTextForSelected } = useAssetSelectedMap({limit: 200});
onMounted(() => {
  console.log('Component mounted')
  getAllAssets(Webflow, {
    maxAssetFetch: 300,
    generateAltText: false,
    maxAltText: 0,
  });
})
const dummyData = [
  {
    id: "1",
    name: 'Image 1',
    src: 'https://via.placeholder.com/600x400',
    alt: 'Image 1',
  },
  {
    id: "2",
    name: 'Image 2',
    src: 'https://via.placeholder.com/400x600',
    alt: 'Image 2',
  },
  {
    id: "3",
    name: 'Image 3',
    src: 'https://via.placeholder.com/300x650',
    alt: 'Image 3',
  },
  {
    id: "4",
    name: 'Image 4',
    src: 'https://via.placeholder.com/50x50',
    alt: 'Image 4',
  },
  {
    id: "5",
    name: 'Image 5',
    src: 'https://via.placeholder.com/1080x1080',
    alt: 'Image 5',
  }
]
const limitReached = computed(() => isLimitReached())
const handleInputChange = (id: string, value: string) => {
  console.log("new alt text", value);
  updateAssetAltText(id, value);
  console.log("new alt text", assetMap.value.get(id)!.alt);
}
</script>
<template>
  <main>
    <div class="top-bar">
      <div class="top-bar-button-wrapper">
        <button @click="selectAll" :disabled="limitReached">
          Select All
        </button>
        <button @click="deselectAll" :disabled="isNoneSelected()">
          Deselect All</button>
      </div>
      <select>
        <option value="0">Asset Library</option>
        <option value="66fb750c333d4f968c584dc4">Projects</option>
        <option value="66fb750c333d4f968c584dc5">Project Services</option>
        <option value="66fb750c333d4f968c584dc6">Blogs</option>
        <option value="66fb750c333d4f968c584dc7">Blog categories</option>
        <option value="66fb750c333d4f968c584dc8">Categories</option>
        <option value="66fb750c333d4f968c584dc9">Products</option>
        <option value="66fb750c333d4f968c584dca">SKUs</option>
      </select>
    </div>
    <div class="asset-list">
      <ul>
        <li v-for="[id, { src, alt, name }] in assetMap" :key="id">
          <div class="asset-image-wrap">
            <input type="checkbox" :checked="isAssetSelected(id)" />
            <label @click="toggleAssetInSelectedMap(id)">
              <img :src="src" :alt="alt" />
            </label>
          </div>
          <div class="asset-info-wrap">
            <input type="text" class="asset-name" :value="name" disabled/>
            <input type="text" class="asset-alt-text" :value="alt" @input="(e) => handleInputChange(id, (e.target as HTMLInputElement).value)" />
          </div>
        </li>
      </ul>
    </div>
    <div class="bottom-bar">
      <span class="count-status">{{ totalAssetsSelected }} / {{ totalAssets }} <span class="limit" v-if="limitReached">Select Limit</span> </span>
      <button @click="generateAltTextForSelected">Get Alt Text</button>
      <button @click="syncAssets">Sync With Asset</button>
      <button @click="saveSelectedAssets" :disabled="isNoneSelected()">Save Select</button>
    </div>
  </main>
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
main {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.count-status .limit {
  color: red;
  font-size: 16px;
  margin: 0 1rem;
  font-weight: bold;
}
.top-bar-button-wrapper{
  display:flex;
  gap: 8px;

}
button {
  padding: 4px 8px;
  background-color: var(--backgroundActive);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin: 0 1rem;
}

button:disabled {
  background-color: var(--backgroundInactive);
  cursor: not-allowed;
  color: var(--textInactive);
}

select {
  padding: 4px 8px;
  background-color: var(--backgroundActive);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin: 0 1rem;
}

option {
  padding: 4px 8px;
  background-color: var(--backgroundActive);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin: 0 1rem;
}

.top-bar {
  height: var(--top-bar-height);
  padding: 8px var(--padding-regular);
  background-color: var(--background1);
  border-bottom: 1px solid var(--border1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bottom-bar {
  height: calc(var(--top-bar-height) + 8px);
  padding: 0 var(--padding-regular);
  background-color: var(--background1);
  border-bottom: 1px solid var(--border1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.asset-list {
  height: calc(600px - var(--top-bar-height) - var(--top-bar-height) - 10px - 2rem);
  overflow: hidden;
}

ul {
  list-style-type: none;
  padding: 1rem;
  margin: 0;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

ul li {
  height: 8rem;
  display: flex;
  padding-bottom: 1rem;
}

.asset-image-wrap {
  height: 100%;
  width: auto;
  aspect-ratio: 1;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

label {
  cursor: pointer;
  width: 100%;
  height: 100%;
}

input[type="checkbox"] {
  display: none;
}

input:checked+label {
  background-color: rgb(69, 69, 240);
}

input:checked+label img {
  transform: scale(0.9);
}

.asset-info-wrap {
  width: calc(800px - 8rem - 2px - 1rem);
  display: flex;
  flex-direction: column;
  padding: .5rem 0 .5rem 1rem;
}

input {
  padding: 0 0.5rem;
  all: unset;
  /* Reset all default styles */
  width: 100%;
  border: 1px solid rgba(87, 87, 87, 0.322);
  /* Set border to white */
  border-radius: 4px;
  background: #ffffff1e;
  /* Set a semi-transparent white background */
  color: white;
  /* Set text color to white */
  box-sizing: border-box;
  /* Ensure padding and border are included in the element's total width and height */
  font-size: 0.8rem;
}
input.asset-name {
  height: 2rem;
  margin-bottom: 1rem;
}
input.asset-alt-text {
  flex-grow: 1;
}
</style>