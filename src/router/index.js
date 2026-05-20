import { createRouter, createWebHistory } from 'vue-router'
import QuizWettenCatalog from '../views/QuizWettenCatalog.vue'
import QuizWetteDetail from '../views/QuizWetteDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'quizwetten',
      component: QuizWettenCatalog
    },
    {
      path: '/quizwetten/:id',
      name: 'quizwette-detail',
      component: QuizWetteDetail
    }
  ]
})

export default router