<template>
  <main class="section">
    <div class="container">
      <header class="page-header">
        <p class="eyebrow">Dashboard</p>
        <h1>Willkommen zurück</h1>
        <p class="section-intro">
          Hier findest du deine wichtigsten Funktionen abhängig von deiner Rolle.
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
          <span class="status-badge">{{ profile.role }}</span>

          <div class="meta-grid">
            <div class="meta-item">
              <span class="meta-label">Name</span>
              <span class="meta-value">{{ profile.name }}</span>
            </div>

            <div class="meta-item">
              <span class="meta-label">E-Mail</span>
              <span class="meta-value">{{ profile.email }}</span>
            </div>

            <div class="meta-item">
              <span class="meta-label">Punktestand</span>
              <span class="meta-value">{{ profile.points }} Punkte</span>
            </div>

            <div class="meta-item">
              <span class="meta-label">Rolle</span>
              <span class="meta-value">{{ roleLabel }}</span>
            </div>
          </div>
        </article>

        <!-- Student Dashboard -->
        <section v-if="profile.role === 'USER'" class="cards dashboard-cards">
          <article class="card">
            <span class="status-badge">Profil</span>
            <h3>Profil verwalten</h3>
            <p>
              Bearbeite deine persönlichen Daten und prüfe deinen aktuellen Punktestand.
            </p>
            <RouterLink to="/profil" class="btn">
              Profil öffnen
            </RouterLink>
          </article>

          <article class="card">
            <span class="status-badge">Quiz</span>
            <h3>Quiz-Wetten spielen</h3>
            <p>
              Nimm an aktiven Quiz-Wetten teil und sammle Punkte bei richtigen Antworten.
            </p>
            <RouterLink to="/quizwetten" class="btn">
              Quiz-Wetten öffnen
            </RouterLink>
          </article>

          <article class="card">
            <span class="status-badge">ECTS</span>
            <h3>ECTS-Antrag stellen</h3>
            <p>
              Beantrage Punkte für absolvierte Module über das ECTS-Antragssystem.
            </p>
            <RouterLink to="/ects-antrag" class="btn">
              Antrag stellen
            </RouterLink>
          </article>

          <article class="card">
            <span class="status-badge">Historie</span>
            <h3>Meine Teilnahmen</h3>
            <p>
              Sieh dir deine bisherigen Quiz-Teilnahmen und Punkteänderungen an.
            </p>
            <RouterLink to="/meine-teilnahmen" class="btn">
              Historie öffnen
            </RouterLink>
          </article>
        </section>

        <!-- Professor Dashboard -->
        <section v-else-if="profile.role === 'PROFESSOR'" class="cards dashboard-cards">
          <article class="card">
            <span class="status-badge">Quiz</span>
            <h3>Quiz-Wetten verwalten</h3>
            <p>
              Erstelle neue Quiz-Wetten, bearbeite bestehende Inhalte und verwalte dein Budget.
            </p>
            <RouterLink to="/quizwetten-verwalten" class="btn">
              Quiz verwalten
            </RouterLink>
          </article>

          <article class="card">
            <span class="status-badge">Profil</span>
            <h3>Profil ansehen</h3>
            <p>
              Prüfe dein Profil, deine Rolle und deinen aktuellen Punktestand.
            </p>
            <RouterLink to="/profil" class="btn">
              Profil öffnen
            </RouterLink>
          </article>

          <article class="card">
            <span class="status-badge">Öffentlich</span>
            <h3>Quiz-Wetten ansehen</h3>
            <p>
              Kontrolliere, wie deine Quiz-Wetten im öffentlichen Bereich angezeigt werden.
            </p>
            <RouterLink to="/quizwetten" class="btn secondary">
              Öffentliche Ansicht
            </RouterLink>
          </article>
        </section>

        <!-- Admin Dashboard -->
        <section v-else-if="profile.role === 'ADMIN'" class="cards dashboard-cards">
          <article class="card">
            <span class="status-badge">Admin</span>
            <h3>Admin-Bereich</h3>
            <p>
              Öffne die zentrale Verwaltung für Nutzer:innen, Professor:innen und Transaktionen.
            </p>
            <RouterLink to="/admin" class="btn">
              Admin öffnen
            </RouterLink>
          </article>

          <article class="card">
            <span class="status-badge">ECTS</span>
            <h3>ECTS-Anträge prüfen</h3>
            <p>
              Genehmige oder lehne offene ECTS-Anträge ab und schreibe Punkte gut.
            </p>
            <RouterLink to="/admin/ects-antraege" class="btn">
              Anträge öffnen
            </RouterLink>
          </article>

          <article class="card">
            <span class="status-badge">Quiz</span>
            <h3>Quiz-Wetten verwalten</h3>
            <p>
              Erstelle, bearbeite oder lösche Quiz-Wetten als Administrator.
            </p>
            <RouterLink to="/quizwetten-verwalten" class="btn">
              Quiz verwalten
            </RouterLink>
          </article>
        </section>

        <article v-else class="text-card">
          <h2>Unbekannte Rolle</h2>
          <p>
            Für deine Rolle wurde noch kein Dashboard definiert.
          </p>
        </article>
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

  computed: {
    roleLabel() {
      if (!this.profile) {
        return ''
      }

      if (this.profile.role === 'USER') {
        return 'Student'
      }

      if (this.profile.role === 'PROFESSOR') {
        return 'Professor / Dozent'
      }

      if (this.profile.role === 'ADMIN') {
        return 'Administrator'
      }

      return this.profile.role
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
      } catch (error) {
        this.errorMessage =
          'Das Dashboard konnte nicht geladen werden. Bitte melde dich erneut an.'
        console.error(error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>