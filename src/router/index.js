import { createRouter, createWebHistory } from 'vue-router'
import QuizWettenCatalog from '../views/QuizWettenCatalog.vue'
import QuizWetteDetail from '../views/QuizWetteDetail.vue'
import CreateQuizWette from '../views/CreateQuizWette.vue'
import EditQuizWette from '../views/EditQuizWette.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'quizwetten',
      component: QuizWettenCatalog
    },
    {
      path: '/quizwetten/new',
      name: 'quizwette-create',
      component: CreateQuizWette
    },
    {
      path: '/quizwetten/:id',
      name: 'quizwette-detail',
      component: QuizWetteDetail
    },
    {
      path: '/quizwetten/:id/edit',
      name: 'quizwette-edit',
      component: EditQuizWette
    }
  ]
})

export default router