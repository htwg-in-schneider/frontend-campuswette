<template>
  <main class="section">
    <div class="container narrow">
      <header class="page-header">
        <p class="eyebrow">Login</p>
        <h1>Anmelden</h1>
        <p class="section-intro">
          Melde dich mit einem vorbereiteten Benutzerkonto an. Die Anmeldung
          wird über das Spring-Boot-Backend gegen die MariaDB-Datenbank geprüft.
        </p>
      </header>

      <form class="form-card" @submit.prevent="handleLogin">
        <label>
          E-Mail
          <input
            v-model.trim="email"
            type="email"
            required
            placeholder="student@campuswette.de"
          />
        </label>

        <label>
          Passwort
          <input
            v-model.trim="password"
            type="password"
            required
            placeholder="Passwort eingeben"
          />
        </label>

        <p v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>

        <button class="btn full-width" type="submit">Einloggen</button>
      </form>

      <article class="text-card">
        <h2>Testzugänge</h2>
        <p><strong>User:</strong> student@campuswette.de / student123</p>
        <p><strong>Admin:</strong> admin@campuswette.de / admin123</p>
      </article>
    </div>
  </main>
</template>

<script>
import { useAuthStore } from "../stores/auth";

export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },

  methods: {
    async handleLogin() {
      this.errorMessage = "";

      try {
        const authStore = useAuthStore();
        await authStore.login(this.email, this.password);

        if (authStore.isAdmin) {
          this.$router.push("/admin");
        } else {
          this.$router.push("/profil");
        }
      } catch (error) {
        this.errorMessage = "E-Mail oder Passwort ist falsch.";
        console.error(error);
      }
    },
  },
};
</script>
