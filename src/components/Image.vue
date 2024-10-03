<script lang="ts">
export default {
    name: 'Image',
    props: {
        url: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        }
    }
}
</script>
<template>
    <div class="image-wrapper">
        <input type="checkbox" style="display: none;" :name="id" />
        <label class="image-wrapper" :for="id">
            <img :src="url" />
        </label>
    </div>
</template>


<style scoped>
.image-wrapper {
  height: 100%;
  /* Set the height */
  width: auto;
  /* Width will automatically adjust to match the height */
  aspect-ratio: 1 / 1;
  /* Maintain a 1:1 aspect ratio */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 4px;
}

img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  /* Ensure the image covers the container */
}
</style>