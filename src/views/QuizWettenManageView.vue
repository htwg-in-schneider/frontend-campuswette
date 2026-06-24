<template>
  <main class="section">
    <div class="container">
      <RouterLink to="/" class="back-link">
        ← Zurück zur Startseite
      </RouterLink>

      <header class="page-header">
        <p class="eyebrow">Quiz-Wetten Verwaltung</p>
        <h1>Quiz-Wetten verwalten</h1>
        <p class="section-intro">
          Professor:innen und Administrator:innen können hier Quiz-Wetten erstellen,
          bearbeiten und löschen.
        </p>
      </header>

      <p v-if="isCheckingProfile" class="section-intro">
        Berechtigungen werden geprüft...
      </p>

      <article v-else-if="!canManageQuizWetten" class="text-card">
        <h2>Kein Zugriff</h2>
        <p>
          Diese Seite ist nur für Professor:innen und Administrator:innen zugänglich.
        </p>
      </article>

      <template v-else>
        <section class="form-card">
          <h2>{{ editingQuizWetteId ? 'Quiz-Wette bearbeiten' : 'Neue Quiz-Wette erstellen' }}</h2>

          <form class="admin-form" @submit.prevent="saveQuizWette">
            <label>
              Thema
              <input
                v-model.trim="form.thema"
                type="text"
                required
                placeholder="z. B. Marketing"
              />
            </label>

            <label>
              Frage
              <textarea
                v-model.trim="form.frage"
                rows="3"
                required
                placeholder="Frage der Quiz-Wette"
              ></textarea>
            </label>

            <div class="meta-grid">
              <label>
                Antwort A
                <input v-model.trim="form.antwortA" type="text" required />
              </label>

              <label>
                Antwort B
                <input v-model.trim="form.antwortB" type="text" required />
              </label>

              <label>
                Antwort C
                <input v-model.trim="form.antwortC" type="text" required />
              </label>

              <label>
                Antwort D
                <input v-model.trim="form.antwortD" type="text" required />
              </label>
            </div>

            <div class="meta-grid">
              <label>
                Korrekte Antwort
                <select v-model="form.korrekteAntwort" required>
                  <option value="">Bitte wählen</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </label>

              <label>
                Schwierigkeit
                <select v-model="form.schwierigkeit" required>
                  <option value="">Bitte wählen</option>
                  <option value="LEICHT">Leicht</option>
                  <option value="MITTEL">Mittel</option>
                  <option value="SCHWER">Schwer</option>
                </select>
              </label>

              <label>
                Status
                <select v-model="form.status" required>
                  <option value="">Bitte wählen</option>
                  <option value="ENTWURF">Entwurf</option>
                  <option value="AKTIV">Aktiv</option>
                  <option value="BEENDET">Beendet</option>
                </select>
              </label>

              <label>
                Professor:in
                <select v-model.number="selectedProfessorId" required>
                  <option value="">Bitte wählen</option>
                  <option
                    v-for="professor in professors"
                    :key="professor.id"
                    :value="professor.id"
                  >
                    {{ professor.name }}
                  </option>
                </select>
              </label>
            </div>

            <div class="meta-grid">
              <label>
                Zeitlimit in Sekunden (Antwortzeit)
                <input
                  v-model.number="form.zeitlimitSekunden"
                  type="number"
                  min="1"
                  required
                />
              </label>

              <label>
                Wettlaufzeit in Minuten
                <input
                  v-model.number="form.zeitlimitMinuten"
                  type="number"
                  min="1"
                  max="1440"
                  required
                  placeholder="z. B. 30"
                />
              </label>

              <label>
                Punktebudget
                <input
                  v-model.number="form.punkteBudget"
                  type="number"
                  min="1"
                  required
                />
              </label>
            </div>

            <p v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </p>

            <p v-if="successMessage" class="success-message">
              {{ successMessage }}
            </p>

            <div class="admin-actions">
              <button class="btn" type="submit">
                {{ editingQuizWetteId ? 'Änderungen speichern' : 'Quiz-Wette erstellen' }}
              </button>

              <button
                v-if="editingQuizWetteId"
                class="btn secondary"
                type="button"
                @click="resetForm"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </section>

        <section class="form-card">
          <label>
            Suche
            <input
              v-model.trim="searchTerm"
              type="text"
              placeholder="Nach Thema, Frage, Status oder Professor suchen"
            />
          </label>
        </section>

        <p v-if="isLoading" class="section-intro">
          Quiz-Wetten werden geladen...
        </p>

        <p v-else-if="loadError" class="error-message">
          {{ loadError }}
        </p>

        <section v-else>
          <p class="section-intro">
            Angezeigt: {{ filteredQuizWetten.length }} von {{ quizWetten.length }}
            Quiz-Wetten
          </p>

          <div v-if="filteredQuizWetten.length > 0" class="admin-table-card">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Thema</th>
                  <th>Frage</th>
                  <th>Status</th>
                  <th>Schwierigkeit</th>
                  <th>Professor:in</th>
                  <th>Aktionen</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="quizWette in filteredQuizWetten" :key="quizWette.id">
                  <td>{{ quizWette.thema }}</td>
                  <td>{{ quizWette.frage }}</td>
                  <td>
                    <span class="status-badge">{{ quizWette.status }}</span>
                  </td>
                  <td>{{ quizWette.schwierigkeit }}</td>
                  <td>{{ quizWette.professor?.name || 'Nicht zugeordnet' }}</td>
                  <td>
                    <div class="table-actions">
                      <button
                        class="small-button"
                        type="button"
                        @click="startEditing(quizWette)"
                      >
                        Bearbeiten
                      </button>

                      <button
                        class="small-button danger"
                        type="button"
                        @click="deleteQuizWette(quizWette)"
                      >
                        Löschen
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <article v-else class="text-card">
            <h2>Keine Quiz-Wetten gefunden</h2>
            <p>
              Passe die Suche an oder erstelle eine neue Quiz-Wette.
            </p>
          </article>
        </section>
      </template>
    </div>
  </main>
