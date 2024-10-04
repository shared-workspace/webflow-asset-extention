<script lang="ts" setup>
const props = defineProps<{
    dataMap: Map<string, string>, // read-only
}>();
const emit = defineEmits(['update:dataMap']);

const addItem = () => {
    const newDataMap = new Map(props.dataMap);
    newDataMap.set(`key${newDataMap.size + 1}`, 'new value');
    emit('update:dataMap', newDataMap);
}
</script>
<template>
    <button @click="addItem">Add Item</button>
</template>