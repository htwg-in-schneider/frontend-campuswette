<template>
  <main>
    <section class="hero">
      <div class="container hero-content">
        <p class="eyebrow">CampusWette</p>
        <h1>Quiz-Wetten, ECTS-Punkte und Campus-Challenges an einem Ort</h1>
        <p>
          CampusWette verbindet spielerische Quiz-Teilnahmen, ECTS-Anträge und
          rollenbasierte Verwaltungsfunktionen für Studierende, Professor:innen
          und Administrator:innen.
        </p>

        <div class="banner-actions">
          <RouterLink to="/quizwetten" class="btn">
            Quiz-Wetten ansehen
          </RouterLink>

          <RouterLink to="/dashboard" class="btn secondary">
            Zum Dashboard
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <header class="page-header">
          <p class="eyebrow">Funktionen</p>
          <h2>Was CampusWette bietet</h2>
          <p class="section-intro">
            Die Anwendung stellt verschiedene Funktionen abhängig von der Rolle
            des angemeldeten Nutzers bereit.
          </p>
        </header>

        <div class="cards">
          <article class="card">
            <span class="status-badge">Studierende</span>
            <h3>Quiz-Wetten & Historie</h3>
            <p>
              Studierende können an aktiven Quiz-Wetten teilnehmen, Punkte
              sammeln und ihre persönliche Teilnahme-Historie einsehen.
            </p>
          </article>

          <article class="card">
            <span class="status-badge">ECTS</span>
            <h3>ECTS-Anträge</h3>
            <p>
              Über ein Antragssystem können Studierende absolvierte Module
              melden. Nach Genehmigung werden Punkte gutgeschrieben.
            </p>
          </article>

          <article class="card">
            <span class="status-badge">Verwaltung</span>
            <h3>Admin & Professor:innen</h3>
            <p>
              Professor:innen verwalten Quiz-Wetten. Administrator:innen prüfen
              Anträge, verwalten Profile und behalten Teilnahmen im Blick.
            </p>
          </article>
        </div>

        <div class="cta-box">
          <h2>Direkt loslegen</h2>
          <p>
            Öffentliche Quiz-Wetten können ohne Anmeldung angesehen werden. Für
            Teilnahme, ECTS-Anträge und Verwaltungsfunktionen ist ein Login
            erforderlich.
          </p>

          <RouterLink to="/quizwetten" class="btn">
            Öffentliche Quiz-Wetten öffnen
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container narrow">
        <header class="page-header">
          <p class="eyebrow">Kontakt</p>
          <h2>Kontakt aufnehmen</h2>
          <p class="section-intro">
            Fragen zur Anwendung, zum Projekt oder zur Nutzung von CampusWette
            können direkt über dieses Formular vorbereitet werden.
          </p>
        </header>

        <form class="form-card" @submit.prevent="sendMail">
          <label>
            Name
            <input
              v-model.trim="contact.name"
              type="text"
              required
              placeholder="Ihr Name"
            />
          </label>

          <label>
            E-Mail
            <input
              v-model.trim="contact.email"
              type="email"
              required
              placeholder="name@example.com"
            />
          </label>

          <label>
            Nachricht
            <textarea
              v-model.trim="contact.message"
              rows="6"
              required
              placeholder="Ihre Nachricht an das CampusWette-Team"
            ></textarea>
          </label>

          <p v-if="formError" class="error-message">
            {{ formError }}
          </p>

          <button class="btn full-width" type="submit">
            Nachricht vorbereiten
          </button>
        </form>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  data() {
    return {
      contact: {
        name: "",
        email: "",
        message: "",
      },
      formError: "",
    };
  },

  methods: {
    sendMail() {
      this.formError = "";

      if (!this.contact.name || !this.contact.email || !this.contact.message) {
        this.formError = "Bitte füllen Sie alle Felder aus.";
        return;
      }

      const recipient = "campuswette@example.com";
      const subject = encodeURIComponent(
        `Kontaktanfrage von ${this.contact.name}`,
      );
      const body = encodeURIComponent(
        `Name: ${this.contact.name}\n` +
          `E-Mail: ${this.contact.email}\n\n` +
          `Nachricht:\n${this.contact.message}`,
      );

      window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    },
  },
};
</script>
