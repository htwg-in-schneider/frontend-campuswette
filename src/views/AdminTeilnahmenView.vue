<template>
  <main class="section">
    <div class="container">
      <RouterLink to="/admin" class="back-link">
        ← Zurück zum Admin-Bereich
      </RouterLink>

      <header class="page-header">
        <p class="eyebrow">Transaktionen</p>
        <h1>Teilnahmen nachvollziehen</h1>
        <p class="section-intro">
          Hier können Administrator:innen nachvollziehen, welche Benutzer:innen
          an welchen Quiz-Wetten teilgenommen haben, welche Antwort gewählt
          wurde und wie sich der Punktestand verändert hat.
        </p>
      </header>

      <section class="form-card">
        <label>
          Suche
          <input
            v-model.trim="searchTerm"
            type="text"
            placeholder="Nach Benutzer, E-Mail, Thema, Frage oder Antwort suchen"
          />
        </label>
      </section>

      <p v-if="isLoading" class="section-intro">
        Teilnahmen werden geladen...
      </p>

      <p v-else-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <section v-else>
        <p class="section-intro">
          Angezeigt: {{ filteredTeilnahmen.length }} von {{ teilnahmen.length }}
          Teilnahmen
        </p>

        <div v-if="filteredTeilnahmen.length > 0" class="admin-table-card">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Zeitpunkt</th>
                <th>Benutzer:in</th>
                <th>Quiz-Wette</th>
                <th>Antwort</th>
                <th>Einsatz</th>
                <th>Ergebnis</th>
                <th>Punkte</th>
                <th>Neuer Stand</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="teilnahme in filteredTeilnahmen" :key="teilnahme.id">
                <td>{{ formatDate(teilnahme.erstelltAm) }}</td>
                <td>
                  <strong>{{ teilnahme.userName }}</strong><br />
                  <span class="muted-small">{{ teilnahme.userEmail }}</span>
                </td>
                <td>
                  <strong>{{ teilnahme.quizThema }}</strong><br />
                  <span class="muted-small">{{ teilnahme.quizFrage }}</span>
                </td>
                <td>{{ teilnahme.gewaehlteAntwort }}</td>
                <td>{{ teilnahme.gesetztePunkte }}</td>
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

        <article v-else class="text-card">
          <h2>Keine Teilnahmen gefunden</h2>
          <p>
            Es wurden noch keine Teilnahmen gespeichert oder die Suche liefert
            keine Treffer.
          </p>
        </article>
      </section>
    </div>
  </main>
</template>

<script>
import { teilnahmeApi } from '../services/api'

export default {
  data() {
    return {
      teilnahmen: [],
      searchTerm: '',
      isLoading: false,
      errorMessage: ''
    }
  },

  computed: {
    filteredTeilnahmen() {
      const search = this.searchTerm.toLowerCase()

      return this.teilnahmen.filter((teilnahme) => {
        return (
          !search ||
          teilnahme.userName?.toLowerCase().includes(search) ||
          teilnahme.userEmail?.toLowerCase().includes(search) ||
          teilnahme.quizThema?.toLowerCase().includes(search) ||
          teilnahme.quizFrage?.toLowerCase().includes(search) ||
          teilnahme.gewaehlteAntwort?.toLowerCase().includes(search)
        )
      })
    }
  },

  async mounted() {
    await this.loadTeilnahmen()
  },

  methods: {
    async loadTeilnahmen() {
      this.isLoading = true
      this.errorMessage = ''

      try {
        this.teilnahmen = await teilnahmeApi.getAll()
      } catch (error) {
        this.errorMessage = 'Die Teilnahmen konnten nicht geladen werden.'
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