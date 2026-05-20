<template>
  <article class="card">
    <h3>{{ quizWette.frage }}</h3>
    <p>Thema: {{ quizWette.thema }}</p>
    <p>Status: {{ quizWette.status }}</p>
    <p>Schwierigkeit: {{ quizWette.schwierigkeit }}</p>

    <div class="form-actions">
      <AppButton @click="$emit('show-details', quizWette)">
        Details
      </AppButton>

      <RouterLink class="small-btn" :to="`/quizwetten/${quizWette.id}/edit`">
        Bearbeiten
      </RouterLink>
    </div>
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