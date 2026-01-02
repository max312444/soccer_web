import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import SearchView from '../views/SearchView.vue'
import RankView from '../views/RankView.vue'
import MatchView from '../views/MatchView.vue'
import GuideView from '../views/GuideView.vue'

// 상세 페이지들은 lazy loading
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView
  },
  {
    path: '/rank',
    name: 'rank',
    component: RankView
  },
  {
    path: '/match',
    name: 'match',
    component: MatchView
  },
  {
    path: '/match/:id',
    name: 'matchdetail',
    component: () => import('../views/MatchDetail.vue'),
    props: true
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
    props: true
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
  const userId = localStorage.getItem('username')

  // 홈, 로그인 페이지는 제외
  if (to.path === '/' || to.path === '/login') {
    next()
    return
  }

  // 로그인 안 됐으면 차단
  if (!username) {
    alert('로그인이 필요한 서비스입니다.')
    next('/')
    return
  }

  next()
})

export default router
