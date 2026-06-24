<template>
  <main class="section">
    <div class="container">
      <RouterLink to="/admin" class="back-link">
        ← Zurück zum Admin-Bereich
      </RouterLink>

      <header class="page-header">
        <p class="eyebrow">Stammdaten</p>
        <h1>Professor:innen verwalten</h1>
        <p class="section-intro">
          Hier können Administrator:innen Professor:innen als Stammdaten der
          Anwendung anzeigen, suchen, erfassen, bearbeiten und löschen.
        </p>
      </header>

      <section class="form-card">
        <h2>{{ editingProfessorId ? 'Professor:in bearbeiten' : 'Professor:in erfassen' }}</h2>

        <form class="admin-form" @submit.prevent="saveProfessor">
          <label>
            Name
            <input
              v-model.trim="form.name"
              type="text"
              required
              placeholder="z. B. Prof. Dr. Müller"
            />
          </label>

          <label>
            E-Mail
            <input
              v-model.trim="form.email"
              type="email"
              required
              placeholder="mueller@example.com"
            />
          </label>

          <label>
            Fachbereich
            <input
              v-model.trim="form.department"
              type="text"
              required
              placeholder="z. B. Wirtschaftsinformatik"
            />
          </label>

          <p v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </p>

          <p v-if="successMessage" class="success-message">
            {{ successMessage }}
          </p>

          <div class="admin-actions">
            <button class="btn" type="submit">
              {{ editingProfessorId ? 'Änderungen speichern' : 'Professor:in anlegen' }}
            </button>

            <button
              v-if="editingProfessorId"
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
            placeholder="Nach Name, E-Mail oder Fachbereich suchen"
          />
        </label>
      </section>

      <p v-if="isLoading" class="section-intro">
        Professor:innen werden geladen...
      </p>

      <p v-else-if="loadError" class="error-message">
        {{ loadError }}
      </p>

      <section v-else>
        <p class="section-intro">
          Angezeigt: {{ filteredProfessors.length }} von {{ professors.length }}
          Professor:innen
        </p>

        <div v-if="filteredProfessors.length > 0" class="admin-table-card">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>E-Mail</th>
                <th>Fachbereich</th>
                <th>Aktionen</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="professor in filteredProfessors" :key="professor.id">
                <td>{{ professor.name }}</td>
                <td>{{ professor.email }}</td>
                <td>{{ professor.department }}</td>
                <td>
                  <div class="table-actions">
                    <button
                      class="small-button"
                      type="button"
                      @click="startEditing(professor)"
                    >
                      Bearbeiten
                    </button>

                    <button
                      class="small-button danger"
                      type="button"
                      @click="deleteProfessor(professor)"
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
          <h2>Keine Professor:innen gefunden</h2>
          <p>
            Passe die Suche an oder lege neue Stammdaten über das Formular an.
          </p>
        </article>
      </section>
    </div>
  </main>
</template>

<script>
import { professorApi } from '../services/api'

export default {
  data() {
    return {
      professors: [],
      searchTerm: '',
      isLoading: false,
      loadError: '',
      errorMessage: '',
      successMessage: '',
      editingProfessorId: null,
      form: {
        name: '',
        email: '',
        department: ''
      }
    }
  },

  computed: {
    filteredProfessors() {
      const search = this.searchTerm.toLowerCase()

      return this.professors.filter((professor) => {
        return (
          !search ||
          professor.name?.toLowerCase().includes(search) ||
          professor.email?.toLowerCase().includes(search) ||
          professor.department?.toLowerCase().includes(search)
        )
      })
    }
  },

  async mounted() {
    await this.loadProfessors()
  },

  methods: {
    async loadProfessors() {
      this.isLoading = true
      this.loadError = ''

      try {
        this.professors = await professorApi.getAll()
      } catch (error) {
        this.loadError = 'Die Professor:innen konnten nicht geladen werden.'
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },

    async saveProfessor() {
      this.errorMessage = ''
      this.successMessage = ''

      if (!this.form.name || !this.form.email || !this.form.department) {
        this.errorMessage = 'Bitte füllen Sie alle Pflichtfelder aus.'
        return
      }

      try {
        if (this.editingProfessorId) {
          await professorApi.update(this.editingProfessorId, this.form)
          this.successMessage = 'Professor:in wurde aktualisiert.'
        } else {
          await professorApi.create(this.form)
          this.successMessage = 'Professor:in wurde angelegt.'
        }

        this.resetForm()
        await this.loadProfessors()
      } catch (error) {
        this.errorMessage = 'Die Professor:in konnte nicht gespeichert werden.'
        console.error(error)
      }
    },

    startEditing(professor) {
      this.editingProfessorId = professor.id
      this.form = {
        name: professor.name,
        email: professor.email,
        department: professor.department
      }

      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    async deleteProfessor(professor) {
      const confirmed = window.confirm(
        `Soll ${professor.name} wirklich gelöscht werden?`
      )

      if (!confirmed) {
        return
      }

      this.errorMessage = ''
      this.successMessage = ''

      try {
        await professorApi.delete(professor.id)
        this.successMessage = 'Professor:in wurde gelöscht.'
        await this.loadProfessors()
      } catch (error) {
        this.errorMessage =
          'Die Professor:in konnte nicht gelöscht werden. Möglicherweise sind noch Quiz-Wetten zugeordnet.'
        console.error(error)
      }
    },

    resetForm() {
      this.editingProfessorId = null
      this.form = {
        name: '',
        email: '',
        department: ''
      }
    }
  }
}
</script>