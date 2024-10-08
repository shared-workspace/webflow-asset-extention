import { ref, computed } from "vue";
import { useAssetMap } from "./useAssetMap";

const { assetMap, saveAssetData, generateAltText } = useAssetMap();
const maxSelectAllowed = ref(0);
const setMaxSelectAllowed = (max: number) => (maxSelectAllowed.value = max);
const assetsSelectedMap = ref<AssetMap>(new Map());

function toggleAssetInSelectedMap(id: string, deselectSkip = false) {
    if (assetsSelectedMap.value.has(id)) {
        if (!deselectSkip) assetsSelectedMap.value.delete(id);
    } else {
        if (assetsSelectedMap.value.size < maxSelectAllowed.value) {
            assetsSelectedMap.value.set(id, assetMap.value.get(id)!);
        } else return true;
    }
    return false;
}

function selectAll() {
    for (const [id, _asset] of assetMap.value) {
        if (toggleAssetInSelectedMap(id, true)) break;
    }
}


export function useAssetSelectedMap({ limit = 1 } = {}) {
    setMaxSelectAllowed(limit);
    return { 
        assetsSelectedMap, 
        toggleAssetInSelectedMap, // add or remove asset from selected map reutrn true if limit reached
        selectAll,                  // select all assets if limit not reached
        deselectAll: () => assetsSelectedMap.value.clear(),
        isLimitReached: () => (assetsSelectedMap.value.size >= maxSelectAllowed.value), // check if limit reached
        isAssetSelected: (id: string) => assetsSelectedMap.value.has(id), // check if asset is selected
        isNoneSelected: () => !assetsSelectedMap.value.size, // check if no asset is selected
        saveSelectedAssets: () => assetsSelectedMap.value.forEach((value, key) => saveAssetData(key, value.alt)), // save selected assets data
        generateAltTextForSelected: () => assetsSelectedMap.value.forEach((value, key) => generateAltText(key, value)), // generate alt text for selected assets
        totalAssetsSelected: computed(() => assetsSelectedMap.value.size) // get total assets selected
    };
}
