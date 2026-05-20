<template>
  <main class="section">
    <div class="container">
      <RouterLink to="/" class="back-link">← Zurück zur Übersicht</RouterLink>

      <p v-if="isLoading">Quiz-Wette wird geladen...</p>

      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <article v-if="quizWette" class="card detail-card">
        <p class="eyebrow">{{ quizWette.thema }}</p>
        <h1>{{ quizWette.frage }}</h1>

        <ul class="answers">
          <li>A: {{ quizWette.antwortA }}</li>
          <li>B: {{ quizWette.antwortB }}</li>
          <li>C: {{ quizWette.antwortC }}</li>
          <li>D: {{ quizWette.antwortD }}</li>
        </ul>

        <p>Status: {{ quizWette.status }}</p>
        <p>Schwierigkeit: {{ quizWette.schwierigkeit }}</p>
        <p>Zeitlimit: {{ quizWette.zeitlimitSekunden }} Sekunden</p>
        <p>Punktebudget: {{ quizWette.punkteBudget }}</p>
        <p>Korrekte Antwort: {{ quizWette.korrekteAntwort }}</p>

        <p v-if="quizWette.professor">
          Professor: {{ quizWette.professor.name }}
        </p>
      </article>
    </div>
  </main>
</template>

<script>
import { fetchQuizWetteById } from '../services/quizWetteService'

export default {
  data() {
    return {
      quizWette: null,
      isLoading: false,
      errorMessage: ''
    }
  },

  async mounted() {
    await this.loadQuizWette()
  },

  methods: {
    async loadQuizWette() {
      this.isLoading = true
      this.errorMessage = ''

      try {
        this.quizWette = await fetchQuizWetteById(this.$route.params.id)
      } catch (error) {
        this.errorMessage = 'Die Quiz-Wette konnte nicht geladen werden.'
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>