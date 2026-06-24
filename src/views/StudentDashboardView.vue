<template>
  <main class="container">
    <div class="dashboard">
      <h1>Mein Dashboard</h1>

      <!-- Tabs -->
      <div class="tab-navigation">
        <button
          :class="{ active: activeTab === 'history' }"
          @click="activeTab = 'history'"
          class="tab-button"
        >
          📊 Meine Wetten
        </button>
        <button
          :class="{ active: activeTab === 'leaderboard' }"
          @click="activeTab = 'leaderboard'"
          class="tab-button"
        >
          🏆 Leaderboard
        </button>
      </div>

      <!-- Partizipationshistorie -->
      <section v-if="activeTab === 'history'" class="tab-content">
        <h2>Meine Partizipationen</h2>

        <div v-if="isLoading" class="loading">
          Laden...
        </div>

        <div v-else-if="participations.length === 0" class="no-data">
          <p>Du hast noch an keinen Wetten teilgenommen.</p>
          <RouterLink to="/quizwetten" class="btn btn-primary">
            Zu den Quiz-Wetten
          </RouterLink>
        </div>

        <table v-else class="participation-table">
          <thead>
            <tr>
              <th class="date">Datum</th>
              <th class="theme">Thema</th>
              <th class="bet">Einsatz</th>
              <th class="status">Status</th>
              <th class="result">Resultat</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="participation in participations"
              :key="participation.id"
              :class="['participation-row', participation.richtig ? 'correct' : 'incorrect']"
            >
              <td class="date">{{ formatDate(participation.erstelltAm) }}</td>
              <td class="theme">
                <strong>{{ participation.quizWette.thema }}</strong>
                <p class="question">{{ participation.quizWette.frage }}</p>
              </td>
              <td class="bet">{{ participation.gesetztePunkte }} Pkt</td>
              <td class="status">
                <span :class="['badge', participation.richtig ? 'badge-success' : 'badge-danger']">
                  {{ participation.richtig ? '✓ Richtig' : '✗ Falsch' }}
                </span>
              </td>
              <td class="result">
                <span :class="['points', participation.punkteAenderung > 0 ? 'positive' : 'negative']">
                  {{ participation.punkteAenderung > 0 ? '+' : '' }}{{ participation.punkteAenderung }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Leaderboard -->
      <section v-if="activeTab === 'leaderboard'" class="tab-content">
        <h2>Studierenden Leaderboard</h2>

        <div v-if="leaderboardLoading" class="loading">
          Laden...
        </div>

        <div v-else-if="leaderboard.length === 0" class="no-data">
          <p>Noch keine Studierenden im Leaderboard.</p>
        </div>

        <table v-else class="leaderboard-table">
          <thead>
            <tr>
              <th class="rank">Rang</th>
              <th class="name">Name</th>
              <th class="email">Email</th>
              <th class="points">Punkte</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="entry in leaderboard"
              :key="entry.id"
              :class="{ 'is-current-user': isCurrentUser(entry.id) }"
            >
              <td class="rank">
                <span v-if="entry.rank <= 3" class="medal">
                  {{ entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉' }}
                </span>
                {{ entry.rank }}
              </td>
              <td class="name">{{ entry.name }}</td>
              <td class="email">{{ entry.email }}</td>
              <td class="points">
                <strong>{{ entry.points }}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { teilnahmeApi, userApi } from '../services/api'

const activeTab = ref('history')
const participations = ref([])
const leaderboard = ref([])
const isLoading = ref(false)
const leaderboardLoading = ref(false)
const currentUserId = ref(null)

onMounted(async () => {
  await loadMyProfile()
  await loadParticipations()
  await loadLeaderboard()
})

async function loadMyProfile() {
  try {
    const profile = await userApi.getProfile()
    currentUserId.value = profile.id
  } catch (error) {
    console.error('Profil konnte nicht geladen werden:', error)
  }
}

async function loadParticipations() {
  isLoading.value = true
  try {
    const data = await teilnahmeApi.getMine()
    participations.value = data || []
  } catch (error) {
    console.error('Partizipationen konnten nicht geladen werden:', error)
    participations.value = []
  } finally {
    isLoading.value = false
  }
}

async function loadLeaderboard() {
  leaderboardLoading.value = true
  try {
    const data = await userApi.getStudentLeaderboard(20)
    leaderboard.value = data || []
  } catch (error) {
    console.error('Leaderboard konnte nicht geladen werden:', error)
    leaderboard.value = []
  } finally {
    leaderboardLoading.value = false
  }
}

function isCurrentUser(userId) {
  return userId === currentUserId.value
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.dashboard {
  padding: 2rem 0;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 2rem;
  color: #333;
}

.tab-navigation {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e0e0e0;
}

.tab-button {
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #666;
  transition: all 0.3s ease;
}

.tab-button:hover {
  color: #333;
}

.tab-button.active {
  color: #ff6b35;
  border-bottom-color: #ff6b35;
}

.tab-content {
  padding: 2rem 0;
}

.tab-content h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #999;
}

.no-data {
  text-align: center;
  padding: 2rem;
  background: #f5f5f5;
  border-radius: 8px;
  color: #666;
}

.link-button {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #ff6b35;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  transition: background 0.3s ease;
}

.link-button:hover {
  background: #e55a25;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #ff6b35;
  color: white;
}

.btn-primary:hover {
  background: #e55a25;
}

/* Partizipationen Table */
.participation-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.participation-table thead {
  background: linear-gradient(135deg, #f5f5f5 0%, #efefef 100%);
  border-bottom: 2px solid #e0e0e0;
}

.participation-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.participation-table td {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
}

.participation-table tbody tr:last-child td {
  border-bottom: none;
}

.participation-table tbody tr:hover {
  background: #fafafa;
}

.participation-table tbody tr.correct {
  border-left: 4px solid #28a745;
}

.participation-table tbody tr.incorrect {
  border-left: 4px solid #dc3545;
}

.participation-row .date {
  width: 120px;
  color: #999;
  font-size: 0.9rem;
}

.participation-row .theme {
  flex: 1;
}

.participation-row .question {
  margin: 0.3rem 0 0 0;
  color: #666;
  font-size: 0.9rem;
  font-weight: normal;
}

.participation-row .bet {
  width: 100px;
  text-align: center;
  font-weight: 600;
}

.participation-row .status {
  width: 110px;
  text-align: center;
}

.participation-row .result {
  width: 100px;
  text-align: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

.badge-success {
  background: #d4edda;
  color: #155724;
}

.badge-danger {
  background: #f8d7da;
  color: #721c24;
}

.points {
  font-weight: 700;
}

.points.positive {
  color: #28a745;
}

.points.negative {
  color: #dc3545;
}

/* Leaderboard Table */
.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.leaderboard-table thead {
  background: linear-gradient(135deg, #ff6b35 0%, #ee5a35 100%);
}

.leaderboard-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: white;
  border-bottom: 2px solid #ff6b35;
}

.leaderboard-table td {
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}

.leaderboard-table tbody tr {
  transition: background-color 0.2s ease;
}

.leaderboard-table tbody tr:last-child td {
  border-bottom: none;
}

.leaderboard-table tbody tr:hover {
  background: #f5f5f5;
}

.leaderboard-table tbody tr.is-current-user {
  background: #fffacd;
  font-weight: 600;
  border-left: 4px solid #ff6b35;
}

.rank {
  width: 80px;
  text-align: center;
  font-weight: 600;
}

.name {
  min-width: 150px;
}

.email {
  min-width: 180px;
  color: #666;
  font-size: 0.9rem;
}

.points {
  text-align: center;
  font-weight: 600;
  color: #ff6b35;
}

.medal {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.name {
  width: 30%;
}

.email {
  color: #666;
  font-size: 0.9rem;
}

.points {
  text-align: right;
  width: 120px;
  font-size: 1.1rem;
  color: #ff6b35;
}

@media (max-width: 768px) {
  .participations-grid {
    grid-template-columns: 1fr;
  }

  .tab-navigation {
    flex-wrap: wrap;
  }

  .participation-table {
    font-size: 0.85rem;
  }

  .participation-table th,
  .participation-table td {
    padding: 0.65rem 0.5rem;
  }

  .participation-table th {
    font-size: 0.8rem;
  }

  .participation-row .date {
    width: 90px;
  }

  .participation-row .question {
    display: none;
  }

  .participation-row .theme {
    min-width: 150px;
  }

  .leaderboard-table {
    font-size: 0.9rem;
  }

  .leaderboard-table th,
  .leaderboard-table td {
    padding: 0.75rem 0.5rem;
  }

  .email {
    display: none;
  }
}
</style>
