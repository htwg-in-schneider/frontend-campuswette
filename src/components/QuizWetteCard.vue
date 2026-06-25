<template>
  <article class="card">
    <h3>{{ quizWette.frage }}</h3>
    <p><strong>Thema:</strong> {{ quizWette.thema }}</p>
    <p><strong>Status:</strong> {{ quizWette.status }}</p>
    <p><strong>Schwierigkeit:</strong> {{ quizWette.schwierigkeit }}</p>

    <!-- Gewinn-Pot oder Budget anzeigen -->
    <p v-if="quizWette.gewinnPot !== undefined && quizWette.gewinnPot > 0">
      <strong>🏆 Gewinn-Pot:</strong> {{ quizWette.gewinnPot }} Punkte
    </p>
    <p
      v-else-if="
        quizWette.punkteBudget !== undefined && quizWette.punkteBudget > 0
      "
    >
      <strong>💰 Budget:</strong> {{ quizWette.punkteBudget }} Punkte
    </p>

    <!-- Professor anzeigen (falls Professor-Quiz) -->
    <p v-if="quizWette.professor">
      <strong>👨‍🏫 Professor:</strong> {{ quizWette.professor.name }}
    </p>

    <AppButton @click="$emit('show-details', quizWette)"> Details </AppButton>
  </article>
</template>

<script setup>
import AppButton from "./AppButton.vue";

defineProps({
  quizWette: {
    type: Object,
    required: true,
  },
});

defineEmits(["show-details"]);
</script>