</template>

<script>
import { quizWetteApi, professorApi, userApi } from '../services/api'

export default {
  data() {
    return {
      profile: null,
      professors: [],
      quizWetten: [],
      searchTerm: '',
      isCheckingProfile: true,
      isLoading: false,
      loadError: '',
      errorMessage: '',
      successMessage: '',
      editingQuizWetteId: null,
      selectedProfessorId: '',
      form: {
        thema: '',
        frage: '',
        antwortA: '',
        antwortB: '',
        antwortC: '',
        antwortD: '',
        korrekteAntwort: '',
        schwierigkeit: '',
        status: 'ENTWURF',
        zeitlimitSekunden: 60,
        punkteBudget: 100
      }
    }
  },

  computed: {
    canManageQuizWetten() {
      return this.profile?.role === 'ADMIN' || this.profile?.role === 'PROFESSOR'
    },

    filteredQuizWetten() {
      const search = this.searchTerm.toLowerCase()

      return this.quizWetten.filter((quizWette) => {
        const professorName = quizWette.professor?.name || ''

        return (
          !search ||
          quizWette.thema?.toLowerCase().includes(search) ||
          quizWette.frage?.toLowerCase().includes(search) ||
          quizWette.status?.toLowerCase().includes(search) ||
          quizWette.schwierigkeit?.toLowerCase().includes(search) ||
          professorName.toLowerCase().includes(search)
        )
      })
    }
  },

  async mounted() {
    await this.loadProfile()
    if (this.canManageQuizWetten) {
      await Promise.all([
        this.loadProfessors(),
        this.loadQuizWetten()
      ])
    }
  },

  methods: {
    async loadProfile() {
      this.isCheckingProfile = true

      try {
        this.profile = await userApi.getProfile()
      } catch (error) {
        this.profile = null
        console.error(error)
      } finally {
        this.isCheckingProfile = false
      }
    },

    async loadProfessors() {
      try {
        this.professors = await professorApi.getAll()
      } catch (error) {
        this.errorMessage = 'Professor:innen konnten nicht geladen werden.'
        console.error(error)
      }
    },

    async loadQuizWetten() {
      this.isLoading = true
      this.loadError = ''

      try {
        this.quizWetten = await quizWetteApi.getAll()
      } catch (error) {
        this.loadError = 'Quiz-Wetten konnten nicht geladen werden.'
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },

    buildPayload() {
      const professor = this.professors.find(
        (item) => item.id === this.selectedProfessorId
      )

      return {
        ...this.form,
        professor
      }
    },

    validateForm() {
      if (
        !this.form.thema ||
        !this.form.frage ||
        !this.form.antwortA ||
        !this.form.antwortB ||
        !this.form.antwortC ||
        !this.form.antwortD ||
        !this.form.korrekteAntwort ||
        !this.form.schwierigkeit ||
        !this.form.status ||
        !this.selectedProfessorId
      ) {
        return 'Bitte füllen Sie alle Pflichtfelder aus.'
      }

      if (!['A', 'B', 'C', 'D'].includes(this.form.korrekteAntwort)) {
        return 'Die korrekte Antwort muss A, B, C oder D sein.'
      }

      if (!this.form.zeitlimitSekunden || this.form.zeitlimitSekunden <= 0) {
        return 'Das Zeitlimit muss größer als 0 sein.'
      }

      if (!this.form.punkteBudget || this.form.punkteBudget <= 0) {
        return 'Das Punktebudget muss größer als 0 sein.'
      }

      return null
    },

    async saveQuizWette() {
      this.errorMessage = ''
      this.successMessage = ''

      const validationError = this.validateForm()
      if (validationError) {
        this.errorMessage = validationError
        return
      }

      try {
        const payload = this.buildPayload()

        if (this.editingQuizWetteId) {
          await quizWetteApi.update(this.editingQuizWetteId, payload)
          this.successMessage = 'Quiz-Wette wurde aktualisiert.'
        } else {
          await quizWetteApi.create(payload)
          this.successMessage = 'Quiz-Wette wurde erstellt.'
        }

        this.resetForm()
        await this.loadQuizWetten()
      } catch (error) {
        this.errorMessage = 'Quiz-Wette konnte nicht gespeichert werden.'
        console.error(error)
      }
    },

    startEditing(quizWette) {
      this.editingQuizWetteId = quizWette.id
      this.selectedProfessorId = quizWette.professor?.id || ''

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
        punkteBudget: quizWette.punkteBudget
      }

      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    async deleteQuizWette(quizWette) {
      const confirmed = window.confirm(
        `Soll die Quiz-Wette "${quizWette.frage}" wirklich gelöscht werden?`
      )

      if (!confirmed) {
        return
      }

      this.errorMessage = ''
      this.successMessage = ''

      try {
        await quizWetteApi.delete(quizWette.id)
        this.successMessage = 'Quiz-Wette wurde gelöscht.'
        await this.loadQuizWetten()
      } catch (error) {
        this.errorMessage =
          'Quiz-Wette konnte nicht gelöscht werden. Möglicherweise existieren bereits Teilnahmen.'
        console.error(error)
      }
    },

    resetForm() {
      this.editingQuizWetteId = null
      this.selectedProfessorId = ''

      this.form = {
        thema: '',
        frage: '',
        antwortA: '',
        antwortB: '',
        antwortC: '',
        antwortD: '',
        korrekteAntwort: '',
        schwierigkeit: '',
        status: 'ENTWURF',
        zeitlimitSekunden: 60,
        punkteBudget: 100
      }
    }
  }
}
</script>