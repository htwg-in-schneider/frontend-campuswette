<template>
  <main class="section">
    <div class="container">
      <RouterLink to="/admin" class="back-link">
        ← Zurück zum Admin-Bereich
      </RouterLink>

      <header class="page-header">
        <p class="eyebrow">Benutzerverwaltung</p>
        <h1>Benutzer:innen verwalten</h1>
        <p class="section-intro">
          Administrator:innen können vorbereitete Benutzerkonten anzeigen,
          suchen und Profildaten bearbeiten. Neue Benutzer:innen werden in
          dieser Anwendung vorbereitend im Backend angelegt.
        </p>
      </header>

      <section class="form-card">
        <h2>
          {{
            editingUserId ? "Benutzer:in bearbeiten" : "Benutzer:in auswählen"
          }}
        </h2>

        <form
          v-if="editingUserId"
          class="admin-form"
          @submit.prevent="saveUser"
        >
          <label>
            Name
            <input
              v-model.trim="form.name"
              type="text"
              required
              placeholder="Name der Benutzer:in"
            />
          </label>

          <label>
            Adresse
            <input
              v-model.trim="form.address"
              type="text"
              required
              placeholder="Adresse der Benutzer:in"
            />
          </label>

          <p v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </p>

          <p v-if="successMessage" class="success-message">
            {{ successMessage }}
          </p>

          <div class="admin-actions">
            <button class="btn" type="submit">Änderungen speichern</button>

            <button class="btn secondary" type="button" @click="resetForm">
              Abbrechen
            </button>
          </div>
        </form>

        <p v-else class="section-intro">
          Wähle unten eine Benutzer:in aus der Tabelle aus, um Name oder Adresse
          zu bearbeiten.
        </p>
      </section>

      <section class="form-card">
        <label>
          Suche
          <input
            v-model.trim="searchTerm"
            type="text"
            placeholder="Nach Name, E-Mail, Rolle oder Adresse suchen"
          />
        </label>
      </section>

      <p v-if="isLoading" class="section-intro">
        Benutzer:innen werden geladen...
      </p>

      <p v-else-if="loadError" class="error-message">
        {{ loadError }}
      </p>

      <section v-else>
        <p class="section-intro">
          Angezeigt: {{ filteredUsers.length }} von {{ users.length }}
          Benutzer:innen
        </p>

        <div v-if="filteredUsers.length > 0" class="admin-table-card">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>E-Mail</th>
                <th>Rolle</th>
                <th>Adresse</th>
                <th>Punkte</th>
                <th>Aktionen</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id">
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="status-badge">{{ user.role }}</span>
                </td>
                <td>{{ user.address }}</td>
                <td>{{ user.points }}</td>
                <td>
                  <div class="table-actions">
                    <button
                      class="small-button"
                      type="button"
                      @click="startEditing(user)"
                    >
                      Bearbeiten
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <article v-else class="text-card">
          <h2>Keine Benutzer:innen gefunden</h2>
          <p>Passe die Suche an, um andere Benutzerkonten anzuzeigen.</p>
        </article>
      </section>
    </div>
  </main>
</template>

<script>
import { userApi } from "../services/api";

export default {
  data() {
    return {
      users: [],
      searchTerm: "",
      isLoading: false,
      loadError: "",
      errorMessage: "",
      successMessage: "",
      editingUserId: null,
      form: {
        name: "",
        address: "",
      },
    };
  },

  computed: {
    filteredUsers() {
      const search = this.searchTerm.toLowerCase();

      return this.users.filter((user) => {
        return (
          !search ||
          user.name?.toLowerCase().includes(search) ||
          user.email?.toLowerCase().includes(search) ||
          user.role?.toLowerCase().includes(search) ||
          user.address?.toLowerCase().includes(search)
        );
      });
    },
  },

  async mounted() {
    await this.loadUsers();
  },

  methods: {
    async loadUsers() {
      this.isLoading = true;
      this.loadError = "";

      try {
        this.users = await userApi.getAll();
      } catch (error) {
        this.loadError = "Die Benutzer:innen konnten nicht geladen werden.";
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },

    startEditing(user) {
      this.editingUserId = user.id;
      this.form = {
        name: user.name,
        address: user.address,
      };
      this.errorMessage = "";
      this.successMessage = "";

      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    async saveUser() {
      this.errorMessage = "";
      this.successMessage = "";

      if (!this.form.name || !this.form.address) {
        this.errorMessage = "Bitte füllen Sie alle Pflichtfelder aus.";
        return;
      }

      try {
        await userApi.updateByAdmin(this.editingUserId, this.form);
        this.successMessage = "Benutzer:in wurde aktualisiert.";

        await this.loadUsers();
        this.resetForm();
      } catch (error) {
        this.errorMessage = "Die Benutzer:in konnte nicht gespeichert werden.";
        console.error(error);
      }
    },

    resetForm() {
      this.editingUserId = null;
      this.form = {
        name: "",
        address: "",
      };
    },
  },
};
</script>
