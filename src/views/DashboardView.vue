<template>
  <main class="section">
    <div class="container">
      <header class="page-header">
        <p class="eyebrow">Dashboard</p>
        <h1>Dashboard</h1>
        <p class="section-intro">
          Diese Seite zeigt deine verfügbaren Funktionen abhängig von deiner Rolle.
        </p>
      </header>

      <article v-if="isLoading" class="text-card">
        <h2>Dashboard wird geladen...</h2>
        <p>Dein Profil wird aus der Datenbank geladen.</p>
      </article>

      <article v-else-if="errorMessage" class="text-card">
        <span class="status-badge danger">Fehler</span>
        <h2>Dashboard konnte nicht geladen werden</h2>
        <p>{{ errorMessage }}</p>

        <RouterLink to="/profil" class="btn">
          Profil öffnen
        </RouterLink>
      </article>

      <template v-else-if="profile">
        <article class="text-card">
          <span class="status-badge">{{ profile.role }}</span>
          <h2>Hallo, {{ profile.name }}</h2>
          <p>
            Du bist als <strong>{{ roleLabel }}</strong> angemeldet.
            Dein aktueller Punktestand beträgt <strong>{{ profile.points }} Punkte</strong>.
          </p>
        </article>

        <!-- Student -->
        <section v-if="profile.role === 'USER'" class="cards dashboard-cards">
          <article class="card">
            <span class="status-badge">Profil</span>
            <h3>Profil verwalten</h3>
            <p>Bearbeite deine persönlichen Daten und prüfe deinen Punktestand.</p>
            <RouterLink to="/profil" class="btn">Profil öffnen</RouterLink>
          </article>

          <article class="card">
            <span class="status-badge">Quiz</span>
            <h3>Quiz-Wetten spielen</h3>
            <p>Nimm an aktiven Quiz-Wetten teil und sammle Punkte.</p>
            <RouterLink to="/quizwetten" class="btn">Quiz-Wetten öffnen</RouterLink>
          </article>

          <article class="card">
            <span class="status-badge">ECTS</span>
            <h3>ECTS-Antrag stellen</h3>
            <p>Beantrage Punkte für absolvierte Module.</p>
            <RouterLink to="/ects-antrag" class="btn">Antrag stellen</RouterLink>
          </article>

          <article class="card">
            <span class="status-badge">Historie</span>
            <h3>Meine Teilnahmen</h3>
            <p>Sieh dir deine bisherigen Quiz-Teilnahmen an.</p>
            <RouterLink to="/meine-teilnahmen" class="btn">Historie öffnen</RouterLink>
          </article>
        </section>

        <!-- Professor -->
        <section v-else-if="profile.role === 'PROFESSOR'" class="cards dashboard-cards">
          <article class="card">
            <span class="status-badge">Quiz</span>
            <h3>Quiz-Wetten verwalten</h3>
            <p>Erstelle und bearbeite Quiz-Wetten für Studierende.</p>
            <RouterLink to="/quizwetten-verwalten" class="btn">Quiz verwalten</RouterLink>
          </article>

          <article class="card">
            <span class="status-badge">Profil</span>
            <h3>Profil ansehen</h3>
            <p>Prüfe deine Profildaten und dein Budget.</p>
            <RouterLink to="/profil" class="btn">Profil öffnen</RouterLink>
          </article>
        </section>

        <!-- Admin -->
        <section v-else-if="profile.role === 'ADMIN'" class="cards dashboard-cards">
          <article class="card">
            <span class="status-badge">Admin</span>
            <h3>Admin-Bereich</h3>
            <p>Verwalte Benutzer:innen, Professor:innen und Teilnahmen.</p>
            <RouterLink to="/admin" class="btn">Admin öffnen</RouterLink>
          </article>

          <article class="card">
            <span class="status-badge">ECTS</span>
            <h3>ECTS-Anträge prüfen</h3>
            <p>Genehmige oder lehne offene ECTS-Anträge ab.</p>
            <RouterLink to="/admin/ects-antraege" class="btn">Anträge öffnen</RouterLink>
          </article>

          <article class="card">
            <span class="status-badge">Quiz</span>
            <h3>Quiz-Wetten verwalten</h3>
            <p>Erstelle, bearbeite oder lösche Quiz-Wetten.</p>
            <RouterLink to="/quizwetten-verwalten" class="btn">Quiz verwalten</RouterLink>
          </article>
        </section>

        <article v-else class="text-card">
          <h2>Unbekannte Rolle</h2>
          <p>
            Deine Rolle <strong>{{ profile.role }}</strong> ist im Dashboard noch nicht definiert.
          </p>
        </article>
      </template>

      <article v-else class="text-card">
        <span class="status-badge danger">Kein Profil</span>
        <h2>Kein Profil geladen</h2>
        <p>
          Du bist möglicherweise nicht korrekt angemeldet oder deine Auth0-ID ist nicht
          mit einem Benutzer in der Datenbank verknüpft.
        </p>

        <RouterLink to="/profil" class="btn">
          Profil prüfen
        </RouterLink>
      </article>
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
        console.log('Dashboard-Profil:', this.profile)
      } catch (error) {
        this.errorMessage =
          'Das Profil konnte nicht geladen werden. Prüfe Login, Token und oauth_id in der Datenbank.'
        console.error('Dashboard-Fehler:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>