<template>
  <main class="section">
    <div class="container">
      <RouterLink to="/" class="back-link">← Zurück zur Übersicht</RouterLink>

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
      </article>

      <p v-else>Quiz-Wette wurde nicht gefunden.</p>
    </div>
  </main>
</template>

<script>
import { quizWetten } from '../data/quizwetten'

export default {
  computed: {
    quizWette() {
      const id = Number(this.$route.params.id)
      return quizWetten.find((quizWette) => quizWette.id === id)
    }
  }
}
</script>