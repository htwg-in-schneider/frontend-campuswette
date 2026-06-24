<template>
  <main class="section">
    <div class="container narrow">
      <header class="page-header">
        <p class="eyebrow">Profil</p>
        <h1>Mein Profil</h1>
        <p class="section-intro">
          Dieses Profil wird über den Auth0-Login identifiziert und aus der
          CampusWette-Datenbank geladen.
        </p>
      </header>

      <p v-if="isLoading" class="section-intro">
        Profil wird geladen...
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
              <span class="meta-label">Adresse</span>
              <span class="meta-value">{{ profile.address }}</span>
            </div>

            <div class="meta-item">
              <span class="meta-label">Punktestand</span>
              <span class="meta-value">{{ profile.points }} Punkte</span>
            </div>
          </div>
        </article>

        <form class="form-card" @submit.prevent="saveProfile">
          <h2>Profildaten bearbeiten</h2>

          <label>
            Name
            <input v-model.trim="form.name" type="text" required />
          </label>

          <label>
            Adresse
            <input v-model.trim="form.address" type="text" required />
          </label>

          <p v-if="successMessage" class="success-message">
            {{ successMessage }}
          </p>

          <p v-if="formError" class="error-message">
            {{ formError }}
          </p>

          <button class="btn full-width" type="submit">
            Änderungen speichern
          </button>
        </form>
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
      errorMessage: '',
      formError: '',
      successMessage: '',
      form: {
        name: '',
        address: ''
      }
    }
  },

  async mounted() {
    await this.loadProfile()
  },

  methods: {
    async loadProfile() {
      this.isLoading = true
      this.errorMessage = ''
      this.formError = ''
      this.successMessage = ''

      try {
        this.profile = await userApi.getProfile()

        this.form = {
          name: this.profile.name,
          address: this.profile.address
        }
      } catch (error) {
        this.errorMessage =
          'Das Profil konnte nicht geladen werden. Prüfe, ob der Auth0-User in der Datenbank eine oauth_id hat.'
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },

    async saveProfile() {
      this.formError = ''
      this.successMessage = ''

      if (!this.form.name || !this.form.address) {
        this.formError = 'Bitte füllen Sie alle Pflichtfelder aus.'
        return
      }

      try {
        this.profile = await userApi.updateProfile({
          name: this.form.name,
          address: this.form.address
        })

        this.successMessage = 'Die Profildaten wurden gespeichert.'
      } catch (error) {
        this.formError = 'Die Profildaten konnten nicht gespeichert werden.'
        console.error(error)
      }
    }
  }
}
</script>