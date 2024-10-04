<script setup lang="ts">
const props = defineProps<{
    url: string,
    id: string,
    toggle: () => void,
    isSelectd: boolean
}>();
// watch isSelectd
console.log("isSelectd: ", props.isSelectd);
watch(() => props.isSelectd, (newValue) => {
    console.log("isSelectd: ", newValue);
    if (newValue !== props.isSelectd) {
        props.toggle();
    }
})

</script>
<template>
    <div class="image-wrapper">
        <input type="checkbox" :id="id" :checked="isSelectd" />
        <label class="image-wrapper" :for="id">
            <img :src="url" />
        </label>
    </div>
</template>


<style scoped>
.image-wrapper {
    height: 100%;
    width: auto;
    aspect-ratio: 1 / 1;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 4px;
}

.image-wrapper input {
    display: none;
}

img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    transition: transform 0.5s;
}


input:checked~label {
    background-color: rgb(69, 69, 240);
}

input:checked~label img {
    transform: scale(0.9);
}
</style>