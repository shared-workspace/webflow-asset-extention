<script lang="ts" setup>
import Image from './Image.vue';
import InputWrapper from './InputWrapper.vue';
import { ref } from 'vue';

const AssetsData = ref<Map<string, { url: string, name: string, altText: string, isLoaded: boolean }>>(new Map());
const Webflow = typeof webflow !== 'undefined' ? webflow : useNuxtApp().$webflow;
const isAssetLoaded = (id: string) => {
    const asset = AssetsData.value.get(id);
    if (asset && !asset.isLoaded && asset.url !== '' && asset.name !== '' && asset.altText !== '') {
        AssetsData.value.set(id, { ...asset, isLoaded: true });
    }
}
const generateAltText = (id: string, url: string) => {
    useExternalFetch("/api/alt-text", { params: { url } }).then((altText) => {
        const oldAsset = AssetsData.value.get(id);
        if (oldAsset) {
            AssetsData.value.set(id, { ...oldAsset, altText: altText ?? '' });
            isAssetLoaded(id);
        }
    });
}
const fetchAssetName = (id: string, asset: Asset) => {
    asset.getName().then((name) => {
        const oldAsset = AssetsData.value.get(id);
        if (oldAsset) {
            AssetsData.value.set(id, { ...oldAsset, name });
            isAssetLoaded(id);
        }
    });
}
const validFormats = ['png', 'jpeg', 'gif', 'webp', 'jpg'];
function isValidImageUrl(url: string): boolean {
    const urlString = new URL(url).pathname.toLowerCase();
    if (validFormats.some((format) => urlString.endsWith(format))) return true;
    return false;
}

const fetchAssetUrl = (id: string, asset: Asset) => {
    asset.getUrl().then((url) => {
        if (!isValidImageUrl(url)) return;
        // generateAltText(id, url);
        // fetchAssetName(id, asset);
        AssetsData.value.set(asset.id, { url, name: '', altText: '', isLoaded: true });
    });
}
const fetchAssetsWithAltText = async () => {
    Webflow.getAllAssets().then(async (assets) => {
        assets.forEach((asset) => {
            fetchAssetUrl(asset.id, asset);
        });
    });
}
onMounted(() => {
    fetchAssetsWithAltText();
});
</script>
<template>
    <ul v-if="AssetsData.size">
        <li v-for="([id, { url, name, altText }]) in AssetsData" :key="id">
            <Image :url="url" :id="id" />
            <InputWrapper :name="name" :altText="altText" />
        </li>
    </ul>
</template>
<style scoped>
ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    height: 100%;
    overflow-y: auto;
}

ul li {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    margin: 1rem 0;
    border-radius: 4px;
    height: 8rem;
}
</style>