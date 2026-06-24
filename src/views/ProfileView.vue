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

        <article class="info-card">
          <h3>🔒 Passwort ändern</h3>
          <p>
            Dein Passwort wird über dein Auth0-Account verwaltet. Um dein Passwort zu ändern,
            melde dich in deinem Auth0-Profil an.
          </p>
          <button class="btn secondary" @click="openAuth0Settings">
            Auth0-Einstellungen öffnen
          </button>
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
    },

    openAuth0Settings() {
      // Auth0 Account Settings URL
      window.open('https://manage.auth0.com/', '_blank')
    }
  }
}
</script>

<style scoped>
.narrow {
  max-width: 600px;
}

.text-card,
.form-card,
.info-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 2rem;
  margin-bottom: 2rem;
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
  margin-bottom: 1rem;
}

.meta-grid {
  display: grid;
  gap: 1.5rem;
  margin-top: 1rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meta-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--muted);
  font-weight: 600;
  letter-spacing: 0.05em;
}

.meta-value {
  font-size: 1.1rem;
  color: var(--text);
  font-weight: 500;
}

.form-card h2,
.info-card h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--text);
}

.form-card label {
  display: block;
  margin-bottom: 1.5rem;
  font-weight: 500;
  color: var(--text);
}

.form-card input {
  display: block;
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-family: inherit;
  font-size: 1rem;
  color: var(--text);
  background: var(--background);
  transition: all 0.2s ease;
}

.form-card input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-soft);
}

.btn {
  padding: 0.75rem 1.5rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn:hover {
  background: #e56f1f;
  transform: translateY(-2px);
}

.btn.full-width {
  display: block;
  width: 100%;
}

.btn.secondary {
  background: var(--surface-light);
  color: var(--primary);
  border: 2px solid var(--primary);
}

.btn.secondary:hover {
  background: var(--primary-soft);
}

.success-message {
  color: #2ecc71;
  background: rgba(46, 204, 113, 0.1);
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
  border-left: 4px solid #2ecc71;
}

.error-message {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
  border-left: 4px solid #ff6b6b;
}

.info-card {
  background: var(--primary-soft);
  border: 1px solid var(--primary);
}

.info-card h3 {
  color: var(--primary);
  margin-top: 0;
}

.info-card p {
  color: var(--text);
  margin-bottom: 1rem;
}
</style>