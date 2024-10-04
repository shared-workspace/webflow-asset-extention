<script lang="ts" setup>
import Image from './Image.vue';
import InputWrapper from './InputWrapper.vue';

const props = defineProps<{
    Webflow: WebflowApi
    assetsData: AssetDataMap,
    assetsSelected: AssetDataMap,
    assetsGetFlag: boolean,
    maxSelectionAllowed: number
}>();

const { 
    Webflow, 
    assetsSelected,
    assetsData,
    maxSelectionAllowed
} = props;

// const emit = defineEmits(['assetDataUpdate']);
// const assetsData = computed({
//     get: () => props.assetsData,
//     set: () => emit("assetDataUpdate")
// })

const isAssetLoaded = (id: string) => {
    const asset = assetsData.get(id);
    if (asset && !asset.isLoaded && asset.url !== '' && asset.name !== '' && asset.altText !== '') {
        asset.isLoaded = true;
        assetsData.set(id, asset);
    }
}
const generateAltText = (id: string, url: string) => {
    useExternalFetch("/api/alt-text", { params: { url } }).then((altText) => {
        const oldAsset = assetsData.get(id);
        if (oldAsset) {
            assetsData.set(id, { ...oldAsset, altText: altText ?? '' });
            isAssetLoaded(id);
        }
    });
}
const fetchAssetName = (id: string, asset: Asset) => {
    asset.getName().then((name) => {
        const oldAsset = assetsData.get(id);
        if (oldAsset) {
            assetsData.set(id, { ...oldAsset, name });
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
        assetsData.set(asset.id, { url, name: '', altText: '', isLoaded: true });
    });
}
const max = 5;
const fetchAssetsWithAltText = async () => {
    Webflow.getAllAssets().then(async (assets) => {
        assets.forEach((asset, i) => {
            if (i >= max) return;
            fetchAssetUrl(asset.id, asset);
        });
    });
}
onMounted(() => {
    // webflow.setExtensionSize('comfortable');
    fetchAssetsWithAltText();
});

const toggleFromSelectedList = (id: string) => {
    if (assetsSelected.has(id)) {
        assetsSelected.delete(id);
    } else {
        if (assetsSelected.size >= maxSelectionAllowed - 1) return;
        console.log("size: ", assetsSelected.size, "<", maxSelectionAllowed - 1);
        const asset = assetsData.get(id);
        if (!asset) return;
        assetsSelected.set(id, asset);
    }
}

</script>
<template>
    <ul v-if="assetsData.size">
        <li v-for="([id, { url, name, altText }]) in assetsData" :key="id">
            <Image :url="url" :id="id" :toggle="() => toggleFromSelectedList(id)" :isSelectd="assetsSelected.has(id)" />
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

/* For WebKit browsers */
ul::-webkit-scrollbar {
    width: 8px; /* Adjust the width as needed */
}

ul::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    border-radius: 10px;
}

/* For Firefox */
ul {
    scrollbar-width: thin;
    scrollbar-color: darkgrey transparent;
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