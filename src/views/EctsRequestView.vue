<template>
  <main class="section">
    <div class="container">
      <header class="page-header">
        <p class="eyebrow">Punkte verdienen</p>
        <h1>ECTS-Antrag</h1>
        <p class="section-intro">
          Wandle deine bestandenen ECTS-Punkte in CampusWette-Punkte um.
        </p>
      </header>

      <!-- Formular -->
      <div class="form-card">
        <h2>Neuen Antrag stellen</h2>

        <form @submit.prevent="submitAntrag" class="form">
          <label>
            Modulname
            <input
              v-model="form.modulName"
              type="text"
              placeholder="z.B. Web-Technologien"
              required
            />
          </label>

          <label>
            ECTS-Punkte
            <input
              v-model.number="form.ectsAnzahl"
              type="number"
              min="1"
              max="12"
              required
            />
          </label>

          <p class="info-text">
            💰 Umwandlung: 1 ECTS = 10 Punkte
            <strong>({{ form.ectsAnzahl * 10 }} Punkte)</strong>
          </p>

          <button type="submit" class="btn-primary" :disabled="isLoading">
            {{ isLoading ? 'Wird abgesendet...' : 'Antrag stellen' }}
          </button>

          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
        </form>
      </div>

      <!-- Historie -->
      <div class="form-card">
        <h2>Deine Anträge</h2>

        <div v-if="isLoading" class="loading">Wird geladen...</div>

        <div v-else-if="antraege.length === 0" class="empty-state">
          <p>Noch keine Anträge gestellt.</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Modul</th>
                <th>ECTS</th>
                <th>Punkte</th>
                <th>Status</th>
                <th>Datum</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="antrag in antraege" :key="antrag.id" :class="statusClass(antrag.status)">
                <td>{{ antrag.modulName }}</td>
                <td>{{ antrag.ectsAnzahl }}</td>
                <td>{{ antrag.ectsAnzahl * 10 }}</td>
                <td>
                  <span :class="`status-badge status-${antrag.status.toLowerCase()}`">
                    {{ getStatusLabel(antrag.status) }}
                  </span>
                </td>
                <td>{{ formatDate(antrag.erstelltAm) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p v-if="antraege.length > 0" class="section-intro">
          Insgesamt eingereicht: <strong>{{ getTotalEcts() }} ECTS</strong>
          ({{ getTotalEcts() * 10 }} Punkte)
        </p>
      </div>
    </div>
  </main>
</template>

<script>
import { ectsApi } from '../services/api'

export default {
  name: 'EctsRequestView',

  data() {
    return {
      form: {
        modulName: '',
        ectsAnzahl: 3
      },
      antraege: [],
      isLoading: false,
      errorMessage: '',
      successMessage: ''
    }
  },

  async mounted() {
    await this.loadAntraege()
  },

  methods: {
    async submitAntrag() {
      this.errorMessage = ''
      this.successMessage = ''
      this.isLoading = true

      try {
        await ectsApi.create(this.form)
        this.successMessage = '✓ Antrag erfolgreich eingereicht!'
        this.form.modulName = ''
        this.form.ectsAnzahl = 3
        await this.loadAntraege()
      } catch (error) {
        this.errorMessage = `Fehler: ${error.message}`
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },

    async loadAntraege() {
      this.isLoading = true
      try {
        this.antraege = await ectsApi.getMyRequests()
      } catch (error) {
        this.errorMessage = `Anträge konnten nicht geladen werden: ${error.message}`
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },

    getStatusLabel(status) {
      const labels = {
        PENDING: 'Ausstehend',
        GENEHMIGT: '✓ Genehmigt',
        ABGELEHNT: '✗ Abgelehnt'
      }
      return labels[status] || status
    },

    statusClass(status) {
      return `status-${status.toLowerCase()}`
    },

    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    },

    getTotalEcts() {
      return this.antraege
        .filter(a => a.status === 'GENEHMIGT')
        .reduce((sum, a) => sum + a.ectsAnzahl, 0)
    }
  }
}
</script>

<style scoped>
.form-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 2rem;
  margin-bottom: 2rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--text);
}

.form input {
  padding: 0.75rem;
  background: var(--surface-light);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-size: 1rem;
}

.form input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-soft);
}

.info-text {
  padding: 1rem;
  background: rgba(245, 132, 39, 0.1);
  border-left: 4px solid var(--primary);
  border-radius: 4px;
  color: var(--text);
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover:not(:disabled) {
  background: #e56f1f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 132, 39, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: #ff6b6b;
  padding: 1rem;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 4px;
}

.success-message {
  color: #51cf66;
  padding: 1rem;
  background: rgba(81, 207, 102, 0.1);
  border-radius: 4px;
}

.table-responsive {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
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

.status-badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-pending {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.status-genehmigt {
  background: rgba(81, 207, 102, 0.2);
  color: #51cf66;
}

.status-abgelehnt {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--muted);
}

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--muted);
}
</style>
