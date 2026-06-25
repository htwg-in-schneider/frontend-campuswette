<template>
  <main class="section">
    <div class="container">
      <header class="page-header">
        <p class="eyebrow">Professor Dashboard</p>
        <h1>Quiz-Verwaltung</h1>
        <p class="section-intro">
          Erstelle Quiz-Wetten, verwalte dein Punktebudget und kontrolliere
          deine Inhalte.
        </p>
      </header>

      <p v-if="isLoading" class="section-intro">Dashboard wird geladen...</p>

      <p v-else-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <template v-else-if="profile">
        <article class="text-card">
          <span class="status-badge">Professor</span>
          <h2>Hallo, {{ profile.name }}</h2>
          <p>
            Dein aktuelles Quiz-Budget beträgt
            <strong>{{ profile.points }} Punkte</strong>.
          </p>
        </article>

        <section class="cards dashboard-cards">
          <article class="card">
            <span class="status-badge">Quiz</span>
            <h3>Quiz-Wetten verwalten</h3>
            <p>
              Erstelle neue Quiz-Wetten oder bearbeite bestehende Quiz-Inhalte.
            </p>
            <RouterLink to="/quizwetten-verwalten" class="btn">
              Quiz verwalten
            </RouterLink>
          </article>

          <article class="card">
            <span class="status-badge">Vorschau</span>
            <h3>Öffentliche Quiz-Ansicht</h3>
            <p>Prüfe, wie Quiz-Wetten für Studierende angezeigt werden.</p>
            <RouterLink to="/quizwetten" class="btn">
              Quiz-Wetten ansehen
            </RouterLink>
          </article>

          <article class="card">
            <span class="status-badge">Profil</span>
            <h3>Profil ansehen</h3>
            <p>Prüfe deine Profildaten und deine Rolle.</p>
            <RouterLink to="/profil" class="btn"> Profil öffnen </RouterLink>
          </article>
        </section>
      </template>
    </div>
  </main>
</template>

<script>
import { userApi } from "../services/api";

export default {
  data() {
    return {
      profile: null,
      isLoading: false,
      errorMessage: "",
    };
  },

  async mounted() {
    await this.loadProfile();
  },

  methods: {
    async loadProfile() {
      this.isLoading = true;
      this.errorMessage = "";

      try {
        this.profile = await userApi.getProfile();

        if (this.profile.role !== "PROFESSOR") {
          this.$router.replace("/dashboard");
        }
      } catch (error) {
        this.errorMessage =
          "Das Professor-Dashboard konnte nicht geladen werden.";
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
