<template>
  <main class="section">
    <div class="container">
      <article class="text-card">
        <h1>Dashboard wird geladen...</h1>
        <p>Deine Rolle wird geprüft und du wirst weitergeleitet.</p>

        <p v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>
      </article>
    </div>
  </main>
</template>

<script>
import { userApi } from '../services/api'

export default {
  data() {
    return {
      errorMessage: ''
    }
  },

  async mounted() {
    try {
      const profile = await userApi.getProfile()
      console.log('DashboardRedirect Profil:', profile)

      if (profile.role === 'ADMIN') {
        this.$router.replace('/admin')
        return
      }

      if (profile.role === 'PROFESSOR') {
        this.$router.replace('/professor-dashboard')
        return
      }

      if (profile.role === 'USER') {
        this.$router.replace('/student-dashboard')
        return
      }

      this.errorMessage = `Unbekannte Rolle: ${profile.role}`
    } catch (error) {
      this.errorMessage = 'Profil konnte nicht geladen werden.'
      console.error('DashboardRedirect Fehler:', error)
    }
  }
}
</script>