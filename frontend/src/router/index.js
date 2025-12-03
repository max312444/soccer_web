import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import SearchView from '../views/SearchView.vue'
import RankView from '../views/RankView.vue'
import MatchView from '../views/MatchView.vue'
import GuideView from '../views/GuideView.vue'

// 상세 페이지
import TeamDetailView from '../views/TeamDetailView.vue'
import PlayerDetailView from '../views/PlayerDetailView.vue'

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
    path: '/guide',
    name: 'guide',
    component: GuideView
  },

  // 상세 페이지 라우트
  {
    path: "/team/:id",
    name: "TeamDetail",
    component: () => import("../views/TeamDetailView.vue")
  },
  {
    path: "/player/:id",
    name: "PlayerDetail",
    component: () => import("../views/PlayerDetailView.vue")
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

export default router
