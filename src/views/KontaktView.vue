<template>
  <main class="section">
    <div class="container narrow">
      <header class="page-header">
        <p class="eyebrow">Kontakt</p>
        <h1>Kontakt aufnehmen</h1>
        <p class="section-intro">
          Fragen zur Anwendung, zum Projekt oder zur Nutzung von CampusWette
          können direkt über dieses Formular vorbereitet werden.
        </p>
      </header>

      <form class="form-card" @submit.prevent="sendMail">
        <label>
          Name
          <input
            v-model.trim="name"
            type="text"
            required
            placeholder="Ihr Name"
          />
        </label>

        <label>
          E-Mail
          <input
            v-model.trim="email"
            type="email"
            required
            placeholder="name@example.com"
          />
        </label>

        <label>
          Nachricht
          <textarea
            v-model.trim="message"
            rows="6"
            required
            placeholder="Ihre Nachricht an das CampusWette-Team"
          ></textarea>
        </label>

        <p v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>

        <button class="btn full-width" type="submit">
          Nachricht vorbereiten
        </button>
      </form>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      email: "",
      message: "",
      errorMessage: "",
    };
  },

  methods: {
    sendMail() {
      this.errorMessage = "";

      if (!this.name || !this.email || !this.message) {
        this.errorMessage = "Bitte füllen Sie alle Pflichtfelder aus.";
        return;
      }

      const subject = encodeURIComponent(`Kontaktanfrage von ${this.name}`);
      const body = encodeURIComponent(
        `Name: ${this.name}\nE-Mail: ${this.email}\n\nNachricht:\n${this.message}`,
      );

      window.location.href = `mailto:campuswette@example.com?subject=${subject}&body=${body}`;
    },
  },
};
</script>
