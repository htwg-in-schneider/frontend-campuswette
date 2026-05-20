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

const emit = defineEmits(['filter'])

const filters = reactive({
  search: '',
  status: '',
  schwierigkeit: ''
})

function submitFilter() {
  console.log('Filter werden gesendet:', {
    search: filters.search,
    status: filters.status,
    schwierigkeit: filters.schwierigkeit
  })

  emit('filter', {
    search: filters.search,
    status: filters.status,
    schwierigkeit: filters.schwierigkeit
  })
}

function resetFilter() {
  filters.search = ''
  filters.status = ''
  filters.schwierigkeit = ''
  submitFilter()
}
</script>