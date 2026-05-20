<template>
  <header class="site-header">
    <div class="container nav">
      <RouterLink to="/" class="logo">CampusWette</RouterLink>

      <nav>
        <RouterLink to="/">Alle Quiz-Wetten</RouterLink>
        <RouterLink :to="{ path: '/', query: { status: 'AKTIV' } }">
          Aktiv
        </RouterLink>
        <RouterLink :to="{ path: '/', query: { status: 'ENTWURF' } }">
          Entwürfe
        </RouterLink>
        <RouterLink :to="{ path: '/', query: { status: 'BEENDET' } }">
          Beendet
        </RouterLink>
        <RouterLink to="/quizwetten/new">
          Neue Quiz-Wette
        </RouterLink>
      </nav>
    </div>
  </header>
</template>