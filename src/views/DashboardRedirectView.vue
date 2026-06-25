<template>
  <main class="section">
    <div class="container">
      <article class="text-card">
        <h1>Dashboard wird geladen...</h1>
        <p>Deine Rolle wird geprüft und du wirst weitergeleitet.</p>
      </article>
    </div>
  </main>
</template>

<script>
import { userApi } from '../services/api'

export default {
  async mounted() {
    try {
      const profile = await userApi.getProfile()

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

      this.$router.replace('/profil')
    } catch (error) {
      console.error('Dashboard-Weiterleitung fehlgeschlagen:', error)
      this.$router.replace('/profil')
    }
  }
}
</script>