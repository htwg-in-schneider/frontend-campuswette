<template>
  <main>
    <SpecialBanner />

    <section class="section">
      <div class="container">
        <header class="page-header">
          <p class="eyebrow">CampusWette</p>
          <h1>Interaktive Quiz-Wetten für den Hochschulalltag</h1>
          <p class="section-intro">
            CampusWette verbindet Wissensabfragen, spielerische Punkteinsätze
            und eine übersichtliche Verwaltung von Quiz-Wetten. Studierende
            können an Quiz-Wetten teilnehmen, während Administrator:innen
            Stammdaten und Quiz-Inhalte verwalten.
          </p>
        </header>

        <div class="cards">
          <article class="card">
            <span class="status-badge">User-Bereich</span>
            <h3>Teilnehmen</h3>
            <p>
              Studierende können aktive Quiz-Wetten ansehen, Antworten auswählen
              und Punkte auf ihre Einschätzung setzen.
            </p>
          </article>

          <article class="card">
            <span class="status-badge">Lernen</span>
            <h3>Motivation steigern</h3>
            <p>
              Durch den spielerischen Ansatz werden Wiederholung, Aufmerksamkeit
              und Beteiligung in Lehrveranstaltungen gefördert.
            </p>
          </article>

          <article class="card">
            <span class="status-badge">Admin</span>
            <h3>Verwalten</h3>
            <p>
              Administrator:innen können Quiz-Wetten, Professor:innen und
              Stammdaten zentral erfassen, bearbeiten und auswerten.
            </p>
          </article>
        </div>

        <div class="cta-box">
          <p class="eyebrow">Direkt starten</p>
          <h2>Aktuelle Quiz-Wetten ansehen</h2>
          <p>
            Öffne den Quiz-Wetten-Katalog und sieh dir die aktuell verfügbaren
            Fragen aus dem Backend an.
          </p>

          <div class="banner-actions">
            <RouterLink to="/quizwetten" class="btn">
              Quiz-Wetten ansehen
            </RouterLink>
            <RouterLink to="/kontakt" class="btn secondary">
              Kontakt aufnehmen
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import SpecialBanner from '../components/SpecialBanner.vue'
</script>