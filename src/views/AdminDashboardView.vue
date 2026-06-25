<template>
  <main class="section">
    <div class="container">
      <header class="page-header">
        <p class="eyebrow">Admin-Bereich</p>
        <h1>Dashboard & Verwaltung</h1>
        <p class="section-intro">
          Überblick über alle wichtigen Metriken und Verwaltungsfunktionen.
        </p>
      </header>

      <!-- Stats Cards -->
      <div v-if="!statsLoading" class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ stats.totalUsers }}</div>
          <div class="stat-label">Gesamt Nutzer</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.totalActiveQuizzes }}</div>
          <div class="stat-label">Aktive Quiz</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.pendingEctsRequests }}</div>
          <div class="stat-label">Offene ECTS-Anträge</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.averagePoints }}</div>
          <div class="stat-label">Ø Punkte pro Nutzer</div>
        </div>
      </div>

      <!-- Management Cards -->
      <div class="cards">
        <article class="card">
          <span class="status-badge">Benutzer</span>
          <h3>Benutzer:innen verwalten</h3>
          <p>
            Admins können vorbereitete Nutzerkonten anzeigen und Profildaten
            bearbeiten.
          </p>
          <RouterLink to="/admin/users" class="btn">
            Benutzer öffnen
          </RouterLink>
        </article>

        <article class="card">
          <span class="status-badge">Stammdaten</span>
          <h3>Professor:innen verwalten</h3>
          <p>
            Professor:innen anzeigen, suchen, erfassen, bearbeiten und löschen.
          </p>
          <RouterLink to="/admin/professoren" class="btn">
            Professor:innen öffnen
          </RouterLink>
        </article>

        <article class="card">
          <span class="status-badge">Transaktionen</span>
          <h3>Teilnahmen nachvollziehen</h3>
          <p>
            Admins können sehen, welche Benutzer:innen an welchen Quiz-Wetten
            teilgenommen haben und wie sich Punkte verändert haben.
          </p>
          <RouterLink to="/admin/teilnahmen" class="btn">
            Teilnahmen öffnen
          </RouterLink>
        </article>

        <article class="card">
          <span class="status-badge">Punkte</span>
          <h3>ECTS-Anträge verwalten</h3>
          <p>
            ECTS-Umwandlungsanträge von Studierenden genehmigen oder ablehnen
            und Punkte verteilen.
          </p>
          <RouterLink to="/admin/ects-antraege" class="btn">
            ECTS-Anträge öffnen
          </RouterLink>
        </article>
      </div>

      <!-- Leaderboard -->
      <div class="form-card">
        <h2>🏆 Leaderboard</h2>

        <div v-if="leaderboardLoading" class="loading">Wird geladen...</div>

        <div v-else-if="leaderboard.length === 0" class="empty-state">
          <p>Noch keine Nutzer mit Punkten.</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Rang</th>
                <th>Name</th>
                <th>E-Mail</th>
                <th>Punkte</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in leaderboard" :key="user.userId">
                <td class="rank">
                  <span v-if="user.rank === 1" class="medal">🥇</span>
                  <span v-else-if="user.rank === 2" class="medal">🥈</span>
                  <span v-else-if="user.rank === 3" class="medal">🥉</span>
                  <span v-else>{{ user.rank }}.</span>
                </td>
                <td>
                  <strong>{{ user.userName }}</strong>
                </td>
                <td>{{ user.userEmail }}</td>
                <td class="points">{{ user.points }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </main>
</template>

<script>
import { userApi } from "../services/api";

export default {
  name: "AdminDashboardView",

  data() {
    return {
      stats: {
        totalUsers: 0,
        totalActiveQuizzes: 0,
        pendingEctsRequests: 0,
        averagePoints: 0,
        totalPointsDistributed: 0,
      },
      leaderboard: [],
      statsLoading: false,
      leaderboardLoading: false,
      errorMessage: "",
    };
  },

  async mounted() {
    await Promise.all([this.loadStats(), this.loadLeaderboard()]);
  },

  methods: {
    async loadStats() {
      this.statsLoading = true;
      this.errorMessage = "";

      try {
        this.stats = await userApi.getStats();
      } catch (error) {
        this.errorMessage = `Stats konnten nicht geladen werden: ${error.message}`;
        console.error(error);
      } finally {
        this.statsLoading = false;
      }
    },

    async loadLeaderboard() {
      this.leaderboardLoading = true;

      try {
        this.leaderboard = await userApi.getLeaderboard(10);
      } catch (error) {
        console.error("Leaderboard konnte nicht geladen werden:", error);
      } finally {
        this.leaderboardLoading = false;
      }
    },
  },
};
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

.form-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 2rem;
  margin-bottom: 2rem;
}

.form-card h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--text);
}

.table-responsive {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table thead {
  background: var(--surface-light);
  border-bottom: 2px solid var(--border);
}

.table th,
.table td {
  padding: 1rem;
  text-align: left;
  color: var(--text);
}

.table tbody tr {
  border-bottom: 1px solid var(--border);
  transition: background 0.2s ease;
}

.table tbody tr:hover {
  background: var(--surface-light);
}

.rank {
  font-weight: 600;
  width: 60px;
}

.medal {
  font-size: 1.2rem;
}

.points {
  font-weight: 600;
  color: var(--primary);
}

.error-message {
  color: #ff6b6b;
  padding: 1rem;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 4px;
}

.empty-state,
.loading {
  text-align: center;
  padding: 2rem;
  color: var(--muted);
}
</style>
