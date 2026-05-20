<template>
  <header class="site-header">
    <div class="container nav">
      <div class="logo">CampusWette</div>

      <nav>
        <a href="#home">Start</a>
        <a href="#features">Funktionen</a>
        <a href="#quizwetten">Quiz-Wetten</a>
      </nav>
    </div>
  </header>

  <main>
    <section id="home" class="hero">
      <div class="container hero-content">
        <p class="eyebrow">Interaktive Lernplattform</p>
        <h1>CampusWette macht Vorlesungen spannender</h1>
        <p>
          CampusWette verbindet Studium, Spielwährung und Quiz-Wetten.
          Studierende können aktiv teilnehmen, während Lehrende interaktive
          Quiz-Formate für ihre Vorlesungen erstellen.
        </p>
        <a href="#quizwetten" class="btn">Quiz-Wetten ansehen</a>
      </div>
    </section>

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
      <div class="cards">
  <article
    v-for="quizWette in quizWetten"
    :key="quizWette.id"
    class="card"
  >
    <h3>{{ quizWette.frage }}</h3>
    <p>Thema: {{ quizWette.thema }}</p>
    <p>Status: {{ quizWette.status }}</p>
    <p>Schwierigkeit: {{ quizWette.schwierigkeit }}</p>

    <button class="btn" @click="showDetails(quizWette)">
      Details
    </button>
  </article>
</div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>CampusWette · Web-Technologien Aufgabe 4</p>
    </div>
  </footer>
</template>
<script>
import { quizWetten } from './data/quizwetten'

export default {
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