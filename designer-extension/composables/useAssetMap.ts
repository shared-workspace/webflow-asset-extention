
const max = 2;
const assetMap = ref<AssetMap>(new Map());
const WebflowRef = ref<WebflowApi | null>(null);
const limitFetch = ref(0);

function UpdateAsset<T extends keyof AssetData>(id: string, src: string) {
    assetMap.value.set(id, { src, name: '', alt: '', isLoaded: true });
    return (key: T, value: AssetData[T]) => {
        assetMap.value.set(id, { ...assetMap.value.get(id)!, [key]: value });
        const asset = assetMap.value.get(id)!;
        if (!asset.isLoaded && asset.src !== '' && asset.name !== '') {
            asset.isLoaded = true;
            assetMap.value.set(id, asset);
        }
    }
}

const validFormats = ['png', 'jpeg', 'gif', 'webp', 'jpg'];
function isValidImageUrl(src: string): boolean {
    const urlString = new URL(src).pathname.toLowerCase();
    if (validFormats.some((format) => urlString.endsWith(format))) return true;
    return false;
}

function getOtherValues(id: string, src: string, asset: Asset, j = 0, generateAltText = false, maxAltText = 0) {
    // Closure to update assetMap
    const updateAsset = UpdateAsset(id, src);

    // get asset name
    asset.getName().then((name) => updateAsset('name', name));

    // Limit the number of alt text generated
    if (generateAltText && j++ < maxAltText) {
        useNuxtApp().$api<string>("/api/alt-text", { query: { src } }).then((alt) => alt && updateAsset('alt', alt));
    } else  // get asset name if alt text is not generated
        asset.getAltText().then((alt) => alt && updateAsset('alt', alt));
}

function getAllAssets(Webflow: WebflowApi, { generateAltText = false, maxAltText = 0, maxAssetFetch = 0, sync = false } = {}) {
    console.log("get all assets");
    WebflowRef.value = Webflow;
    limitFetch.value = maxAssetFetch;
    Webflow.getAllAssets().then((assets) => {
        for (let i = 0, j = 0; i < assets.length; i++) {

            // Limit the number of assets fetched
            if (i >= maxAssetFetch) break;
            const asset = assets[i];

            // sync false 
            if (!(sync && assetMap.value.has(asset.id)))
                asset.getUrl().then((src) => {

                    // prevent error due to zip, svg, etc. while generating alt text
                    if (isValidImageUrl(src)) {
                        getOtherValues(asset.id, src, asset, j, generateAltText, maxAltText);
                    }
                });
            else {
                const src = assetMap.value.get(asset.id)!.src;
                getOtherValues(asset.id, src, asset);
            }

        }
    });
}

function syncAssets() {
    getAllAssets(WebflowRef.value!, { sync: true, maxAssetFetch: limitFetch.value });
}

function saveAssetData(id: string, alt: string) {
    WebflowRef.value!.getAssetById(id).then((asset) => (asset?.setAltText(alt)))
}

function updateAssetAltText(id: string, alt: string) {
    const asset = assetMap.value.get(id)!;
    assetMap.value.set(id, { ...asset, alt });
}
export function useAssetMap() {
    return {
        assetMap,
        getAllAssets,
        syncAssets,
        saveAssetData, 
        generateAltText: (id: string, asset: AssetData) => {
            if (asset.src !== '') useNuxtApp().$api<string>("/api/alt-text", { query: { src: asset.src } }).then((alt) => alt && assetMap.value.set(id, { ...asset, alt }));
        },
        updateAssetAltText,
        totalAssets: computed(() => assetMap.value.size)
    };
}