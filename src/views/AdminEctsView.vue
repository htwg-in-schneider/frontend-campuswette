<template>
  <main class="section">
    <div class="container">
      <header class="page-header">
        <p class="eyebrow">Verwaltung</p>
        <h1>ECTS-Anträge</h1>
        <p class="section-intro">
          Alle eingereichten ECTS-Umwandlungsanträge verwalten.
        </p>
      </header>

      <!-- Filter -->
      <div class="form-card">
        <div class="filter-group">
          <label>
            Status filtern
            <select v-model="filterStatus">
              <option value="">Alle Status</option>
              <option value="PENDING">Ausstehend</option>
              <option value="GENEHMIGT">Genehmigt</option>
              <option value="ABGELEHNT">Abgelehnt</option>
            </select>
          </label>
        </div>
      </div>

      <!-- Anträge Tabelle -->
      <div class="form-card">
        <div v-if="isLoading" class="loading">Wird geladen...</div>

        <div v-else-if="filteredAntraege.length === 0" class="empty-state">
          <p>Keine Anträge in diesem Status.</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Modul</th>
                <th>ECTS</th>
                <th>Punkte</th>
                <th>Datum</th>
                <th>Status</th>
                <th>Aktion</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="antrag in filteredAntraege" :key="antrag.id">
                <td>
                  <div>
                    <strong>{{ antrag.userName }}</strong>
                    <br />
                    <span class="email">{{ antrag.userEmail }}</span>
                  </div>
                </td>
                <td>{{ antrag.modulName }}</td>
                <td>{{ antrag.ectsAnzahl }}</td>
                <td>{{ antrag.ectsAnzahl * 10 }}</td>
                <td>{{ formatDate(antrag.erstelltAm) }}</td>
                <td>
                  <span :class="`status-badge status-${antrag.status.toLowerCase()}`">
                    {{ getStatusLabel(antrag.status) }}
                  </span>
                </td>
                <td>
                  <button
                    v-if="antrag.status === 'PENDING'"
                    @click="openApprovalDialog(antrag)"
                    class="btn-approve"
                  >
                    ✓ Genehmigen
                  </button>
                  <button
                    v-if="antrag.status === 'PENDING'"
                    @click="openRejectDialog(antrag)"
                    class="btn-reject"
                  >
                    ✗ Ablehnen
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p v-if="filteredAntraege.length > 0" class="section-intro">
          Insgesamt: <strong>{{ filteredAntraege.length }}</strong> Anträge
        </p>
      </div>

      <!-- Approval Dialog -->
      <div v-if="showApprovalDialog" class="modal-overlay" @click="closeDialogs">
        <div class="modal-content" @click.stop>
          <h2>ECTS-Antrag genehmigen</h2>
          <p>Student: <strong>{{ selectedAntrag?.userName }}</strong></p>
          <p>Modul: <strong>{{ selectedAntrag?.modulName }}</strong></p>
          <p>ECTS: <strong>{{ selectedAntrag?.ectsAnzahl }}</strong></p>

          <label>
            Punkte verteilen
            <input
              v-model.number="approvalPunkte"
              type="number"
              :value="selectedAntrag?.ectsAnzahl * 10"
              min="0"
            />
          </label>

          <div class="info-text">
            💰 Standard: 1 ECTS = 10 Punkte
            <strong>({{ selectedAntrag?.ectsAnzahl * 10 }} Punkte)</strong>
          </div>

          <div class="modal-actions">
            <button @click="approveAntrag" class="btn-approve">Genehmigen</button>
            <button @click="closeDialogs" class="btn-cancel">Abbrechen</button>
          </div>
        </div>
      </div>

      <!-- Reject Dialog -->
      <div v-if="showRejectDialog" class="modal-overlay" @click="closeDialogs">
        <div class="modal-content" @click.stop>
          <h2>ECTS-Antrag ablehnen</h2>
          <p>Student: <strong>{{ selectedAntrag?.userName }}</strong></p>
          <p>Modul: <strong>{{ selectedAntrag?.modulName }}</strong></p>

          <label>
            Grund der Ablehnung (optional)
            <textarea
              v-model="rejectGrund"
              placeholder="z.B. Modul nicht anerkannt..."
            ></textarea>
          </label>

          <div class="modal-actions">
            <button @click="rejectAntrag" class="btn-reject">Ablehnen</button>
            <button @click="closeDialogs" class="btn-cancel">Abbrechen</button>
          </div>
        </div>
      </div>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    </div>
  </main>
