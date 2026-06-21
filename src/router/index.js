import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import QuizWettenCatalog from '../views/QuizWettenCatalog.vue'
import QuizWetteDetail from '../views/QuizWetteDetail.vue'
import KontaktView from '../views/KontaktView.vue'
import ImpressumView from '../views/ImpressumView.vue'
import DatenschutzView from '../views/DatenschutzView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/quizwetten',
      name: 'quizwetten',
      component: QuizWettenCatalog
    },
    {
      path: '/quizwetten/:id',
      name: 'quizwette-detail',
      component: QuizWetteDetail
    },
    {
      path: '/kontakt',
      name: 'kontakt',
      component: KontaktView
    },
    {
      path: '/impressum',
      name: 'impressum',
      component: ImpressumView
    },
    {
      path: '/datenschutz',
      name: 'datenschutz',
      component: DatenschutzView
    }
  ],

  scrollBehavior() {
    return { top: 0 }
  }
})

export default router