<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import SideRanking from '../components/home_components/SideRanking.vue'
import Login from '../components/home_components/Login.vue'
import SignupForm from '../components/home_components/SignupForm.vue'
import ProfileView from '../components/ProfileView.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const showSignup = ref(false)

// 상태
const isLoggedIn = computed(() => authStore.isLoggedIn)
const accessToken = computed(() => authStore.token);

// 뉴스 상태
const pinnedNews = ref([])
const normalNews = ref([])
const loading = ref(false)
const errorMsg = ref('')

// 뉴스 API 호출
const fetchNews = async () => {
  const token = accessToken.value

  if (!token) {
    console.log('fetchNews 중단: accessToken 없음')
    return
  }

  try {
    loading.value = true
    errorMsg.value = ''

    console.log('뉴스 요청 시작, token:', token)

    const res = await fetch('http://localhost:7070/api/news', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (res.status === 401) {
      throw new Error('인증 실패 (401)')
    }

    if (!res.ok) {
      throw new Error('뉴스 요청 실패')
    }

    const data = await res.json()
    console.log('뉴스 응답:', data)

    pinnedNews.value = data.pinned || []
    normalNews.value = data.list || []

  } catch (err) {
    console.error('뉴스 에러:', err)
    errorMsg.value = '뉴스를 불러오지 못했습니다.'
    pinnedNews.value = []
    normalNews.value = []
  } finally {
    loading.value = false
  }
}

// 최초 로드 시 (새로고침 후 이미 로그인 상태일 경우)
onMounted(() => {
  if (accessToken.value) {
    fetchNews()
  }
})

// accessToken이 세팅되는 순간을 감시 (가장 중요)
watch(accessToken, (token) => {
  console.log('accessToken 변경 감지:', token)

  if (token) {
    fetchNews()
  } else {
    pinnedNews.value = []
    normalNews.value = []
  }
})
</script>

<template>
  <div class="home-wrapper">

    <!-- 왼쪽 프로필 / 로그인 -->
    <aside class="left-panel">
      <ProfileView v-if="isLoggedIn" />

      <template v-else>
        <Login
          v-if="!showSignup"
          @show-signup="showSignup = true"
        />
        <SignupForm
          v-if="showSignup"
          @close="showSignup = false"
        />
      </template>
    </aside>

    <!-- 중앙 뉴스 -->
    <main class="main-panel">
      <h2>선호 팀 뉴스</h2>

      <p v-if="loading">뉴스를 불러오는 중입니다.</p>
      <p v-if="errorMsg">{{ errorMsg }}</p>

      <ul v-if="!loading && pinnedNews.length">
        <li v-for="news in pinnedNews" :key="news.url">
          <a :href="news.url" target="_blank" rel="noopener">
            {{ news.title }}
          </a>
        </li>
      </ul>

      <h2>전체 뉴스</h2>

      <ul v-if="!loading && normalNews.length">
        <li v-for="news in normalNews" :key="news.url">
          <a :href="news.url" target="_blank" rel="noopener">
            {{ news.title }}
          </a>
        </li>
      </ul>
    </main>

    <!-- 오른쪽 패널 -->
    <aside class="right-panel">
      <SideRanking />
    </aside>

  </div>
</template>

<style scoped>
.home-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.left-panel,
.right-panel {
  width: 25%;
  background-color: #222;
  padding: 10px;
  border-radius: 8px;
}

.main-panel {
  width: 50%;
  background-color: #1a1a1a;
  padding: 10px;
  border-radius: 8px;
}
</style>
