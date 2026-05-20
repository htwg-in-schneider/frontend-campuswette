<template>
  <section v-if="bannerStore.isVisible" id="home" class="hero">
    <div class="container hero-content">
      <p class="eyebrow">Interaktive Lernplattform</p>
      <h1>CampusWette macht Vorlesungen spannender</h1>
      <p>
        CampusWette verbindet Studium, Spielwährung und Quiz-Wetten.
        Studierende können aktiv teilnehmen, während Lehrende interaktive
        Quiz-Formate für ihre Vorlesungen erstellen.
      </p>

      <div class="banner-actions">
        <a href="#quizwetten" class="btn">Quiz-Wetten ansehen</a>
        <button class="btn secondary" @click="bannerStore.hideBanner">
          Banner ausblenden
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useBannerStore } from '../stores/banner'

const bannerStore = useBannerStore()
</script>