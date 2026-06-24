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
          <RouterLink to="/quizwetten" class="link-button">
            Zu den Quiz-Wetten
          </RouterLink>
        </div>

        <div v-else class="participations-grid">
          <div
            v-for="participation in participations"
            :key="participation.id"
            class="participation-card"
          >
            <div class="card-header">
              <h3>{{ participation.quizWette.thema }}</h3>
              <span :class="['result-badge', participation.richtig ? 'correct' : 'incorrect']">
                {{ participation.richtig ? '✓ Richtig' : '✗ Falsch' }}
              </span>
            </div>

            <div class="card-body">
              <p><strong>Frage:</strong> {{ participation.quizWette.frage }}</p>
              <p>
                <strong>Deine Antwort:</strong>
                <span :class="['answer-text', participation.richtig ? 'correct' : 'incorrect']">
                  {{ participation.gewaehlteAntwort }}
                </span>
              </p>
              <p><strong>Einsatz:</strong> {{ participation.gesetztePunkte }} Pkt</p>
              <p>
                <strong>Resultat:</strong>
                <span :class="['points-change', participation.punkteAenderung > 0 ? 'positive' : 'negative']">
                  {{ participation.punkteAenderung > 0 ? '+' : '' }}{{ participation.punkteAenderung }} Pkt
                </span>
              </p>
              <p class="date">{{ formatDate(participation.erstelltAm) }}</p>
            </div>
          </div>
        </div>
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

/* Partizipationen Grid */
.participations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.participation-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.participation-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 1rem;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
  flex: 1;
}

.result-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  margin-left: 1rem;
}

.result-badge.correct {
  background: #d4edda;
  color: #155724;
}

.result-badge.incorrect {
  background: #f8d7da;
  color: #721c24;
}

.card-body {
  padding: 1rem;
  font-size: 0.95rem;
}

.card-body p {
  margin: 0.5rem 0;
  line-height: 1.5;
}

.answer-text {
  font-weight: 600;
}

.answer-text.correct {
  color: #28a745;
}

.answer-text.incorrect {
  color: #dc3545;
}

.points-change {
  font-weight: 700;
  font-size: 1.1rem;
}

.points-change.positive {
  color: #28a745;
}

.points-change.negative {
  color: #dc3545;
}

.date {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e0e0e0;
  color: #999;
  font-size: 0.85rem;
}

/* Leaderboard Table */
.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.leaderboard-table thead {
  background: #f5f5f5;
}

.leaderboard-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
}

.leaderboard-table td {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.leaderboard-table tbody tr:last-child td {
  border-bottom: none;
}

.leaderboard-table tbody tr:hover {
  background: #f9f9f9;
}

.leaderboard-table tbody tr.is-current-user {
  background: #fffacd;
  font-weight: 600;
}

.rank {
  width: 80px;
  text-align: center;
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
