<template>
  <main class="section">
    <div class="container">
      <RouterLink to="/student-dashboard" class="back-link">
        ← Zurück zum Dashboard
      </RouterLink>

      <header class="page-header">
        <p class="eyebrow">Historie</p>
        <h1>Meine Quiz-Historie</h1>
        <p class="section-intro">
          Hier siehst du deine bisherigen Quiz-Teilnahmen und Punkteänderungen.
        </p>
      </header>

      <p v-if="isLoading" class="section-intro">
        Historie wird geladen...
      </p>

      <p v-else-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <article v-else-if="teilnahmen.length === 0" class="text-card">
        <h2>Noch keine Teilnahmen</h2>
        <p>
          Du hast bisher noch an keiner Quiz-Wette teilgenommen.
        </p>

        <RouterLink to="/quizwetten" class="btn">
          Quiz-Wetten öffnen
        </RouterLink>
      </article>

      <section v-else>
        <p class="section-intro">
          Insgesamt {{ teilnahmen.length }} gespeicherte Teilnahmen.
        </p>

        <div class="admin-table-card">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Zeitpunkt</th>
                <th>Thema</th>
                <th>Frage</th>
                <th>Antwort</th>
                <th>Ergebnis</th>
                <th>Punkte</th>
                <th>Neuer Stand</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="teilnahme in teilnahmen" :key="teilnahme.id">
                <td>{{ formatDate(teilnahme.erstelltAm) }}</td>
                <td>{{ teilnahme.quizThema }}</td>
                <td>{{ teilnahme.quizFrage }}</td>
                <td>{{ teilnahme.gewaehlteAntwort }}</td>
                <td>
                  <span
                    class="status-badge"
                    :class="{ success: teilnahme.richtig, danger: !teilnahme.richtig }"
                  >
                    {{ teilnahme.richtig ? 'Richtig' : 'Falsch' }}
                  </span>
                </td>
                <td>
                  <strong>
                    {{ teilnahme.punkteAenderung > 0 ? '+' : '' }}{{ teilnahme.punkteAenderung }}
                  </strong>
                </td>
                <td>{{ teilnahme.neuerPunktestand }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
import { teilnahmeApi, userApi } from '../services/api'

export default {
  data() {
    return {
      profile: null,
      teilnahmen: [],
      isLoading: false,
      errorMessage: ''
    }
  },

  async mounted() {
    await this.loadData()
  },

  methods: {
    async loadData() {
      this.isLoading = true
      this.errorMessage = ''

      try {
        this.profile = await userApi.getProfile()
        this.teilnahmen = await teilnahmeApi.getByUser(this.profile.id)
      } catch (error) {
        this.errorMessage = 'Deine Quiz-Historie konnte nicht geladen werden.'
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },

    formatDate(value) {
      if (!value) {
        return '–'
      }

      return new Date(value).toLocaleString('de-DE', {
        dateStyle: 'short',
        timeStyle: 'short'
      })
    }
  }
}
</script>