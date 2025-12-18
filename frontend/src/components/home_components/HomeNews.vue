<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const accessToken = computed(() => authStore.token)

// 뉴스 상태
const pinnedNews = ref([])
const normalNews = ref([])
const loading = ref(false)
const errorMsg = ref('')

// 뉴스 API 호출
const fetchNews = async () => {
  const token = accessToken.value
  if (!token) return

  try {
    loading.value = true
    errorMsg.value = ''

    const res = await fetch('http://localhost:7070/api/news', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      throw new Error('뉴스 요청 실패')
    }

    const data = await res.json()
    pinnedNews.value = data.pinned || []
    normalNews.value = data.list || []

  } catch (err) {
    console.error(err)
    errorMsg.value = '뉴스를 불러오지 못했습니다.'
    pinnedNews.value = []
    normalNews.value = []
  } finally {
    loading.value = false
  }
}

// 최초 로드
onMounted(() => {
  if (accessToken.value) fetchNews()
})

// 로그인 이후 토큰 세팅 감지
watch(accessToken, (token) => {
  if (token) fetchNews()
  else {
    pinnedNews.value = []
    normalNews.value = []
  }
})
</script>

<template>
  <div class="news-box">
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
  </div>
</template>

<style scoped>
.news-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
