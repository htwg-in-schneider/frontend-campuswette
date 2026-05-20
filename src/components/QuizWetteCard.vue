<template>
  <article class="card">
    <h3>{{ quizWette.frage }}</h3>
    <p>Thema: {{ quizWette.thema }}</p>
    <p>Status: {{ quizWette.status }}</p>
    <p>Schwierigkeit: {{ quizWette.schwierigkeit }}</p>

    <AppButton @click="$emit('show-details', quizWette)">
        Details
    </AppButton>
  </article>
</template>

<script setup>
import AppButton from './AppButton.vue'

defineProps({
  quizWette: {
    type: Object,
    required: true
  }
})

defineEmits(['show-details'])
</script>