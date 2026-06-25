<template>
  <main class="section">
    <div class="container">
      <header class="page-header">
        <p class="eyebrow">Student Dashboard</p>
        <h1>Dein CampusWette-Bereich</h1>
        <p class="section-intro">
          Hier findest du deine Quiz-Teilnahmen, deinen Punktestand und deine ECTS-Anträge.
        </p>
      </header>

      <p v-if="isLoading" class="section-intro">
        Dashboard wird geladen...
      </p>

      <p v-else-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <template v-else-if="profile">
        <article class="text-card">
          <span class="status-badge">Student</span>
          <h2>Hallo, {{ profile.name }}</h2>
          <p>
            Dein aktueller Punktestand beträgt
            <strong>{{ profile.points }} Punkte</strong>.
          </p>
        </article>

        <section class="cards dashboard-cards">
          <article class="card">
            <span class="status-badge">Profil</span>
            <h3>Profil verwalten</h3>
            <p>Bearbeite deine persönlichen Daten und prüfe deine Accountdaten.</p>
            <RouterLink to="/profil" class="btn">
              Profil öffnen
            </RouterLink>
          </article>

          <article class="card">
            <span class="status-badge">Quiz</span>
            <h3>Quiz-Wetten spielen</h3>
            <p>Nimm an aktiven Quiz-Wetten teil und sammle Punkte.</p>
            <RouterLink to="/quizwetten" class="btn">
              Quiz-Wetten öffnen
            </RouterLink>
          </article>

          <article class="card">
            <span class="status-badge">ECTS</span>
            <h3>ECTS-Antrag stellen</h3>
            <p>Beantrage Punkte für absolvierte Module.</p>
            <RouterLink to="/ects-antrag" class="btn">
              Antrag stellen
            </RouterLink>
          </article>

          <article class="card">
            <span class="status-badge">Historie</span>
            <h3>Meine Historie</h3>
            <p>Sieh dir deine bisherigen Quiz-Teilnahmen an.</p>
            <RouterLink to="/meine-teilnahmen" class="btn">
              Historie öffnen
            </RouterLink>
          </article>
        </section>
      </template>
    </div>
  </main>
</template>

<script>
import { userApi } from '../services/api'

export default {
  data() {
    return {
      profile: null,
      isLoading: false,
      errorMessage: ''
    }
  },

  async mounted() {
    await this.loadProfile()
  },

  methods: {
    async loadProfile() {
      this.isLoading = true
      this.errorMessage = ''

      try {
        this.profile = await userApi.getProfile()

        if (this.profile.role !== 'USER') {
          this.$router.replace('/dashboard')
        }
      } catch (error) {
        this.errorMessage = 'Das Student-Dashboard konnte nicht geladen werden.'
        console.error(error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>