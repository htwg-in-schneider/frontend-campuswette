<template>
  <a :href="href" class="footer-link">
    <slot />
  </a>
</template>

<script setup>
defineProps({
  href: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.footer-link {
  color: #b6bfd7;
  font-weight: 600;
}

.footer-link:hover {
  color: #f7f8ff;
}
</style>