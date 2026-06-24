<template>
  <main class="section">
    <div class="container">
      <header class="page-header">
        <p class="eyebrow">Admin-Bereich</p>
        <h1>Verwaltung</h1>
        <p class="section-intro">
          Administrator:innen können Stammdaten verwalten und Benutzer:innen
          einsehen. Die vollständige Stammdatenverwaltung bauen wir als Nächstes.
        </p>
      </header>

      <div class="cards">
        <article class="card">
          <span class="status-badge">Benutzer</span>
          <h3>Benutzer:innen verwalten</h3>
          <p>
            Admins können vorbereitete Nutzerkonten anzeigen und Profildaten
            bearbeiten.
          </p>
          <RouterLink to="/admin/users" class="btn">
            Benutzer öffnen
          </RouterLink>
        </article>

        <article class="card">
          <span class="status-badge">Stammdaten</span>
          <h3>Professor:innen verwalten</h3>
          <p>
            Professor:innen anzeigen, suchen, erfassen, bearbeiten und löschen.
          </p>
          <RouterLink to="/admin/professoren" class="btn">
            Professor:innen öffnen
          </RouterLink>
        </article>

        <article class="card">
            <span class="status-badge">Transaktionen</span>
            <h3>Teilnahmen nachvollziehen</h3>
            <p>
                Admins können sehen, welche Benutzer:innen an welchen Quiz-Wetten
                teilgenommen haben und wie sich Punkte verändert haben.
            </p>
            <RouterLink to="/admin/teilnahmen" class="btn">
                Teilnahmen öffnen
            </RouterLink>
        </article>

        <article class="card">
            <span class="status-badge">Punkte</span>
            <h3>ECTS-Anträge verwalten</h3>
            <p>
                ECTS-Umwandlungsanträge von Studierenden genehmigen oder ablehnen
                und Punkte verteilen.
            </p>
            <RouterLink to="/admin/ects-antraege" class="btn">
                ECTS-Anträge öffnen
            </RouterLink>
        </article>
      </div>
    </div>
  </main>
</template>