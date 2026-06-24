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
            Wähle eine Antwort aus, setze Punkte und schließe die Teilnahme ab.
            Das Ergebnis wird gespeichert und dein Punktestand wird aktualisiert.
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

        <form class="form-card" @submit.prevent="submitTeilnahme">
          <h2>Teilnahme abschließen</h2>

          <p v-if="profile">
            Aktueller Punktestand:
            <strong>{{ profile.points }} Punkte</strong>
          </p>

          <p v-else class="section-intro">
            Bitte melde dich an, um deinen Punktestand zu laden und an der
            Quiz-Wette teilzunehmen.
          </p>

          <label>
            Punkteinsatz
            <input
              v-model.number="gesetztePunkte"
              type="number"
              min="1"
              :max="profile?.points || 1"
              required
              placeholder="z. B. 50"
            />
          </label>

          <p v-if="formError" class="error-message">
            {{ formError }}
          </p>

          <button class="btn full-width" type="submit">
            Teilnahme speichern
          </button>
        </form>

        <article v-if="result" class="text-card result-card">
          <span
            class="status-badge"
            :class="{ success: result.richtig, danger: !result.richtig }"
          >
            {{ result.richtig ? 'Richtig' : 'Falsch' }}
          </span>

          <h2>Ergebnis gespeichert</h2>
          <p>
            Gewählte Antwort:
            <strong>{{ result.gewaehlteAntwort }}</strong>
          </p>
          <p>
            Punkteänderung:
            <strong>{{ result.punkteAenderung }}</strong>
          </p>
          <p>
            Neuer Punktestand:
            <strong>{{ result.neuerPunktestand }} Punkte</strong>
          </p>
        </article>
      </article>

      <div v-else class="text-card">
        <h1>Quiz-Wette nicht gefunden</h1>
        <p>Die angeforderte Quiz-Wette konnte nicht gefunden werden.</p>
      </div>
    </div>
  </main>
</template>

<script>
import { quizWetteApi, teilnahmeApi, userApi } from '../services/api'

export default {
  data() {
    return {
      profile: null,
      quizWette: null,
      selectedAnswer: '',
      gesetztePunkte: null,
      result: null,
      isLoading: false,
      errorMessage: '',
      formError: ''
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
    await this.loadProfile()
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
    },

    async loadProfile() {
      try {
        this.profile = await userApi.getProfile()
      } catch (error) {
        this.profile = null
      }
    },

    async submitTeilnahme() {
      this.formError = ''
      this.result = null

      if (!this.profile) {
        this.formError = 'Bitte melde dich zuerst an.'
        return
      }

      if (!this.selectedAnswer) {
        this.formError = 'Bitte wähle eine Antwort aus.'
        return
      }

      if (!this.gesetztePunkte || this.gesetztePunkte <= 0) {
        this.formError = 'Bitte gib einen gültigen Punkteinsatz ein.'
        return
      }

      if (this.gesetztePunkte > this.profile.points) {
        this.formError = 'Du kannst nicht mehr Punkte setzen, als du besitzt.'
        return
      }

      try {
        const response = await teilnahmeApi.create({
          userId: this.profile.id,
          quizWetteId: this.quizWette.id,
          gewaehlteAntwort: this.selectedAnswer,
          gesetztePunkte: this.gesetztePunkte
        })

        this.result = response
        await this.loadProfile()
      } catch (error) {
        this.formError = 'Die Teilnahme konnte nicht gespeichert werden.'
        console.error(error)
      }
    }
  }
}
</script>