<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()
const isChecked = ref(false)
const type = ref('password')

const onTypeToggled = () => {
  const newVal = !isChecked.value
  isChecked.value = newVal
  type.value = newVal ? 'text' : 'password'
}
defineExpose({ onTypeToggled })
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      You’ve successfully created a project with
      <a href="https://vite.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>. What's next?
    </h3>
  </div>
  <div>
    <form>
      <p class="form-field"><input :type="type" /></p>
      <p class="form-field">
        <label>Show <input type="checkbox" :checked="isChecked" @change="onTypeToggled" /></label>
      </p>
    </form>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

.form-field {
  height: 2em;
  cursor: grab;
}

.form-field label,
.form-field input {
  height: 2em;
  line-height: 2em;
  cursor: grab;
}

.form-field input[type='checkbox'] {
  position: relative;
  top: 10px; /* Adjust the value to control the vertical offset */
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
