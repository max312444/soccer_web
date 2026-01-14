import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import HomeView from '../views/HomeView.vue'
import SearchView from '../views/SearchView.vue'
import RankView from '../views/RankView.vue'
import MatchView from '../views/MatchView.vue'
import GuideView from '../views/GuideView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView,
    meta: { requiresAuth: true }
  },
  {
    path: '/rank',
    name: 'rank',
    component: RankView,
    meta: { requiresAuth: true }
  },
  {
    path: '/match',
    name: 'match',
    component: MatchView,
    meta: { requiresAuth: true }
  },
  {
    path: '/match/:id',
    name: 'matchdetail',
    component: () => import('../views/MatchDetail.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/guide',
    name: 'guide',
    component: GuideView
  },
  {
    path: '/team/:id',
    name: 'TeamDetail',
    component: () => import('../views/TeamDetailView.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

/* 로그인 여부 확인 */
router.beforeEach((to, from, next) => {
  // Pinia 스토어는 라우터 핸들러 내부에서 호출해야 합니다.
  const authStore = useAuthStore()

  const requiresAuth = to.meta.requiresAuth

  // 인증이 필요한 페이지에 접근하려 하고, 로그인이 되어있지 않다면
  if (requiresAuth && !authStore.isLoggedIn) {
    alert('로그인이 필요한 서비스입니다.')
    next({ name: 'home' }) // 홈으로 리다이렉트
  } else {
    // 그 외의 경우는 정상적으로 진행
    next()
  }
})

export default router
