<template>
  <form class="filter-card" @submit.prevent="submitFilter">
    <div class="filter-grid">
      <label>
        Suche
        <input
          v-model="filters.search"
          type="text"
          placeholder="Nach Thema oder Frage suchen"
        />
      </label>

      <label>
        Status
        <select v-model="filters.status">
          <option value="">Alle Status</option>
          <option value="ENTWURF">Entwurf</option>
          <option value="AKTIV">Aktiv</option>
          <option value="BEENDET">Beendet</option>
        </select>
      </label>

      <label>
        Schwierigkeit
        <select v-model="filters.schwierigkeit">
          <option value="">Alle Schwierigkeiten</option>
          <option value="LEICHT">Leicht</option>
          <option value="MITTEL">Mittel</option>
          <option value="SCHWER">Schwer</option>
        </select>
      </label>

      <label>
        Professor
        <select v-model="filters.professorId">
          <option value="">Alle Professoren</option>
          <option
            v-for="professor in professors"
            :key="professor.id"
            :value="professor.id"
          >
            {{ professor.name }}
          </option>
        </select>
      </label>
    </div>

    <div class="form-actions">
      <button class="btn" type="submit">
        Suchen
      </button>

      <button class="small-btn" type="button" @click="resetFilter">
        Zurücksetzen
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive } from 'vue'

defineProps({
  professors: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['filter'])

const filters = reactive({
  search: '',
  status: '',
  schwierigkeit: '',
  professorId: ''
})

function submitFilter() {
  emit('filter', {
    search: filters.search,
    status: filters.status,
    schwierigkeit: filters.schwierigkeit,
    professorId: filters.professorId
  })
}

function resetFilter() {
  filters.search = ''
  filters.status = ''
  filters.schwierigkeit = ''
  filters.professorId = ''

  submitFilter()
}
</script>