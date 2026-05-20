<template>
  <button
    class="app-button"
    :class="variant"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'accent'
  }
})

defineEmits(['click'])
</script>

<style scoped>
.app-button {
  border: none;
  cursor: pointer;
  padding: 0.85rem 1.2rem;
  border-radius: 999px;
  font-weight: 800;
}

.accent {
  background: #4ade80;
  color: #06130a;
}

.secondary {
  background: transparent;
  color: #f7f8ff;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>