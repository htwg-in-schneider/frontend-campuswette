<template>
  <div class="app-shell">
    <Navbar />

    <RouterView />

    <footer class="site-footer">
      <div class="container">
        CampusWette · Web-Technologien Finale Abgabe
      </div>
    </footer>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
</script>