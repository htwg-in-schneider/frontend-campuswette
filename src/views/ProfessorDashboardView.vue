<template>
  <main class="section">
    <div class="container">
      <header class="page-header">
        <p class="eyebrow">Mein Dashboard</p>
        <h1>Professor:innen Dashboard</h1>
        <p class="section-intro">
          Übersicht über deine Quiz-Aktivitäten und Statistiken.
        </p>
      </header>

      <!-- Stats Cards -->
      <div v-if="!statsLoading && stats" class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ stats.quizCount }}</div>
          <div class="stat-label">Erstelle Quiz</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.totalParticipants }}</div>
          <div class="stat-label">Gesamt Teilnahmen</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.totalPointsDistributed }}</div>
          <div class="stat-label">Punkte Verteilt</div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="cards">
        <article class="card">
          <span class="status-badge">Erstellen</span>
          <h3>Neues Quiz erstellen</h3>
          <p>
            Neue Quiz-Wette erstellen und Punkte-Budget festlegen.
          </p>
          <RouterLink to="/quizwetten-verwalten" class="btn">
            Quiz verwalten
          </RouterLink>
        </article>

        <article class="card">
          <span class="status-badge">Übersicht</span>
          <h3>Alle Quiz anzeigen</h3>
          <p>
            Übersicht aller erstellten Quiz und deren Status.
          </p>
          <RouterLink to="/quizwetten" class="btn">
            Quiz-Katalog
          </RouterLink>
        </article>
      </div>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </main>
</template>

<script>
import { professorApi } from '../services/api'
import { useAuth0 } from '@auth0/auth0-vue'

export default {
  name: 'ProfessorDashboardView',

  data() {
    return {
      stats: null,
      statsLoading: false,
      errorMessage: '',
      professorId: null
    }
  },

  setup() {
    const { user } = useAuth0()
    return { user }
  },

  async mounted() {
    // TODO: Get profesor ID from user profile or database lookup
    // For now, show a message that this needs to be implemented
    this.errorMessage = 'Professor:innen Dashboard wird noch optimiert. Bitte nutze vorerst die Quiz-Verwaltung.'
  }
}
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.2s ease;
}

.card:hover {
  border-color: var(--primary);
  background: var(--surface-light);
}

.status-badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  background: var(--primary-soft);
  color: var(--primary);
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  width: fit-content;
}

.card h3 {
  margin: 0;
  color: var(--text);
  font-size: 1.2rem;
}

.card p {
  margin: 0;
  color: var(--muted);
  font-size: 0.9rem;
  flex: 1;
}

.btn {
  padding: 0.75rem 1.5rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  transition: all 0.2s ease;
}

.btn:hover {
  background: #e56f1f;
  transform: translateY(-2px);
}

.error-message {
  color: #ff6b6b;
  padding: 1rem;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 4px;
}
</style>
