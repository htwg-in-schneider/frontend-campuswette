<template>
  <header class="site-header">
    <div class="container nav">
      <RouterLink to="/" class="logo">
        <img src="/Logo.jpeg" alt="CampusWette Logo" class="logo-img" />
      </RouterLink>

      <nav>
        <RouterLink to="/">Start</RouterLink>
        <RouterLink to="/quizwetten">Quiz-Wetten</RouterLink>
        <RouterLink to="/kontakt">Kontakt</RouterLink>

        <RouterLink v-if="isAuthenticated" to="/profil">
          Profil
        </RouterLink>

        <RouterLink v-if="isAuthenticated && profileData?.role !== 'PROFESSOR'" to="/ects-antraege">
          ECTS
        </RouterLink>

        <span v-if="isAuthenticated" class="ects-badge" :title="`${ectsCount} ECTS Punkte genehmigt`">
          📚 {{ ectsPoints }} Pkt
        </span>

        <RouterLink
          v-if="profileData?.role === 'ADMIN' || profileData?.role === 'PROFESSOR'"
          to="/quizwetten-verwalten"
        >
          Quiz verwalten
        </RouterLink>

        <RouterLink v-if="profileData?.role === 'ADMIN'" to="/admin">
          Admin
        </RouterLink>

        <button
          v-if="!isAuthenticated"
          class="nav-button"
          type="button"
          @click="handleLogin"
        >
          Login
        </button>

        <button
          v-else
          class="nav-button"
          type="button"
          @click="handleLogout"
        >
          Logout
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { userApi } from '../services/api'

const {
  loginWithRedirect,
  logout,
  isAuthenticated,
  getAccessTokenSilently
} = useAuth0()

const profileData = ref(null)
const ectsPoints = ref(0)
const ectsCount = ref(0)

watch(
  isAuthenticated,
  async (loggedIn) => {
    if (loggedIn) {
      await loadProfile()
      await loadEctsPoints()
    } else {
      profileData.value = null
      ectsPoints.value = 0
      ectsCount.value = 0
    }
  },
  { immediate: true }
)

async function handleLogin() {
  try {
    await loginWithRedirect()
  } catch (error) {
    console.error('Login fehlgeschlagen:', error)
  }
}

async function loadProfile() {
  try {
    const token = await getAccessTokenSilently()

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (response.ok) {
      profileData.value = await response.json()
    }
  } catch (error) {
    console.error('Profil konnte nicht geladen werden.', error)
  }
}

async function loadEctsPoints() {
  try {
    const data = await userApi.getEctsPoints()
    ectsPoints.value = data.ectsPoints || 0
    ectsCount.value = data.ectsCount || 0
  } catch (error) {
    console.error('ECTS-Punkte konnten nicht geladen werden.', error)
  }
}

function handleLogout() {
  logout({
    logoutParams: {
      returnTo: window.location.origin + import.meta.env.BASE_URL
    }
  })
}
</script>

<style scoped>
.ects-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 165, 0, 0.1);
  color: #ff9800;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
}
</style>