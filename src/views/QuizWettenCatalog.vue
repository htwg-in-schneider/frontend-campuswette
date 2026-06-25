<template>
  <main class="section">
    <div class="container">
      <header class="page-header">
        <p class="eyebrow">Quiz-Wetten</p>
        <h1>Aktuelle Quiz-Wetten</h1>
        <p class="section-intro">
          Hier findest du alle verfügbaren Quiz-Wetten.
        </p>
      </header>

      <div class="form-card">
        <label>
          Suche
          <input
            v-model.trim="searchTerm"
            type="text"
            placeholder="Nach Thema, Frage oder Professor suchen"
          />
        </label>

        <div class="meta-grid">
          <label>
            Status
            <select v-model="selectedStatus">
              <option value="">Alle Status</option>
              <option value="AKTIV">Aktiv</option>
              <option value="ENTWURF">Entwurf</option>
              <option value="BEENDET">Beendet</option>
            </select>
          </label>

          <label>
            Schwierigkeit
            <select v-model="selectedDifficulty">
              <option value="">Alle Schwierigkeiten</option>
              <option value="LEICHT">Leicht</option>
              <option value="MITTEL">Mittel</option>
              <option value="SCHWER">Schwer</option>
            </select>
          </label>
        </div>
      </div>

      <p v-if="isLoading" class="section-intro">
        Quiz-Wetten werden geladen...
      </p>

      <p v-else-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <template v-else>
        <p class="section-intro">
          Angezeigt: {{ filteredQuizWetten.length }} von {{ quizWetten.length }}
          Quiz-Wetten
        </p>

        <div v-if="filteredQuizWetten.length > 0" class="cards">
          <QuizWetteCard
            v-for="quizWette in filteredQuizWetten"
            :key="quizWette.id"
            :quiz-wette="quizWette"
            @show-details="goToDetails"
          />
        </div>

        <div v-else class="text-card">
          <h2>Keine Quiz-Wetten gefunden</h2>
          <p>
            Passe deine Such- oder Filtereinstellungen an, um weitere
            Quiz-Wetten anzuzeigen.
          </p>
        </div>
      </template>
    </div>
  </main>
</template>

<script>
import QuizWetteCard from "../components/QuizWetteCard.vue";
import { quizWetteApi } from "../services/api";

export default {
  components: {
    QuizWetteCard,
  },

  data() {
    return {
      quizWetten: [],
      isLoading: false,
      errorMessage: "",
      searchTerm: "",
      selectedStatus: "",
      selectedDifficulty: "",
    };
  },

  computed: {
    filteredQuizWetten() {
      const search = this.searchTerm?.toLowerCase() || "";

      return this.quizWetten.filter(Boolean).filter((quizWette) => {
        const professorName = quizWette.professor?.name || "";

        const matchesSearch =
          !search ||
          quizWette.frage?.toLowerCase().includes(search) ||
          quizWette.thema?.toLowerCase().includes(search) ||
          professorName.toLowerCase().includes(search);

        const matchesStatus =
          !this.selectedStatus || quizWette.status === this.selectedStatus;

        const matchesDifficulty =
          !this.selectedDifficulty ||
          quizWette.schwierigkeit === this.selectedDifficulty;

        return matchesSearch && matchesStatus && matchesDifficulty;
      });
    },
  },

  async mounted() {
    await this.loadQuizWetten();
  },

  methods: {
    async loadQuizWetten() {
      this.isLoading = true;
      this.errorMessage = "";

      try {
        this.quizWetten = await quizWetteApi.getAll();
      } catch (error) {
        this.errorMessage = `Die Quiz-Wetten konnten nicht geladen werden: ${error.message}`;
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },

    goToDetails(quizWette) {
      this.$router.push(`/quizwetten/${quizWette.id}`);
    },
  },
};
</script>
