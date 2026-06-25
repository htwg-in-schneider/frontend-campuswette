import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from '@auth0/auth0-vue'

import HomeView from '../views/HomeView.vue'
import QuizWettenCatalog from '../views/QuizWettenCatalog.vue'
import QuizWetteDetail from '../views/QuizWetteDetail.vue'
import KontaktView from '../views/KontaktView.vue'
import ImpressumView from '../views/ImpressumView.vue'
import DatenschutzView from '../views/DatenschutzView.vue'
import ProfileView from '../views/ProfileView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'
import AdminUsersView from '../views/AdminUsersView.vue'
import AdminProfessorenView from '../views/AdminProfessorenView.vue'
import AdminTeilnahmenView from '../views/AdminTeilnahmenView.vue'
import EctsRequestView from '../views/EctsRequestView.vue'
import AdminEctsView from '../views/AdminEctsView.vue'
import QuizWettenManageView from '../views/QuizWettenManageView.vue'
import ProfessorDashboardView from '../views/ProfessorDashboardView.vue'
import StudentDashboardView from '../views/StudentDashboardView.vue'
import DashboardRedirectView from '../views/DashboardRedirectView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardRedirectView,
      beforeEnter: authGuard
    },
    {
      path: '/student-dashboard',
      name: 'student-dashboard',
      component: StudentDashboardView,
      beforeEnter: authGuard
    },
    {
      path: '/professor-dashboard',
      name: 'professor-dashboard',
      component: ProfessorDashboardView,
      beforeEnter: authGuard
    },
    {
      path: '/login',
      redirect: '/'
    },
    {
      path: '/quizwetten',
      name: 'quizwetten',
      component: QuizWettenCatalog
    },
    {
      path: '/quizwetten-verwalten',
      name: 'quizwetten-verwalten',
      component: QuizWettenManageView,
      beforeEnter: authGuard
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
    },
    {
      path: '/profil',
      name: 'profil',
      component: ProfileView,
      beforeEnter: authGuard
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminDashboardView,
      beforeEnter: authGuard
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: AdminUsersView,
      beforeEnter: authGuard
    },
    {
      path: '/admin/professoren',
      name: 'admin-professoren',
      component: AdminProfessorenView,
      beforeEnter: authGuard
    },
    {
      path: '/admin/teilnahmen',
      name: 'admin-teilnahmen',
      component: AdminTeilnahmenView,
      beforeEnter: authGuard
    },
    {
      path: '/ects-antraege',
      name: 'ects-antraege',
      component: EctsRequestView,
      beforeEnter: authGuard
    },
    {
      path: '/admin/ects-antraege',
      name: 'admin-ects-antraege',
      component: AdminEctsView,
      beforeEnter: authGuard
    
    }
  ],

  scrollBehavior() {
    return { top: 0 }
  }
})

export default router