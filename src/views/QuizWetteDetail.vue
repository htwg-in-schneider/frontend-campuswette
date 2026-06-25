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
            :disabled="isExpired"
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
            <span class="meta-label">Antwortzeit</span>
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

        <form v-if="!isExpired" class="form-card" @submit.prevent="submitTeilnahme">
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

        <div v-else class="expired-notice">
          <p>Diese Wette ist abgelaufen und kann nicht mehr bearbeitet werden.</p>
        </div>

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
      formError: '',
      currentTime: new Date(),
      updateInterval: null
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
    },

    timeRemaining() {
      if (!this.quizWette?.ablaufZeit) {
        return null
      }

      const ablaufTime = new Date(this.quizWette.ablaufZeit)
      const now = new Date(this.currentTime)
      const diff = ablaufTime - now

      return diff > 0 ? diff : 0
    },

    isExpired() {
      return this.timeRemaining === 0
    }
  },

  async mounted() {
    await this.loadQuizWette()
    await this.loadProfile()
    
    // Update current time every second for countdown
    this.updateInterval = setInterval(() => {
      this.currentTime = new Date()
    }, 1000)
  },

  beforeUnmount() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
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
    },

    formatTimeRemaining() {
      if (!this.timeRemaining) {
        return 'keine'
      }

      const totalSeconds = Math.floor(this.timeRemaining / 1000)
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60

      if (hours > 0) {
        return `${hours}h ${minutes}m`
      } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`
      } else {
        return `${seconds}s`
      }
    }
  }
}
</script>

<style scoped>
.deadline-info {
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.info-active {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
  display: block;
}

.info-expired {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
  display: block;
}

.answer-option:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.expired-notice {
  padding: 1.5rem;
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid #f44336;
  border-radius: 6px;
  color: #f44336;
  font-weight: 600;
  text-align: center;
}
</style>