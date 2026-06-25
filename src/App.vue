<template>
  <div class="app-shell">
    <Navbar />

    <RouterView />

    <footer class="site-footer">
      <div class="container footer-content">
        <span>CampusWette · Web-Technologien</span>

        <div class="footer-links">
          <RouterLink to="/impressum">Impressum </RouterLink>
          <RouterLink to="/datenschutz">Datenschutz</RouterLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

import Navbar from './components/Navbar.vue'
import { setAccessTokenGetter } from './services/api'

const { getAccessTokenSilently } = useAuth0()

setAccessTokenGetter(getAccessTokenSilently)
</script>