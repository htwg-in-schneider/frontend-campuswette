<template>
  <main class="section">
    <div class="container">
      <RouterLink to="/" class="back-link">← Zurück zur Übersicht</RouterLink>

      <p v-if="isLoading">Quiz-Wette wird geladen...</p>

      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <div v-if="!isLoading" class="form-card page-form">
        <p class="eyebrow">Quiz-Wette bearbeiten</p>
        <h1>Quiz-Wette bearbeiten</h1>

        <form @submit.prevent="submitForm">
          <label>
            Thema
            <input v-model="form.thema" required />
          </label>

          <label>
            Frage
            <textarea v-model="form.frage" required></textarea>
          </label>

          <div class="form-row">
            <label>
              Antwort A
              <input v-model="form.antwortA" required />
            </label>

            <label>
              Antwort B
              <input v-model="form.antwortB" required />
            </label>
          </div>

          <div class="form-row">
            <label>
              Antwort C
              <input v-model="form.antwortC" required />
            </label>

            <label>
              Antwort D
              <input v-model="form.antwortD" required />
            </label>
          </div>

          <div class="form-row">
            <label>
              Korrekte Antwort
              <select v-model="form.korrekteAntwort">
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </label>

            <label>
              Schwierigkeit
              <select v-model="form.schwierigkeit">
                <option value="LEICHT">Leicht</option>
                <option value="MITTEL">Mittel</option>
                <option value="SCHWER">Schwer</option>
              </select>
            </label>
          </div>

          <div class="form-row">
            <label>
              Status
              <select v-model="form.status">
                <option value="ENTWURF">Entwurf</option>
                <option value="AKTIV">Aktiv</option>
                <option value="BEENDET">Beendet</option>
              </select>
            </label>

            <label>
              Zeitlimit in Sekunden
              <input v-model.number="form.zeitlimitSekunden" type="number" min="10" required />
            </label>
          </div>

          <label>
            Punktebudget
            <input v-model.number="form.punkteBudget" type="number" min="0" required />
          </label>

          <label>
            Professor
            <select v-model.number="form.professor.id" required>
              <option
                v-for="professor in professors"
                :key="professor.id"
                :value="professor.id"
              >
                {{ professor.name }}
              </option>
            </select>
          </label>

          <div class="form-actions">
            <button class="btn" type="submit">
              Änderungen speichern
            </button>

            <button class="small-btn danger" type="button" @click="deleteCurrentQuizWette">
              Quiz-Wette löschen
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
import {
  deleteQuizWette,
  fetchProfessors,
  fetchQuizWetteById,
  updateQuizWette
} from '../services/quizWetteService'

export default {
  data() {
    return {
      professors: [],
      isLoading: false,
      errorMessage: '',
      form: {
        thema: '',
        frage: '',
        antwortA: '',
        antwortB: '',
        antwortC: '',
        antwortD: '',
        korrekteAntwort: 'A',
        schwierigkeit: 'LEICHT',
        status: 'ENTWURF',
        zeitlimitSekunden: 60,
        punkteBudget: 100,
        professor: {
          id: ''
        }
      }
    }
  },

  async mounted() {
    await this.loadData()
  },

  methods: {
    async loadData() {
      this.isLoading = true
      this.errorMessage = ''

      try {
        const [quizWette, professors] = await Promise.all([
          fetchQuizWetteById(this.$route.params.id),
          fetchProfessors()
        ])

        this.professors = professors

        this.form = {
          thema: quizWette.thema,
          frage: quizWette.frage,
          antwortA: quizWette.antwortA,
          antwortB: quizWette.antwortB,
          antwortC: quizWette.antwortC,
          antwortD: quizWette.antwortD,
          korrekteAntwort: quizWette.korrekteAntwort,
          schwierigkeit: quizWette.schwierigkeit,
          status: quizWette.status,
          zeitlimitSekunden: quizWette.zeitlimitSekunden,
          punkteBudget: quizWette.punkteBudget,
          professor: {
            id: quizWette.professor?.id || ''
          }
        }
      } catch (error) {
        this.errorMessage = 'Die Daten konnten nicht geladen werden.'
      } finally {
        this.isLoading = false
      }
    },

    async submitForm() {
      try {
        await updateQuizWette(this.$route.params.id, this.form)
        this.$router.push('/')
      } catch (error) {
        this.errorMessage = 'Die Quiz-Wette konnte nicht gespeichert werden.'
      }
    },

    async deleteCurrentQuizWette() {
      const confirmed = confirm('Soll diese Quiz-Wette wirklich gelöscht werden?')

      if (!confirmed) {
        return
      }

      try {
        await deleteQuizWette(this.$route.params.id)
        this.$router.push('/')
      } catch (error) {
        this.errorMessage = 'Die Quiz-Wette konnte nicht gelöscht werden.'
      }
    }
  }
}
</script>