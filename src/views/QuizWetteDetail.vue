<template>
  <main class="section">
    <div class="container narrow">
      <RouterLink to="/quizwetten" class="back-link">
        ← Zurück zur Übersicht
      </RouterLink>

      <p v-if="isLoading" class="section-intro">
        Quiz-Wette wird geladen...
      </p>

      <p v-else-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <article v-else-if="quizWette" class="text-card">
        <span class="status-badge">{{ quizWette.status }}</span>

        <header class="page-header">
          <p class="eyebrow">{{ quizWette.thema }}</p>
          <h1>{{ quizWette.frage }}</h1>
          <p class="section-intro">
            Wähle eine Antwort aus und prüfe die Details dieser Quiz-Wette.
            Die eigentliche Teilnahmefunktion ergänzen wir im nächsten Schritt
            im User-Bereich.
          </p>
        </header>

        <div class="answers">
          <button
            v-for="answer in answers"
            :key="answer.key"
            class="answer-option"
            type="button"
            @click="selectedAnswer = answer.key"
            :class="{ selected: selectedAnswer === answer.key }"
          >
            <strong>{{ answer.key }}:</strong> {{ answer.text }}
          </button>
        </div>

        <div class="meta-grid">
          <div class="meta-item">
            <span class="meta-label">Schwierigkeit</span>
            <span class="meta-value">{{ quizWette.schwierigkeit }}</span>
          </div>

          <div class="meta-item">
            <span class="meta-label">Zeitlimit</span>
            <span class="meta-value">
              {{ quizWette.zeitlimitSekunden }} Sekunden
            </span>
          </div>

          <div class="meta-item">
            <span class="meta-label">Punktebudget</span>
            <span class="meta-value">{{ quizWette.punkteBudget }} Punkte</span>
          </div>

          <div class="meta-item">
            <span class="meta-label">Professor:in</span>
            <span class="meta-value">
              {{ quizWette.professor?.name || 'Nicht zugeordnet' }}
            </span>
          </div>
        </div>

        <div class="cta-box">
          <h2>Teilnahme vorbereiten</h2>
          <p v-if="selectedAnswer">
            Ausgewählte Antwort: <strong>{{ selectedAnswer }}</strong>
          </p>
          <p v-else>
            Wähle zunächst eine Antwort aus. Die vollständige Teilnahme mit
            Punkteinsatz bauen wir anschließend als komplexen User-Prozess.
          </p>

          <button class="btn full-width" type="button" disabled>
            Teilnahme folgt im User-Bereich
          </button>
        </div>
      </article>

      <div v-else class="text-card">
        <h1>Quiz-Wette nicht gefunden</h1>
        <p>Die angeforderte Quiz-Wette konnte nicht gefunden werden.</p>
      </div>
    </div>
  </main>
</template>

<script>
import { quizWetteApi } from '../services/api'

export default {
  data() {
    return {
      quizWette: null,
      selectedAnswer: '',
      isLoading: false,
      errorMessage: ''
    }
  },

  computed: {
    answers() {
      if (!this.quizWette) {
        return []
      }

      return [
        { key: 'A', text: this.quizWette.antwortA },
        { key: 'B', text: this.quizWette.antwortB },
        { key: 'C', text: this.quizWette.antwortC },
        { key: 'D', text: this.quizWette.antwortD }
      ]
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
        const id = this.$route.params.id
        this.quizWette = await quizWetteApi.getById(id)
      } catch (error) {
        this.errorMessage = 'Die Quiz-Wette konnte nicht geladen werden.'
        console.error(error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>