</template>

<script>
import { ectsApi } from '../services/api'

export default {
  name: 'AdminEctsView',

  data() {
    return {
      antraege: [],
      filterStatus: '',
      isLoading: false,
      errorMessage: '',
      successMessage: '',
      showApprovalDialog: false,
      showRejectDialog: false,
      selectedAntrag: null,
      approvalPunkte: 0,
      rejectGrund: ''
    }
  },

  computed: {
    filteredAntraege() {
      if (!this.filterStatus) {
        return this.antraege
      }
      return this.antraege.filter(a => a.status === this.filterStatus)
    }
  },

  async mounted() {
    await this.loadAntraege()
  },

  watch: {
    filterStatus() {
      this.loadAntraege()
    }
  },

  methods: {
    async loadAntraege() {
      this.isLoading = true
      this.errorMessage = ''

      try {
        this.antraege = await ectsApi.getAllRequests(this.filterStatus || null)
      } catch (error) {
        this.errorMessage = `Anträge konnten nicht geladen werden: ${error.message}`
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },

    openApprovalDialog(antrag) {
      this.selectedAntrag = antrag
      this.approvalPunkte = antrag.ectsAnzahl * 10
      this.showApprovalDialog = true
    },

    openRejectDialog(antrag) {
      this.selectedAntrag = antrag
      this.rejectGrund = ''
      this.showRejectDialog = true
    },

    closeDialogs() {
      this.showApprovalDialog = false
      this.showRejectDialog = false
      this.selectedAntrag = null
      this.approvalPunkte = 0
      this.rejectGrund = ''
    },

    async approveAntrag() {
      this.errorMessage = ''
      this.successMessage = ''

      try {
        await ectsApi.approveRequest(this.selectedAntrag.id, this.approvalPunkte)
        this.successMessage = `✓ ${this.selectedAntrag.userName} wurde ${this.approvalPunkte} Punkte gutgeschrieben!`
        this.closeDialogs()
        await this.loadAntraege()
      } catch (error) {
        this.errorMessage = `Fehler beim Genehmigen: ${error.message}`
        console.error(error)
      }
    },

    async rejectAntrag() {
      this.errorMessage = ''
      this.successMessage = ''

      try {
        await ectsApi.rejectRequest(this.selectedAntrag.id, this.rejectGrund)
        this.successMessage = `✓ Antrag von ${this.selectedAntrag.userName} abgelehnt!`
        this.closeDialogs()
        await this.loadAntraege()
      } catch (error) {
        this.errorMessage = `Fehler beim Ablehnen: ${error.message}`
        console.error(error)
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

    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
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

.filter-group {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.filter-group label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--text);
}

.filter-group select {
  padding: 0.75rem;
  background: var(--surface-light);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-size: 1rem;
  cursor: pointer;
}

.table-responsive {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
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

.email {
  font-size: 0.85rem;
  color: var(--muted);
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

.btn-approve,
.btn-reject,
.btn-cancel {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.btn-approve {
  background: rgba(81, 207, 102, 0.2);
  color: #51cf66;
}

.btn-approve:hover {
  background: rgba(81, 207, 102, 0.4);
}

.btn-reject {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
}

.btn-reject:hover {
  background: rgba(255, 107, 107, 0.4);
}

.btn-cancel {
  background: var(--border);
  color: var(--text);
}

.btn-cancel:hover {
  background: var(--muted);
  color: white;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-content h2 {
  margin-bottom: 1.5rem;
  color: var(--text);
}

.modal-content p {
  margin-bottom: 1rem;
  color: var(--muted);
}

.modal-content label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 1rem;
}

.modal-content input,
.modal-content textarea {
  padding: 0.75rem;
  background: var(--surface-light);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-size: 1rem;
  font-family: inherit;
}

.modal-content textarea {
  min-height: 80px;
  resize: vertical;
}

.info-text {
  padding: 1rem;
  background: rgba(245, 132, 39, 0.1);
  border-left: 4px solid var(--primary);
  border-radius: 4px;
  color: var(--text);
  margin-bottom: 1rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.modal-actions button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.error-message {
  color: #ff6b6b;
  padding: 1rem;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 4px;
  margin-top: 1rem;
}

.success-message {
  color: #51cf66;
  padding: 1rem;
  background: rgba(81, 207, 102, 0.1);
  border-radius: 4px;
  margin-top: 1rem;
}

.empty-state,
.loading {
  text-align: center;
  padding: 3rem;
  color: var(--muted);
}
</style>
