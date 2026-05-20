<template>
  <article class="card">
    <h3>{{ quizWette.frage }}</h3>
    <p>Thema: {{ quizWette.thema }}</p>
    <p>Status: {{ quizWette.status }}</p>
    <p>Schwierigkeit: {{ quizWette.schwierigkeit }}</p>

    <button class="btn" @click="$emit('show-details', quizWette)">
      Details
    </button>
  </article>
</template>

<script setup>
defineProps({
  quizWette: {
    type: Object,
    required: true
  }
})

defineEmits(['show-details'])
</script>