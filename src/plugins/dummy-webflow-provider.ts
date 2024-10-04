import { Webflow } from "webflow-api";
class DummyAsset implements Webflow.Asset {
  id?: string | undefined;
  altText?: string | undefined;
  url?: string | undefined;
  constructor(id: string) {
    this.id = id
  }
  async getUrl() {
    if (this.url) {
      return this.url
    }
    const res = useFetch(`/api/webflow/getUrl?id=${this.id}`);
    res.then((url) => {
      this.url = url.data?.value || ""
    })
    return new Promise<typeof res.data.value>((resolve) => {
      res.then((url) => {
        resolve(url.data?.value)
      })
    })
  }
  async getAltText() {
    if (this.altText) {
      return this.altText
    }
    const res = useFetch(`/api/webflow/getAltText?id=${this.id}`)
    res.then((altText) => {
      this.altText = altText.data.value || ""
    })
    return new Promise<typeof res.data.value>((resolve) => {
      res.then((altText) => {
        resolve(altText.data?.value)
      })
    })
  }
  async setAltText(altText: string) {
    const res = useFetch(`/api/webflow/setAltText?id=${this.id}&altText=${altText}`)
    res.then((newAltText) => {
      this.altText = newAltText.data.value || ""
    })
    return new Promise<typeof res.data.value>((resolve) => {
      res.then((newAltText) => {
        resolve(newAltText.data?.value)
      })
    })
  }
  async getName(){
    const res = useFetch(`/api/webflow/getName?id=${this.id}`)
    return new Promise<typeof res.data.value>((resolve) => {
      res.then((name) => {
        resolve(name.data?.value)
      })
    })
  }
}
export default defineNuxtPlugin(function () {
  console.log('Dummy Webflow provider plugin loaded');
  return {
    provide: {
      webflow: {
        getAllAssets: async () => {
          const res = useFetch("/api/webflow/getAllAssets");
          return new Promise<Array<Asset>>((resolve) => {
            const assetsArray: Array<Asset> = []
            res.then((assets) => {
              assets.data?.value?.forEach(async (asset) => {
                assetsArray.push(new DummyAsset(asset.id) as unknown as Asset)
              })
              resolve(assetsArray)
            })
          })
        },
        getAssetById: async (id: string) => {
          const res = useFetch(`/api/webflow/getAssetById?id=${id}`);
          // return new DummyAsset(res.id) as unknown as Asset
          return new Promise<Asset | null>((resolve) => {
            res.then((asset) => {
              resolve(asset.data.value?.id ? new DummyAsset(asset.data.value.id) as unknown as Asset : null)
            })
          })
        },

      } as WebflowApi
    }
  }
})