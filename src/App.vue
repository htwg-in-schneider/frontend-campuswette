<template>
  <Navbar />

  <main>
    <SpecialBanner />

    <section id="features" class="section">
      <div class="container">
        <p class="eyebrow">Projektidee</p>
        <h2>Funktionen von CampusWette</h2>

        <div class="cards">
          <article class="card">
            <h3>ECTS umwandeln</h3>
            <p>
              Studienleistungen können in eine interne Spielwährung übertragen werden.
            </p>
          </article>

          <article class="card">
            <h3>Quiz-Wetten</h3>
            <p>
              Professoren erstellen Quiz-Fragen, an denen Studierende teilnehmen können.
            </p>
          </article>

          <article class="card">
            <h3>Mehr Beteiligung</h3>
            <p>
              Die App fördert Interaktion und Aufmerksamkeit während der Vorlesung.
            </p>
          </article>
        </div>
      </div>
    </section>

    <section id="quizwetten" class="section">
      <div class="container">
        <p class="eyebrow">Beispiele</p>
        <h2>Aktuelle Quiz-Wetten</h2>

        <div class="cards">
          <QuizWetteCard
            v-for="quizWette in quizWetten"
            :key="quizWette.id"
            :quiz-wette="quizWette"
            @show-details="showDetails"
          />
        </div>
      </div>
    </section>
  </main>

  <Footer />
</template>

<script>
import { quizWetten } from './data/quizwetten'
import Navbar from './components/Navbar.vue'
import SpecialBanner from './components/SpecialBanner.vue'
import QuizWetteCard from './components/QuizWetteCard.vue'
import Footer from './components/Footer.vue'

export default {
  components: {
    Navbar,
    SpecialBanner,
    QuizWetteCard,
    Footer
  },
  data() {
    return {
      quizWetten
    }
  },
  methods: {
    showDetails(quizWette) {
      alert(quizWette.beschreibung)
    }
  }
}
</script>