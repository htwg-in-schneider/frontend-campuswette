<template>
  <main>
    <SpecialBanner />

    <section class="section">
      <div class="container">
        <p class="eyebrow">Projektidee</p>
        <h2>Funktionen von CampusWette</h2>

        <div class="cards">
          <article class="card">
            <h3>ECTS umwandeln</h3>
            <p>Studienleistungen können in eine interne Spielwährung übertragen werden.</p>
          </article>

          <article class="card">
            <h3>Quiz-Wetten</h3>
            <p>Professoren erstellen Quiz-Fragen, an denen Studierende teilnehmen können.</p>
          </article>

          <article class="card">
            <h3>Mehr Beteiligung</h3>
            <p>Die App fördert Interaktion und Aufmerksamkeit während der Vorlesung.</p>
          </article>
        </div>
      </div>
    </section>

<section id="quizwetten" class="section">
  <div class="container">
    <p class="eyebrow">Beispiele</p>
    <h2>Aktuelle Quiz-Wetten</h2>
    <RouterLink to="/quizwetten/new" class="btn">
        Neue Quiz-Wette
    </RouterLink>
    <p v-if="isLoading">Quiz-Wetten werden geladen...</p>

    <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>

    <QuizWetteFilter @filter="loadQuizWetten" />

    <div v-if="!isLoading && quizWetten.length > 0" class="cards">
      <QuizWetteCard
        v-for="quizWette in quizWetten"
        :key="quizWette.id"
        :quiz-wette="quizWette"
        @show-details="goToDetails"
      />
    </div>

    <p v-if="!isLoading && quizWetten.length === 0 && !errorMessage">
      Keine Quiz-Wetten vorhanden.
    </p>
  </div>
</section>
  </main>
</template>

<script>
import SpecialBanner from '../components/SpecialBanner.vue'
import QuizWetteCard from '../components/QuizWetteCard.vue'
import QuizWetteFilter from '../components/QuizWetteFilter.vue'
import { fetchQuizWetten } from '../services/quizWetteService'

export default {
  components: {
    SpecialBanner,
    QuizWetteCard,
    QuizWetteFilter
  },

  data() {
    return {
      quizWetten: [],
      isLoading: false,
      errorMessage: '',
      currentFilters: {
        search: '',
        status: '',
        schwierigkeit: ''
      }
    }
  },

  async mounted() {
    await this.loadQuizWetten()
  },

  methods: {
    async loadQuizWetten(filters = this.currentFilters) {
      console.log('Catalog erhält Filter:', filters)

      this.isLoading = true
      this.errorMessage = ''
      this.currentFilters = filters

      try {
        this.quizWetten = await fetchQuizWetten(filters)
      } catch (error) {
        this.errorMessage = 'Die Quiz-Wetten konnten nicht vom Backend geladen werden.'
      } finally {
        this.isLoading = false
      }
    },

    goToDetails(quizWette) {
      this.$router.push(`/quizwetten/${quizWette.id}`)
    }
  }
}
</script>