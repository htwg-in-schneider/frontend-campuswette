<template>
  <main class="section">
    <div class="container">
      <RouterLink to="/" class="back-link">← Zurück zur Übersicht</RouterLink>

      <div class="form-card page-form">
        <p class="eyebrow">Neue Quiz-Wette</p>
        <h1>Quiz-Wette erstellen</h1>

        <p v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>

        <form @submit.prevent="submitForm">
          <label>
            Thema
            <input v-model="form.thema" required placeholder="z. B. Web-Technologien" />
          </label>

          <label>
            Frage
            <textarea v-model="form.frage" required placeholder="Quiz-Frage eingeben"></textarea>
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
              <option disabled value="">Professor auswählen</option>
              <option
                v-for="professor in professors"
                :key="professor.id"
                :value="professor.id"
              >
                {{ professor.name }}
              </option>
            </select>
          </label>

          <button class="btn" type="submit">
            Quiz-Wette erstellen
          </button>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
import { createQuizWette, fetchProfessors } from '../services/quizWetteService'

export default {
  data() {
    return {
      professors: [],
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
    try {
      this.professors = await fetchProfessors()
    } catch (error) {
      this.errorMessage = 'Professoren konnten nicht geladen werden.'
    }
  },

  methods: {
    async submitForm() {
      try {
        await createQuizWette(this.form)
        this.$router.push('/')
      } catch (error) {
        this.errorMessage = 'Die Quiz-Wette konnte nicht erstellt werden.'
      }
    }
  }
}
</script>