<script setup>
import { ref, onMounted } from 'vue'
import MatchEvent from '../components/MatchEvent.vue'

/**
 * router에서 props: true 로 넘긴 fixtureId
 * /match/:id
 */
const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const API_BASE = 'http://localhost:7070'

/* 상태 */
const loading = ref(true)
const events = ref([])
const error = ref(null)

/* 경기 이벤트 불러오기 */
const fetchMatchEvents = async () => {
  loading.value = true
  error.value = null

  try {
    const res = await fetch(
      `${API_BASE}/api/soccer/match/${props.id}/events`
    )

    if (!res.ok) {
      throw new Error('이벤트 데이터를 불러오지 못했습니다')
    }

    events.value = await res.json()
  } catch (e) {
    console.error(e)
    error.value = '경기 이벤트를 불러오는 중 오류가 발생했습니다'
  } finally {
    loading.value = false
  }
}

onMounted(fetchMatchEvents)
</script>

<template>
  <div class="match-detail-wrapper">

    <h2 class="title">경기 상세</h2>

    <!-- 로딩 -->
    <div v-if="loading" class="status-text">
      이벤트 불러오는 중...
    </div>

    <!-- 에러 -->
    <div v-else-if="error" class="status-text error">
      {{ error }}
    </div>

    <!-- 이벤트 타임라인 -->
    <MatchEvent v-else :events="events" />

  </div>
</template>

