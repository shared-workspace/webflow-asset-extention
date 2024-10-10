window.addEventListener('load', async () => {
  console.log('Hello from webflow-vite-plugin');
  const assets = await webflow.getAllAssets();
  assets.forEach((asset) => {
    console.log(asset.id);
  });
});