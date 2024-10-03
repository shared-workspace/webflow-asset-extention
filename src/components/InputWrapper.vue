<script lang="ts">
export default {
    name: 'InputWrapper',
    props: {
        name: {
            type: String,
            required: true
        },
        altText: {
            type: String,
            required: true
        }
    }
}
</script>
<template>
    <div class="input-wrapper">
        <input class="name" type="text" :value="name" />
        <input class="alt-text" type="text" :value="altText" />
    </div>
</template>
<style scoped>
.input-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    flex-grow: 1;
    margin: 0 auto;
    justify-content: center;
    align-items: center;
}
input {
  all: unset; /* Reset all default styles */
  width: 90%;
  border: 1px solid white; /* Set border to white */
  border-radius: 4px;
  background: #ffffff1e; /* Set a semi-transparent white background */
  color: white; /* Set text color to white */
  box-sizing: border-box; /* Ensure padding and border are included in the element's total width and height */
  padding: 0.5rem; /* Optional: Add some padding for better appearance */
  font-size: 0.8rem;
}

input.name {
  height: 2rem;
}

input.alt-text {
  flex-grow: 1;
}

.input-wrapper > input {
    margin-bottom: 1rem;
}
</style>