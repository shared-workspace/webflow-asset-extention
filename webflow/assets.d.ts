declare global {
   type AssetData = { src: string, name: string, alt: string, isLoaded: boolean }
   type AssetMap = Map<string, AssetData>
   type AssetDataMap = Map<string, { url: string, name: string, altText: string, isLoaded: boolean }>
}

export {} // This is to make sure that the file is treated as a module and not as a script